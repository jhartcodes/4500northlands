/**
 * One-off migration: replace the deprecated `cacCalculationBlock` on the home page
 * with two blocks in-place:
 *   1. imageTextBlock  — the CAC 101 intro (image + narrative), carried over from the old block
 *   2. cacValueBlock   — the new "CAC Value" module (total card + value cards + incentive bar)
 *
 * Run (dev):   cd studio && npx sanity exec migrations/replaceCacBlock.ts --with-user-token
 * Dry run:     cd studio && npx sanity exec migrations/replaceCacBlock.ts --with-user-token -- --dry-run
 * Production:  SANITY_STUDIO_DATASET=production npx sanity exec migrations/replaceCacBlock.ts --with-user-token
 *
 * Idempotent: if no cacCalculationBlock is found, it exits without changes.
 */
import {getCliClient} from 'sanity/cli'

const DRY_RUN = process.argv.includes('--dry-run')
const client = getCliClient({apiVersion: '2025-09-25'})

const key = (() => {
  let n = 0
  return (prefix: string) => `${prefix}${Date.now().toString(36)}${(n++).toString(36)}`
})()

// Build a single portable-text block from [text, isBold] segments
function ptBlock(segments: Array<[string, boolean?]>) {
  return {
    _key: key('blk'),
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: segments.map(([text, bold]) => ({
      _key: key('sp'),
      _type: 'span',
      text,
      marks: bold ? ['strong'] : [],
    })),
  }
}

// Build the two replacement blocks from an existing cacCalculationBlock.
function buildReplacement(old: any) {
  // 1. Intro → reuse imageTextBlock, carry over existing content. sectionId "cac" fixes the nav anchor.
  const introBlock = {
    _key: key('cacIntro'),
    _type: 'imageTextBlock',
    sectionId: 'cac',
    imagePosition: old.imagePosition || 'right',
    background: 'white',
    image: old.introImage,
    sectionLabel: old.sectionLabel || undefined,
    title: old.title || 'Community Amenity Contributions',
    showDivider: old.showDivider ?? true,
    body: old.introBody || [],
  }

  // 2. New CAC Value module, seeded from the approved design.
  const valueBlock = {
    _key: key('cacValue'),
    _type: 'cacValueBlock',
    totalValue: '$46M',
    totalLabel: 'Total CAC Value',
    totalSubtitle: [
      ptBlock([
        ['Including the ', false],
        ['$1M', true],
        [' RMOW Schedule Incentive Contribution', false],
      ]),
    ],
    valueCards: [
      {_key: key('vc'), value: '$15M', label: 'Investment towards Off-site Recreation'},
      {_key: key('vc'), value: '$3M', label: '13.5 acres of parkland for the Community'},
      {_key: key('vc'), value: '$12M', label: 'Community Investment Fund – cash contribution'},
      {_key: key('vc'), value: '$15M', label: 'Equity towards 60 units of onsite Employee Housing'},
    ],
    incentive: {
      value: '$1M',
      label: 'RMOW Schedule Incentive Contribution',
      body: [
        ptBlock([
          [
            'To support the timely delivery of housing and community benefits, Beedie Living has proposed an additional $1 million contribution to RMOW tied to key rezoning milestones. This includes a ',
            false,
          ],
          ['$500,000', true],
          [' contribution if the application achieves ', false],
          ['Second Reading by July 31, 2026', true],
          [', and a further ', false],
          ['$500,000', true],
          [' if ', false],
          ['rezoning enactment is achieved by May 1, 2027', true],
          [
            '. This contribution is above and beyond the proposed CAC package and reflects a shared commitment to advancing the project as efficiently as possible.',
            false,
          ],
        ]),
      ],
    },
  }

  return {introBlock, valueBlock}
}

async function run() {
  // Fetch ALL versions of the home page (published AND any draft) so a stale draft
  // can't later be published over the migrated content.
  const pages: Array<{_id: string; pageBuilder?: any[]}> = await client.fetch(
    `*[_type == "page" && slug.current == "home"]{_id, pageBuilder}`,
  )
  if (!pages.length) throw new Error('Home page not found')

  console.log(`Dataset: ${client.config().dataset} | Found ${pages.length} version(s): ${pages.map((p) => p._id).join(', ')}`)

  let migrated = 0
  for (const page of pages) {
    const blocks: any[] = page.pageBuilder || []
    const idx = blocks.findIndex((b) => b._type === 'cacCalculationBlock')
    if (idx === -1) {
      console.log(`  ${page._id}: no cacCalculationBlock — skipping.`)
      continue
    }
    const old = blocks[idx]
    const {introBlock, valueBlock} = buildReplacement(old)
    const newPageBuilder = [...blocks.slice(0, idx), introBlock, valueBlock, ...blocks.slice(idx + 1)]

    console.log(
      `  ${page._id}: replacing cacCalculationBlock (_key=${old._key}) at index ${idx} ` +
        `with imageTextBlock + cacValueBlock. ${blocks.length} -> ${newPageBuilder.length} blocks.` +
        (DRY_RUN ? ' [dry-run]' : ''),
    )

    if (!DRY_RUN) {
      await client.patch(page._id).set({pageBuilder: newPageBuilder}).commit()
      migrated++
    }
  }

  if (DRY_RUN) console.log('--dry-run: no changes written.')
  else console.log(`✔ Migration committed to ${migrated} version(s).`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
