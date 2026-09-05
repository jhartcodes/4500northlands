#!/usr/bin/env node
/**
 * Refuse to deploy the hosted Studio unless `studio/.env` targets production.
 *
 * `sanity deploy` bakes SANITY_STUDIO_DATASET in at build time. Deploying while
 * pointed at the `dev` mirror silently repoints whistler-northlands.sanity.studio
 * at `dev` — editors keep publishing and nothing ever reaches the live site.
 *
 * Runs automatically as `predeploy`. Override for a deliberate non-prod deploy:
 *   ALLOW_NON_PROD_STUDIO_DEPLOY=1 npm run deploy --workspace=studio
 */

import {readFileSync, existsSync} from 'node:fs'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'

const ENV_PATH = join(dirname(fileURLToPath(import.meta.url)), '..', '.env')

function fail(lines) {
  console.error('')
  console.error('  ✖ Studio deploy blocked')
  console.error('')
  for (const line of lines) console.error(`    ${line}`)
  console.error('')
  console.error('    Fix: npm run db:prod   (from the repo root)')
  console.error('')
  process.exit(1)
}

if (process.env.ALLOW_NON_PROD_STUDIO_DEPLOY === '1') {
  console.warn('  ⚠️  ALLOW_NON_PROD_STUDIO_DEPLOY=1 — skipping the production check')
  process.exit(0)
}

if (!existsSync(ENV_PATH)) {
  fail(['studio/.env is missing, so the deploy would fall back to defaults.'])
}

const env = {}
for (const line of readFileSync(ENV_PATH, 'utf8').split('\n')) {
  const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/i)
  if (match) {
    env[match[1]] = match[2]
      .trim()
      .replace(/\s+#.*$/, '')
      .replace(/^["']|["']$/g, '')
  }
}

const dataset = env.SANITY_STUDIO_DATASET
const previewUrl = env.SANITY_STUDIO_PREVIEW_URL || ''

if (dataset !== 'production') {
  fail([
    `SANITY_STUDIO_DATASET is "${dataset ?? 'not set'}", not "production".`,
    'Deploying now would repoint the hosted Studio away from live content.',
  ])
}

if (previewUrl.includes('localhost')) {
  fail([
    `SANITY_STUDIO_PREVIEW_URL is "${previewUrl}".`,
    'The hosted Studio would try to preview against your laptop.',
  ])
}

console.log(`  ✔ studio/.env targets production (preview: ${previewUrl})`)
