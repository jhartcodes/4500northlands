import {getCliClient} from 'sanity/cli'

/**
 * Renames `fullWidthImageBlock` → `imageBlock` on every page-builder array item.
 *
 * The two schemas share every field (sectionId, image, image.alt), and the new
 * block treats a missing `layout`/`height` as full-width/short — which is the
 * old block's exact behaviour. So this only rewrites `_type`; nothing else moves
 * and the rendered output is unchanged.
 *
 * SAFE TO RUN BEFORE OR AFTER THE FRONTEND DEPLOY: BlockRenderer maps both type
 * names to the same component while the alias is in place. Remove the alias only
 * once this has been applied to production.
 *
 * Patches every version of each document (published + drafts). Patching only the
 * published doc would let someone publishing a stale draft silently revert this.
 *
 *   cd studio
 *   npx sanity exec migrations/renameFullWidthImageToImageBlock.ts --with-user-token -- --dry-run
 *   npx sanity exec migrations/renameFullWidthImageToImageBlock.ts --with-user-token
 */

const OLD_TYPE = 'fullWidthImageBlock'
const NEW_TYPE = 'imageBlock'

const dryRun = process.argv.includes('--dry-run')
const client = getCliClient({apiVersion: '2025-08-15'})

type Block = {_key: string; _type: string}
type PageDoc = {_id: string; _rev: string; pageBuilder?: Block[]}

async function run() {
  const dataset = client.config().dataset
  console.log(`\n${dryRun ? 'DRY RUN' : 'APPLYING'} — dataset: ${dataset}\n`)

  // path("**") matches drafts and versions as well as published documents.
  const docs: PageDoc[] = await client.fetch(
    `*[_type == "page" && count(pageBuilder[_type == $oldType]) > 0]{_id, _rev, pageBuilder}`,
    {oldType: OLD_TYPE},
  )

  if (docs.length === 0) {
    console.log(`No documents contain a "${OLD_TYPE}" block. Nothing to do.\n`)
    return
  }

  let totalBlocks = 0
  const tx = client.transaction()

  for (const doc of docs) {
    const targets = (doc.pageBuilder ?? []).filter((b) => b._type === OLD_TYPE)
    totalBlocks += targets.length
    console.log(`${doc._id}`)
    for (const b of targets) {
      console.log(`    ${b._key}  ${OLD_TYPE} → ${NEW_TYPE}`)
    }

    if (!dryRun) {
      const patch = client
        .patch(doc._id)
        .ifRevisionId(doc._rev)
        .set(
          Object.fromEntries(
            targets.map((b) => [`pageBuilder[_key=="${b._key}"]._type`, NEW_TYPE]),
          ),
        )
      tx.patch(patch)
    }
  }

  console.log(
    `\n${totalBlocks} block(s) across ${docs.length} document(s)${dryRun ? ' would be' : ''} renamed.`,
  )

  if (dryRun) {
    console.log('Dry run — nothing written. Re-run without --dry-run to apply.\n')
    return
  }

  await tx.commit()
  console.log('Committed.\n')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
