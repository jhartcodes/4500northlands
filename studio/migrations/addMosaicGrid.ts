/**
 * Adds the Mosaic Grid block to the page, directly below the Community Benefit block.
 *
 * Purely additive — no existing block is touched. Carries the client's deck copy:
 * 9 rows, 23 tiles (15 text, 8 photos).
 *
 * Photos: the client's eight images, attached in both datasets. Run
 * copyMosaicAssetsToProd.ts first on a fresh production dataset — the ids differ per
 * dataset, so PHOTOS below is keyed by dataset name and the run aborts if the current
 * dataset has no entry.
 *
 * Target: defaults to every version (published plus any existing draft). Pass
 * --target=draft to stage it instead of publishing straight to the live site.
 *
 * Idempotent — keys are deterministic, so a re-run replaces the block in place.
 *
 * Dry:   cd studio && npx sanity exec migrations/addMosaicGrid.ts --with-user-token -- --dry-run
 * Dev:   cd studio && npx sanity exec migrations/addMosaicGrid.ts --with-user-token
 * Prod:  ALLOW_PROD_MIGRATION=1 npx sanity exec migrations/addMosaicGrid.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset
const DRY_RUN = process.argv.includes('--dry-run')
const IS_PROD = dataset === 'production'

const BLOCK_KEY = 'mosaicGridHighlights'
const ANCHOR_TYPE = 'communityBenefitBlock'

type Target = 'draft' | 'published' | 'all'
const targetArg = process.argv.find((a) => a.startsWith('--target='))?.split('=')[1] as
  | Target
  | undefined
const TARGET: Target = targetArg ?? 'all'

// ---------------------------------------------------------------- photos

/**
 * The client's eight photos, in the order the eight image tiles appear in the document.
 * They were uploaded through a Studio pointed at `dev`, then copied into production by
 * copyMosaicAssetsToProd.ts. Re-uploading changed the content hash for seven of the
 * eight, so each dataset needs its own ids — hence the map rather than one list.
 */
const PHOTOS: Record<string, Array<{id: string; alt: string}>> = {
  dev: [
    {id: 'image-588ddab312a46208e8eec7945d22cd57f7bb4ad1-760x464-png', alt: ''},
    {id: 'image-7f0987c2682ec8f5055caa98a27ec84753280d94-1024x700-png', alt: ''},
    {id: 'image-07224ce530d60321c9de430147cb54946da809fe-612x408-jpg', alt: ''},
    {id: 'image-5c38587f43fb809945e1ed6c5beb876fdda41673-540x360-jpg', alt: ''},
    {id: 'image-46a114e4abb9dc606909ff4b828dbb63dade522d-1024x788-jpg', alt: ''},
    {id: 'image-9c9b858993bff6a0e43a152597b8ceff0118bf8c-1255x658-png', alt: ''},
    {id: 'image-50d90fb42a14f3b247edffa9b2d8e474d5f774ee-640x427-png', alt: ''},
    {id: 'image-95c4673761cafc46523888b9c9e4bce7401a9547-612x408-jpg', alt: ''},
  ],
  production: [
    {id: 'image-356186c087a41d9ffb69ff318dfe5b8c678dfeba-760x464-png', alt: ''},
    {id: 'image-7f0987c2682ec8f5055caa98a27ec84753280d94-1024x700-png', alt: ''},
    {id: 'image-d8868496484239fa03cef80ba48ad24b893ab84d-612x408-jpg', alt: ''},
    {id: 'image-edd19b0debc39932f1988e7cdf60188b485152b7-540x360-jpg', alt: ''},
    {id: 'image-7c6e5a48ad955a7484706303d0d029d9184f29bc-1024x788-jpg', alt: ''},
    {id: 'image-ad7f3b025842473199d428258ba7350822a52282-1255x658-png', alt: ''},
    {id: 'image-1ba21d47352a2b15718c6ca9631cd83589c2e6d1-640x427-png', alt: ''},
    {id: 'image-0c51fead84426eec7d54bb7dba3b1d0f8568c448-612x408-jpg', alt: ''},
  ],
}

/** Alt text, shared across datasets — same photo in each slot. */
const PHOTO_ALTS = [
  'New townhomes and an outdoor pool at 4500 Northlands, with the Whistler mountains behind',
  'A group of people joining hands together in a circle',
  'A traffic signal showing green against a blue sky',
  'A cyclist riding in a marked bicycle lane',
  'Children reaching their hands together in a circle',
  'People gathered on landscaped terraces beside a pond',
  'Cyclists riding the Valley Trail with mountain views',
  'A family with exercise equipment inside a recreation facility',
]

// ---------------------------------------------------------------- deck copy

type TileBg = 'white' | 'cream' | 'mist'
type TileSpec =
  | {kind: 'text'; bg: TileBg; title?: string; body: string}
  | {kind: 'image'}

const t = (bg: TileBg, body: string, title?: string): TileSpec => ({kind: 'text', bg, body, title})
const img = (): TileSpec => ({kind: 'image'})

/**
 * Transcribed verbatim from the client's deck, including "Childrens" without an
 * apostrophe. Sand tiles map to `cream`, mint to `mist`, pale to `white`.
 */
const ROWS: TileSpec[][] = [
  [t('cream', 'New Homes', '277'), img(), t('mist', 'Units of Dedicated Employee Housing', '60')],
  [t('mist', 'Amenity Contribution', '$45M'), img()],
  [img(), t('white', 'New Arrival Plaza'), img()],
  [
    t('cream', 'Acres of Parkland at 4700 Blackcomb Way', '13.5'),
    t('mist', 'An Integrated Network of Pedestrian and Cycling Connections'),
  ],
  [t('mist', 'Local-Serving Commercial Space'), img(), t('white', 'Childrens Play Area')],
  [img(), t('mist', 'Informal Recreation Spaces and Landscaped Gathering Areas')],
  [
    t('white', 'Enhancements to the Valley Trail'),
    img(),
    t('mist', 'Off-Site and On-site Infrastructure Enhancements'),
  ],
  [
    t('white', 'Upgrades to the Lorimer Road and Northlands Boulevard intersection'),
    t('cream', 'Extension of the Village Stroll along Northlands Boulevard'),
  ],
  [
    t('cream', 'towards an Off-Site Multi-Use Recreation Facility', '$15M'),
    img(),
    t('mist', 'Community Investment Fund', '$12M'),
  ],
]

// ---------------------------------------------------------------- block builder

function buildBlock(photos: Array<{id: string; alt: string}>) {
  let imageIndex = 0

  return {
    _key: BLOCK_KEY,
    _type: 'mosaicGridBlock',
    background: 'white',
    rows: ROWS.map((tiles, rowIndex) => ({
      _key: `mg-row-${rowIndex}`,
      _type: 'mosaicRow',
      tiles: tiles.map((tile, tileIndex) => {
        const _key = `mg-${rowIndex}-${tileIndex}`

        if (tile.kind === 'image') {
          const slot = imageIndex++
          const photo = photos[slot]
          if (!photo) throw new Error(`No photo configured for image slot ${slot}`)
          return {
            _key,
            _type: 'imageTile',
            image: {
              _type: 'image',
              asset: {_type: 'reference', _ref: photo.id},
              alt: PHOTO_ALTS[slot] ?? '',
            },
          }
        }

        return {
          _key,
          _type: 'textTile',
          background: tile.bg,
          // initialValue only applies in the Studio UI, so sizes are set explicitly here.
          ...(tile.title ? {title: tile.title, titleSize: 'large'} : {}),
          body: tile.body,
          bodySize: 'medium',
        }
      }),
    })),
  }
}

// ---------------------------------------------------------------- run

type PageDoc = {_id: string; pageBuilder?: Array<{_key: string; _type: string}>}

function place(pageBuilder: PageDoc['pageBuilder'], block: ReturnType<typeof buildBlock>) {
  const blocks = [...(pageBuilder ?? [])]

  const existing = blocks.findIndex((b) => b._key === BLOCK_KEY)
  if (existing >= 0) {
    blocks[existing] = block
    return {blocks, action: `replaced at index ${existing}`}
  }

  const anchor = blocks.findIndex((b) => b._type === ANCHOR_TYPE)
  if (anchor < 0) {
    throw new Error(`No ${ANCHOR_TYPE} found — cannot decide where the mosaic goes.`)
  }
  blocks.splice(anchor + 1, 0, block)
  return {blocks, action: `inserted at index ${anchor + 1}, after ${ANCHOR_TYPE}`}
}

async function ensureDraft(publishedId: string) {
  const draftId = `drafts.${publishedId}`
  const existing = await client.getDocument(draftId)
  if (existing) return existing as unknown as PageDoc

  const published = await client.getDocument(publishedId)
  if (!published) throw new Error(`No published document ${publishedId}`)

  if (DRY_RUN) {
    console.log(`  would create draft ${draftId} from the published page`)
    return {...published, _id: draftId} as unknown as PageDoc
  }

  const {_rev, _createdAt, _updatedAt, ...rest} = published as Record<string, unknown> & {
    _rev?: string
    _createdAt?: string
    _updatedAt?: string
  }
  console.log(`  created draft ${draftId}`)
  return (await client.create({...rest, _id: draftId})) as unknown as PageDoc
}

async function run() {
  if (IS_PROD && process.env.ALLOW_PROD_MIGRATION !== '1') {
    throw new Error('Refusing to touch production. Re-run with ALLOW_PROD_MIGRATION=1.')
  }

  const photos = PHOTOS[dataset]
  if (!photos) {
    throw new Error(
      `No photo ids configured for dataset "${dataset}". Known: ${Object.keys(PHOTOS).join(', ')}.`,
    )
  }

  const block = buildBlock(photos)
  const tileCount = block.rows.reduce((n, r) => n + r.tiles.length, 0)

  console.log(`dataset: ${dataset}`)
  console.log(`target:  ${TARGET}${targetArg ? ' (explicit)' : ' (default)'}`)
  console.log(`photos:  ${photos.length} attached from the ${dataset} asset set`)
  console.log(`block:   ${block.rows.length} rows, ${tileCount} tiles`)
  console.log(DRY_RUN ? 'mode:    DRY RUN — nothing will be written\n' : 'mode:    WRITING\n')

  const published: PageDoc[] = await client.fetch(
    `*[_type == "page" && !(_id in path("drafts.**"))]{_id, pageBuilder}`,
  )
  if (published.length === 0) throw new Error('No page documents found.')

  for (const page of published) {
    const targets: PageDoc[] = []

    // 'draft' creates the draft if it is missing; 'all' only patches one that already
    // exists, so a routine dev run never conjures a draft for someone to trip over.
    if (TARGET === 'draft') {
      targets.push(await ensureDraft(page._id))
    }
    if (TARGET === 'published' || TARGET === 'all') {
      targets.push(page)
    }
    if (TARGET === 'all') {
      const draft = (await client.getDocument(`drafts.${page._id}`)) as unknown as PageDoc | null
      if (draft) targets.push(draft)
    }

    for (const doc of targets) {
      const {blocks, action} = place(doc.pageBuilder, block)
      console.log(`${doc._id}: ${action} (${blocks.length} blocks total)`)

      if (!DRY_RUN) {
        await client.patch(doc._id).set({pageBuilder: blocks}).commit()
      }
    }
  }

  console.log(DRY_RUN ? '\nDry run complete — no writes.' : '\nDone.')
}

run().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
