#!/usr/bin/env node
/**
 * Switch every local env file between the `production` and `dev` Sanity datasets
 * in one atomic step.
 *
 *   npm run db:dev      → point local frontend + Studio at the `dev` mirror
 *   npm run db:prod     → restore local frontend + Studio to `production`
 *   npm run db:status   → report what each env file currently targets
 *
 * Why a script instead of hand-editing: the dataset is spread across three
 * gitignored files, and the root `.env.local` is inert for `npm run dev` (Next
 * reads env from `frontend/`). Editing only that one looks like a switch but
 * leaves you writing to production. This keeps all three in lockstep.
 *
 * Deployed environments are unaffected: Vercel and the hosted Studio read their
 * own env, and every file touched here is gitignored.
 */

import {readFileSync, writeFileSync, existsSync} from 'node:fs'
import {dirname, join, relative} from 'node:path'
import {fileURLToPath} from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

const PREVIEW_URL = {
  production: 'https://whistlernorthlands.vercel.app',
  dev: 'http://localhost:3000',
}

/** Every file that carries a dataset pointer, and the keys to rewrite in each. */
const TARGETS = [
  {
    file: 'frontend/.env',
    note: 'read by `next dev` — this is the one that decides what the local site reads/writes',
    keys: (ds) => ({NEXT_PUBLIC_SANITY_DATASET: ds}),
  },
  {
    file: 'studio/.env',
    note: 'read by `sanity dev` AND baked into `sanity deploy`',
    keys: (ds) => ({
      SANITY_STUDIO_DATASET: ds,
      SANITY_STUDIO_PREVIEW_URL: PREVIEW_URL[ds],
    }),
  },
  {
    file: '.env.local',
    note: 'Vercel CLI artifact — inert for `npm run dev`, kept in sync so it cannot mislead',
    keys: (ds) => ({NEXT_PUBLIC_SANITY_DATASET: ds}),
  },
]

const DATASET_KEYS = ['NEXT_PUBLIC_SANITY_DATASET', 'SANITY_STUDIO_DATASET']

/** Read `KEY="value"` / `KEY=value` pairs, ignoring comments and blank lines. */
function parseEnv(text) {
  const out = {}
  for (const line of text.split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/i)
    if (!match) continue
    out[match[1]] = match[2]
      .trim()
      .replace(/\s+#.*$/, '')
      .replace(/^["']|["']$/g, '')
  }
  return out
}

/**
 * Rewrite keys in place, preserving comments, blank lines, ordering, trailing
 * inline comments and any secrets in the file. Appends a key that is missing.
 */
function setKeys(text, updates) {
  let result = text
  for (const [key, value] of Object.entries(updates)) {
    const pattern = new RegExp(`^(\\s*${key}\\s*=\\s*)(.*)$`, 'm')
    if (pattern.test(result)) {
      result = result.replace(pattern, (_, prefix, rest) => {
        const trailingComment = rest.match(/\s+(#.*)$/)
        return `${prefix}"${value}"${trailingComment ? ` ${trailingComment[1]}` : ''}`
      })
    } else {
      result = `${result.replace(/\n*$/, '')}\n${key}="${value}"\n`
    }
  }
  return result
}

function readTarget(target) {
  const path = join(ROOT, target.file)
  if (!existsSync(path)) return {...target, path, missing: true}
  const text = readFileSync(path, 'utf8')
  const env = parseEnv(text)
  const key = DATASET_KEYS.find((k) => k in env)
  return {...target, path, text, dataset: key ? env[key] : undefined}
}

function status() {
  const targets = TARGETS.map(readTarget)
  const width = Math.max(...TARGETS.map((t) => t.file.length))

  for (const target of targets) {
    const value = target.missing ? 'MISSING FILE' : (target.dataset ?? 'not set')
    const icon = target.dataset === 'production' ? '🔴' : target.dataset === 'dev' ? '🟢' : '⚠️ '
    console.log(`  ${icon} ${target.file.padEnd(width)}  ${value}`)
    console.log(`     ${' '.repeat(width)}  ${target.note}`)
  }

  const distinct = new Set(targets.map((t) => t.dataset))
  console.log('')
  if (distinct.size > 1) {
    console.log('  ⚠️  MISMATCH — these files disagree. Run `npm run db:dev` or `npm run db:prod`')
    console.log('     to bring them back in sync before starting the dev server.')
    return 1
  }

  const [dataset] = [...distinct]
  if (dataset === 'production') {
    console.log('  🔴 Local dev reads and WRITES the live dataset.')
    console.log('     Run `npm run db:dev` before testing schema or migration changes.')
  } else if (dataset === 'dev') {
    console.log('  🟢 Local dev is on the disposable mirror. Safe to experiment.')
    console.log('     Run `npm run db:prod` before `npm run deploy:studio`.')
  }
  return 0
}

function switchTo(dataset) {
  for (const target of TARGETS.map(readTarget)) {
    if (target.missing) {
      console.log(`  ⚠️  ${target.file} not found — skipped`)
      continue
    }
    const updated = setKeys(target.text, target.keys(dataset))
    if (updated === target.text) {
      console.log(`  ·  ${target.file} already correct`)
      continue
    }
    writeFileSync(target.path, updated)
    console.log(`  ✔  ${target.file} → ${dataset}`)
  }
  console.log('')
  console.log(`  Now targeting: ${dataset}`)
  if (dataset === 'dev') {
    console.log('  Restart `npm run dev` — env is read at process start.')
    console.log('  Remember: assets are shared project-wide, so never delete assets in dev.')
  } else {
    console.log('  Safe to run `npm run deploy:studio`.')
  }
  return 0
}

const arg = process.argv[2]
if (arg === 'status') {
  process.exit(status())
} else if (arg === 'dev' || arg === 'production') {
  process.exit(switchTo(arg))
} else {
  console.error(`Usage: node scripts/use-dataset.mjs <dev|production|status>`)
  process.exit(1)
}
