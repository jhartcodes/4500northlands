/**
 * One-off migration for the Timeline Block rich-text change.
 *
 * Block A (year timeline, _key cccc98227a25)
 *   Replaces all ten phases with the client's approved deck copy as portable text.
 *   Remaps 2023 + 2024 into a single "2023 - 2024" card, adds "2027 Onwards",
 *   sets 2026 active / 2027 Onwards upcoming, and clears the stale test activeLabels.
 *
 * Block B (process timeline, _key 40ab27f80ab2)
 *   Converts each plain-string description into portable text, keeping the phase's old
 *   `title` as a bold lead-in paragraph so no copy is lost. Dates/statuses untouched.
 *
 * Both blocks drop the now-deleted `title` field.
 *
 * Dry:   cd studio && npx sanity exec migrations/timelineRichText.ts --with-user-token -- --dry-run
 * Dev:   cd studio && npx sanity exec migrations/timelineRichText.ts --with-user-token
 * Prod:  ALLOW_PROD_MIGRATION=1 npx sanity exec migrations/timelineRichText.ts --with-user-token
 *
 * Patches every version of the page (published AND drafts) — see README §6.
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset
const DRY_RUN = process.argv.includes('--dry-run')

const BLOCK_A_KEY = 'cccc98227a25'
const BLOCK_B_KEY = '40ab27f80ab2'

// ---------------------------------------------------------------- portable text helpers

let keySeq = 0
const nextKey = () => `tl${Date.now().toString(36)}${(keySeq++).toString(36)}`

/** Splits on **bold** segments so the copy below stays readable/reviewable. */
function spans(text: string) {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part) => {
      const bold = part.startsWith('**') && part.endsWith('**')
      return {
        _type: 'span',
        _key: nextKey(),
        text: bold ? part.slice(2, -2) : part,
        marks: bold ? ['strong'] : [],
      }
    })
}

const p = (text: string) => ({
  _type: 'block',
  _key: nextKey(),
  style: 'normal',
  markDefs: [],
  children: spans(text),
})

const li = (text: string) => ({
  _type: 'block',
  _key: nextKey(),
  style: 'normal',
  listItem: 'bullet',
  level: 1,
  markDefs: [],
  children: spans(text),
})

// ---------------------------------------------------------------- Block A content
// Transcribed verbatim from the client's timeline deck, including the unfilled
// "XX Date:" placeholder and their "Forth" spelling in the 2027 bylaw readings.

const BLOCK_A_PHASES = [
  {
    date: '2017',
    status: 'completed',
    body: [
      p('Beedie Living purchases 4500 Northlands from Holborn.'),
      p('**December 2017:** RMOW endorses continuation of the 2010–2013 OCP update.'),
    ],
  },
  {
    date: '2018',
    status: 'completed',
    body: [
      p(
        '**2018:** A rezoning application could not proceed until the Official Community Plan of Whistler was adopted.'
      ),
      p('**XX Date:** Beedie begins conversations with key stakeholders in the community.'),
    ],
  },
  {
    date: '2019',
    status: 'completed',
    body: [p('**2019:** OCP still moving through the formal RMOW Council process')],
  },
  {
    date: '2020',
    status: 'completed',
    body: [
      p(
        '**February 2020:** After RMOW hired a new Planning GM, Beedie submitted a Letter of Intent to rezone the property.'
      ),
      p('**June 23, 2020:** RMOW adopted the updated Official Community Plan (OCP).'),
      p('**September 2020:** RMOW began drafting a formal engagement plan.'),
    ],
  },
  {
    date: '2021',
    status: 'completed',
    body: [
      p(
        '**February 2021:** RMOW proposed a draft schedule with three public engagement rounds. Beedie did not agree to the extended timeline but worked with staff to revise and streamline it.'
      ),
      p(
        '**March 2021:** Mayor and Council endorsed a three-phase public engagement process for 4500 Northlands.'
      ),
      p(
        '**Summer 2021:** Phase 1 of community engagement completed and phase 1 guiding principles published.'
      ),
    ],
  },
  {
    date: '2022',
    status: 'completed',
    body: [
      p(
        '**April 2022:** Beedie submitted a rezoning package that reflected feedback from the first phase of community engagement.'
      ),
      p('**Summer 2022:** Phase 2 of Community Engagement completed.'),
      p('Beedie presents two concepts to:'),
      li('Strategic Planning Committee'),
      li('Advisory Design Panel'),
      li('Recreation and Leisure Advisory Committee'),
      li('Transportation Advisory Group'),
      li('Accessibility and Inclusion Committee'),
    ],
  },
  {
    date: '2023 - 2024',
    status: 'completed',
    body: [
      p('**January 2023:** Beedie presents to the Rotary Club.'),
      p(
        '**February 21, 2023:** Council received the Phase 2 Community Engagement Summary and directed staff to advance the 4500 Northlands enhanced rezoning process to Phase 3.'
      ),
      p(
        'Beedie continues to meet with key stakeholders in the community to discuss the CAC.'
      ),
    ],
  },
  {
    date: '2025',
    status: 'completed',
    body: [
      p(
        '**January 2025:** Beedie engages Ekistics and Leckie to create a new design proposal based on the Phase 2 Key Directions.'
      ),
      p('**May 27, 2025:** Rezoning update to the Committee of the Whole.'),
      p("**Fall 2025:** RMOW 'Add Your Voice' Event"),
      p(
        'Two Applicant led Open Houses – with both a physical and online CAC Questionnaire.'
      ),
      p('Beedie meets with 44 community stakeholders including:'),
      li('Housing and Strategy Committee'),
      li('Whistler Housing Authority'),
      li('Whistler Chamber of Commerce'),
      li('Whistler Community Foundation'),
      li('Whistler Community Services Society'),
      li('Whistler Health Care Foundation'),
    ],
  },
  {
    date: '2026',
    status: 'active',
    body: [
      p(
        '**January 6, 2026:** Phase 3 Guiding Principles presented to Council. Council prioritizes housing and recreation.'
      ),
      p('**May 1, 2026:** Beedie submits rezoning application and CAC letter.'),
      p('**July 7, 2026:** Community stakeholder update.'),
      p('**July 14, 2026 -** Direction to Proceed carries unanimously.'),
      p('**August 19, 2026:** Beedie presents to Advisory Design Panel'),
      p('**September 28, 2026:** Beedie presents to Housing and Strategy Committee'),
      p('**October 7, 2026:** Beedie presents to Accessibility and Inclusion Committee'),
      p("**November:** RMOW 'Add Your Voice' Event"),
    ],
  },
  {
    date: '2027 Onwards',
    status: 'upcoming',
    body: [
      p('**2027:** Beedie Enters Phase 3 Council milestones:'),
      li('First, Second, Third and Forth Bylaw Readings'),
      li('Phase 1 Development Permit Application'),
      li('Prior to & Legal Agreements'),
      li('Servicing Agreements'),
      li('Phase 4 Adoption'),
      li('Phase 1 Development Permit Approval'),
      li('Conclusion of Phase 3 Approval Process'),
      p(
        '**Early 2028:** Phase 1 Sales Launch and Phase 2 Development Permit Application'
      ),
    ],
  },
]

// ---------------------------------------------------------------- run

/** Builds the patch for one version of the page document. */
function buildPatch(page: {_id: string; pageBuilder?: any[]}) {
  const blockA = page.pageBuilder?.find((b) => b._key === BLOCK_A_KEY)
  const blockB = page.pageBuilder?.find((b) => b._key === BLOCK_B_KEY)
  const patch: Record<string, unknown> = {}
  const notes: string[] = []

  if (blockA?.phases) {
    // Always rewritten from the deck copy, so this is idempotent by construction.
    patch[`pageBuilder[_key=="${BLOCK_A_KEY}"].phases`] = BLOCK_A_PHASES.map((phase, i) => ({
      _key: blockA.phases[i]?._key ?? nextKey(),
      _type: blockA.phases[i]?._type ?? 'phase',
      date: phase.date,
      status: phase.status,
      description: phase.body,
    }))
    notes.push(`Block A: ${BLOCK_A_PHASES.length} phases written (found ${blockA.phases.length})`)
  } else {
    notes.push('Block A: not present — skipped')
  }

  if (blockB?.phases) {
    if (blockB.phases.every((ph: any) => Array.isArray(ph.description))) {
      notes.push('Block B: already portable text — skipped')
    } else {
      patch[`pageBuilder[_key=="${BLOCK_B_KEY}"].phases`] = blockB.phases.map((ph: any) => {
        const {title, description, ...rest} = ph
        if (Array.isArray(description)) return ph
        return {
          ...rest,
          description: [...(title ? [p(`**${title}**`)] : []), p(description ?? '')],
        }
      })
      notes.push(`Block B: ${blockB.phases.length} phases converted`)
    }
  } else {
    notes.push('Block B: not present — skipped')
  }

  return {patch, notes}
}

async function run() {
  if (dataset === 'production' && process.env.ALLOW_PROD_MIGRATION !== '1') {
    console.error(
      '\n  ✖ Refusing to run against "production".\n' +
        '    Re-run with ALLOW_PROD_MIGRATION=1 once you have a fresh backup.\n'
    )
    process.exit(1)
  }

  // Fetch EVERY version of the page — published AND any draft. Patching only the
  // published doc lets a stale draft silently revert this when it is later published.
  const pages: Array<{_id: string; pageBuilder?: any[]}> = await client.fetch(
    `*[_type == "page" && count(pageBuilder[_type == "timelineBlock"]) > 0]{_id, pageBuilder}`
  )

  console.log(
    `\n  dataset: ${dataset}${DRY_RUN ? '  (--dry-run — nothing will be written)' : ''}` +
      `\n  versions found: ${pages.map((v) => v._id).join(', ') || 'none'}\n`
  )

  if (!pages.length) throw new Error('No page with a timelineBlock found.')

  for (const page of pages) {
    const {patch, notes} = buildPatch(page)
    console.log(`  ${page._id}`)
    notes.forEach((n) => console.log(`      ${n}`))

    if (!Object.keys(patch).length) {
      console.log('      nothing to write')
      continue
    }
    if (!DRY_RUN) await client.patch(page._id).set(patch).commit()
  }

  console.log(DRY_RUN ? '\n  --dry-run: no changes written.\n' : `\n  ✔ Done in "${dataset}".\n`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
