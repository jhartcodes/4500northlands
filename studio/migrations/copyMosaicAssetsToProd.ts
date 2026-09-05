/**
 * Copies the eight Mosaic Grid photos from `dev` into `production`.
 *
 * The client uploaded them through a Studio pointed at `dev`, so they never reached
 * production. Sanity derives an asset's _id from the file's content hash, so the same
 * bytes land on the same _id in both datasets — which is why addMosaicGrid.ts can
 * reference one fixed set of ids regardless of dataset.
 *
 * Safe to re-run: an upload of identical bytes de-duplicates to the existing asset.
 *
 * Run: cd studio && ALLOW_PROD_MIGRATION=1 npx sanity exec migrations/copyMosaicAssetsToProd.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

const DRY_RUN = process.argv.includes('--dry-run')
const SOURCE_DATASET = 'dev'
const TARGET_DATASET = 'production'

const client = getCliClient()
const source = client.withConfig({dataset: SOURCE_DATASET})
const target = client.withConfig({dataset: TARGET_DATASET})


function cdnUrl(assetId: string) {
  const match = /^image-([0-9a-f]{40})-(\d+x\d+)-(\w+)$/.exec(assetId)
  if (!match) throw new Error(`Unrecognised asset id: ${assetId}`)
  const [, hash, dims, ext] = match
  return `https://cdn.sanity.io/images/${client.config().projectId}/${SOURCE_DATASET}/${hash}-${dims}.${ext}`
}

async function run() {
  if (process.env.ALLOW_PROD_MIGRATION !== '1') {
    throw new Error('Writes to production. Re-run with ALLOW_PROD_MIGRATION=1.')
  }

  // Pull the batch straight from dev rather than hard-coding a list that can drift.
  const assets: Array<{_id: string; originalFilename: string}> = await source.fetch(
    `*[_type == "sanity.imageAsset" && _createdAt > $after] | order(_createdAt asc){_id, originalFilename}`,
    {after: '2026-09-05T05:00:00Z'},
  )

  console.log(`${SOURCE_DATASET} -> ${TARGET_DATASET}`)
  console.log(`${assets.length} assets to copy`)
  console.log(DRY_RUN ? 'mode: DRY RUN\n' : 'mode: WRITING\n')

  for (const asset of assets) {
    const existing = await target.fetch(`*[_id == $id][0]._id`, {id: asset._id})
    if (existing) {
      console.log(`  skip    ${asset.originalFilename} — already in ${TARGET_DATASET}`)
      continue
    }

    if (DRY_RUN) {
      console.log(`  would copy ${asset.originalFilename}  (${asset._id})`)
      continue
    }

    const res = await fetch(cdnUrl(asset._id))
    if (!res.ok) throw new Error(`Download failed for ${asset.originalFilename}: ${res.status}`)
    const buffer = Buffer.from(await res.arrayBuffer())

    const uploaded = await target.assets.upload('image', buffer, {
      filename: asset.originalFilename,
    })

    const same = uploaded._id === asset._id
    console.log(`  copied  ${asset.originalFilename}`)
    console.log(`          ${uploaded._id}${same ? '' : `  (!! id differs from dev ${asset._id})`}`)
  }

  console.log(DRY_RUN ? '\nDry run complete.' : '\nDone.')
}

run().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
