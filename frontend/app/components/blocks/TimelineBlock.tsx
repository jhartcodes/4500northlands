'use client'

import type {CmsPortableText} from '@/sanity/lib/types'
import CustomPortableText from '@/app/components/PortableText'
import SectionWrapper from '@/app/components/ui/SectionWrapper'

type TimelinePhase = {
  _key: string
  date?: string
  /** Rich text. `string` is the pre-migration shape — see PhaseDescription. */
  description?: CmsPortableText | string
  status?: 'completed' | 'active' | 'upcoming'
  activeLabel?: string
}

type TimelineBlockProps = {
  block: {
    _key: string
    _type: 'timelineBlock'
    sectionId?: string
    background?: 'white' | 'cream' | 'mist'
    legendLabel?: string
    legendDescription?: string
    phases?: TimelinePhase[]
  }
  index: number
  pageId: string
  pageType: string
}

type TimelineState = 'past' | 'active' | 'future'

/** Chevron ribbon that heads each card. */
const RIBBON_CLIP =
  'polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%, 16px 50%)'

/**
 * CustomPortableText renders paragraphs at `text-lg` and lists at `text-lg`, which is far
 * too large for a ~220px five-column card. These descendant rules pull the shared component
 * back to the card's own scale without forking it. Colour is per-state, so it lives in
 * getStateClasses as a literal (Tailwind cannot see interpolated class names).
 */
const RICH_TEXT_BASE = [
  '[&_p]:text-sm [&_p]:leading-6 [&_p]:mb-3 [&_p:last-child]:mb-0',
  '[&_ul]:text-sm [&_ul]:leading-6 [&_ul]:mb-3 [&_ul:last-child]:mb-0',
  '[&_ol]:text-sm [&_ol]:leading-6 [&_ol]:mb-3 [&_ol:last-child]:mb-0',
].join(' ')

function getActiveIndex(phases: TimelinePhase[]) {
  return Math.max(
    phases.findIndex((phase) => phase.status === 'active'),
    0
  )
}

function getTimelineState(phase: TimelinePhase): TimelineState {
  if (phase.status === 'completed') return 'past'
  if (phase.status === 'active') return 'active'
  return 'future'
}

function getStateClasses(state: TimelineState) {
  switch (state) {
    case 'past':
      return {
        stepSurface: 'bg-navy',
        stepText: 'text-white',
        cardSurface: 'border-navy/12 bg-white',
        richText: '[&_p]:text-navy/70 [&_ul]:text-navy/70 [&_ol]:text-navy/70',
        label: 'bg-navy text-white',
      }
    case 'active':
      return {
        stepSurface: 'bg-gold',
        stepText: 'text-navy',
        cardSurface: 'border-gold/35 bg-gold/10',
        richText: '[&_p]:text-navy/74 [&_ul]:text-navy/74 [&_ol]:text-navy/74',
        label: 'bg-forest text-white',
      }
    case 'future':
    default:
      return {
        stepSurface: 'bg-cream',
        stepText: 'text-navy',
        cardSurface: 'border-navy/10 bg-white',
        richText: '[&_p]:text-navy/68 [&_ul]:text-navy/68 [&_ol]:text-navy/68',
        label: 'bg-navy/8 text-navy',
      }
  }
}

function LegendChip({label, colorClass}: {label: string; colorClass: string}) {
  return (
    <span className="inline-flex items-center gap-2 ml-2">
      <span className={`h-3 w-3 rotate-45 ${colorClass}`} />
      {label}
    </span>
  )
}

function TimelineLegend({
  legendLabel,
  legendDescription,
}: {
  legendLabel?: string | null
  legendDescription?: string | null
}) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-navy/10 pb-5">
      <div>
        {legendLabel && (
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-forest">
            {legendLabel}
          </p>
        )}
        {legendDescription && (
          <p className="mt-2 max-w-[64ch] text-sm leading-6 text-navy/68">
            {legendDescription}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-navy/65">
        <LegendChip label="Completed" colorClass="bg-navy" />
        <LegendChip label="Current" colorClass="bg-gold" />
        <LegendChip label="Upcoming" colorClass="bg-cream border border-navy/18" />
      </div>
    </div>
  )
}

/**
 * Compatibility shim. `description` was a plain string before the rich-text migration, so
 * this renders either shape and lets code and content deploy in any order. Once production
 * content is migrated, the string branch can be deleted along with `| string` on the type.
 */
function PhaseDescription({
  description,
  className,
}: {
  description?: CmsPortableText | string
  className: string
}) {
  if (!description) return null

  if (typeof description === 'string') {
    return <p className={`${className} text-sm leading-6`}>{description}</p>
  }

  if (!Array.isArray(description) || description.length === 0) return null

  return <CustomPortableText value={description} className={className} />
}

export default function TimelineBlock({block}: TimelineBlockProps) {
  const {sectionId, background = 'mist', legendLabel, legendDescription, phases} = block

  if (!phases || phases.length === 0) {
    return null
  }

  const activeIndex = getActiveIndex(phases)

  return (
    <SectionWrapper background={background as 'white' | 'cream' | 'mist'} sectionId={sectionId || undefined}>
      <div className="container">
        <TimelineLegend legendLabel={legendLabel} legendDescription={legendDescription} />

        {/* Progress bar */}
        <div className="mb-8">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-sm text-navy/70">
            <p className="font-semibold text-navy">Milestone review</p>
            <p>
              <span className="font-semibold text-navy">{activeIndex + 1}</span> of {phases.length}{' '}
              milestones is current
            </p>
          </div>

          <div className="relative h-3 bg-white">
            <div
              className="absolute inset-y-0 left-0 bg-navy transition-all duration-500 motion-reduce:transition-none"
              style={{width: `${((activeIndex + 0.55) / phases.length) * 100}%`}}
            />
            <div
              className="absolute top-1/2 h-4 w-4 -translate-y-1/2 bg-gold"
              style={{
                left: `calc(${((activeIndex + 0.55) / phases.length) * 100}% - 8px)`,
                clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
              }}
            />
          </div>
        </div>

        {/* Timeline cards grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {phases.map((phase) => {
            const state = getTimelineState(phase)
            const classes = getStateClasses(state)
            const isActive = phase.status === 'active'

            return (
              <article
                key={phase._key}
                className={[
                  'clip-corner flex min-h-[16rem] flex-col border p-5 sm:p-6',
                  classes.cardSurface,
                  isActive
                    ? 'shadow-[0_22px_40px_-28px_rgba(27,58,82,0.45)]'
                    : 'shadow-[0_16px_32px_-28px_rgba(27,58,82,0.22)]',
                ].join(' ')}
              >
                {/* Date ribbon — heads the card and carries its heading */}
                <div
                  className={`relative min-h-12 overflow-hidden ${classes.stepSurface}`}
                  style={{clipPath: RIBBON_CLIP}}
                >
                  <div className="flex min-h-12 items-center justify-center px-5 py-2">
                    <h3
                      className={`text-center font-display text-xl font-bold leading-tight ${classes.stepText}`}
                    >
                      {phase.date}
                    </h3>
                  </div>
                </div>

                <PhaseDescription
                  description={phase.description}
                  className={`mt-4 ${RICH_TEXT_BASE} ${classes.richText}`}
                />

                {isActive && phase.activeLabel ? (
                  <div className="mt-auto pt-6">
                    <span
                      className={`inline-flex px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${classes.label}`}
                    >
                      {phase.activeLabel}
                    </span>
                  </div>
                ) : null}
              </article>
            )
          })}
        </div>
      </div>
    </SectionWrapper>
  )
}
