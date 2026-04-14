'use client'

import SectionWrapper from '@/app/components/ui/SectionWrapper'

type TimelinePhase = {
  _key: string
  title?: string
  date?: string
  description?: string
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
        stepDate: 'text-white/74',
        stepNumber: 'text-white',
        cardSurface: 'border-navy/12 bg-white',
        title: 'text-navy',
        body: 'text-navy/70',
        badge: 'bg-navy text-white',
        label: 'bg-navy text-white',
      }
    case 'active':
      return {
        stepSurface: 'bg-gold',
        stepDate: 'text-navy/74',
        stepNumber: 'text-navy',
        cardSurface: 'border-gold/35 bg-gold/10',
        title: 'text-navy',
        body: 'text-navy/74',
        badge: 'bg-forest text-white',
        label: 'bg-forest text-white',
      }
    case 'future':
    default:
      return {
        stepSurface: 'bg-cream',
        stepDate: 'text-navy/64',
        stepNumber: 'text-navy',
        cardSurface: 'border-navy/10 bg-white',
        title: 'text-navy',
        body: 'text-navy/68',
        badge: 'bg-mist text-navy',
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

function NumberBadge({
  index,
  classes,
}: {
  index: number
  classes: ReturnType<typeof getStateClasses>
}) {
  return (
    <span
      className={`inline-flex h-8 min-w-8 items-center justify-center px-2 text-xs font-bold ${classes.badge}`}
    >
      {String(index + 1).padStart(2, '0')}
    </span>
  )
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
          {phases.map((phase, index) => {
            const state = getTimelineState(phase)
            const classes = getStateClasses(state)
            const isActive = phase.status === 'active'

            return (
              <article
                key={phase._key}
                className={[
                  'clip-corner flex min-h-[18.5rem] flex-col justify-between border p-5 sm:p-6',
                  classes.cardSurface,
                  isActive
                    ? 'shadow-[0_22px_40px_-28px_rgba(27,58,82,0.45)]'
                    : 'shadow-[0_16px_32px_-28px_rgba(27,58,82,0.22)]',
                ].join(' ')}
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <NumberBadge index={index} classes={classes} />
                    {isActive && phase.activeLabel ? (
                      <span
                        className={`inline-flex px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${classes.label}`}
                      >
                        {phase.activeLabel}
                      </span>
                    ) : null}
                  </div>

                  <h3
                    className={`mt-5 font-display text-xl font-bold leading-tight ${classes.title}`}
                  >
                    {phase.title}
                  </h3>
                  {phase.description && (
                    <p className={`mt-3 text-sm leading-6 ${classes.body}`}>{phase.description}</p>
                  )}
                </div>

                <div className="mt-6">
                  <div
                    className={`relative h-12 overflow-hidden ${classes.stepSurface}`}
                    style={{
                      clipPath:
                        'polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%, 16px 50%)',
                    }}
                  >
                    <div className="flex h-full items-center justify-between gap-3 pl-7 pr-6">
                      <span
                        className={`font-display text-base font-bold shrink-0 ${classes.stepNumber}`}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-[0.12em] truncate ${classes.stepDate}`}
                      >
                        {phase.date}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </SectionWrapper>
  )
}
