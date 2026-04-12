'use client'

import SectionWrapper from '@/app/components/ui/SectionWrapper'

type TimelinePhase = {
  _key: string
  title: string
  date: string
  description: string
  isActive?: boolean
  activeLabel?: string
}

type TimelineState = 'past' | 'active' | 'future'

const timelineData: TimelinePhase[] = [
  {
    _key: '1',
    title: 'Phase 1 Engagement',
    date: '2021',
    description:
      'Early conversations surfaced community priorities around housing, access, and public benefit.',
  },
  {
    _key: '2',
    title: 'Phase 2 Engagement',
    date: '2022-2023',
    description:
      'Follow-up engagement refined the vision and clarified where the proposal needed to evolve.',
  },
  {
    _key: '3',
    title: 'Pre-Application Open Houses',
    date: 'September 2025',
    description:
      'Open houses gathered direct feedback on the emerging concept before a formal application was made.',
  },
  {
    _key: '4',
    title: 'CAC Negotiations',
    date: 'Winter 2025-2026',
    description:
      'Community Amenity Contribution discussions helped shape the delivery of public benefits.',
  },
  {
    _key: '5',
    title: 'Guiding Principles Received',
    date: 'January 6, 2026',
    description:
      'Council and staff feedback established the key principles that now guide the next design stage.',
  },
  {
    _key: '6',
    title: 'Design Development',
    date: 'Winter-Spring 2026',
    description:
      'The team is refining the proposal in response to feedback, policy direction, and technical review.',
    isActive: true,
    activeLabel: 'We are here',
  },
  {
    _key: '7',
    title: 'Formal Rezoning Submission',
    date: 'Spring 2026',
    description:
      'A complete submission package will bring the updated drawings, studies, and benefits together.',
  },
  {
    _key: '8',
    title: 'Direction to Proceed',
    date: 'Late Spring 2026',
    description:
      'Council considers the submission and determines whether the application should move forward.',
  },
  {
    _key: '9',
    title: 'First and Second Reading',
    date: 'Summer 2026',
    description:
      'Initial bylaw readings introduce the application to formal council consideration and debate.',
  },
  {
    _key: '10',
    title: 'Third Reading',
    date: 'Summer 2026',
    description:
      'Third reading advances the application toward final approval, subject to remaining requirements.',
  },
]

type TimelineModuleProps = {
  variation: 1 | 2 | 3
}

function getActiveIndex(phases: TimelinePhase[]) {
  return Math.max(
    phases.findIndex((phase) => phase.isActive),
    0,
  )
}

function getTimelineState(index: number, activeIndex: number): TimelineState {
  if (index < activeIndex) return 'past'
  if (index === activeIndex) return 'active'
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
        meta: 'text-navy/58',
        badge: 'bg-navy text-white',
        label: 'bg-navy text-white',
        connector: 'bg-navy/22',
        marker: 'bg-navy',
        rowLine: 'bg-navy/16',
      }
    case 'active':
      return {
        stepSurface: 'bg-gold',
        stepDate: 'text-navy/74',
        stepNumber: 'text-navy',
        cardSurface: 'border-gold/35 bg-gold/10',
        title: 'text-navy',
        body: 'text-navy/74',
        meta: 'text-forest',
        badge: 'bg-forest text-white',
        label: 'bg-forest text-white',
        connector: 'bg-gold/60',
        marker: 'bg-gold',
        rowLine: 'bg-gold/55',
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
        meta: 'text-navy/58',
        badge: 'bg-mist text-navy',
        label: 'bg-navy/8 text-navy',
        connector: 'bg-navy/16',
        marker: 'bg-cream border border-navy/18',
        rowLine: 'bg-navy/10',
      }
  }
}

function LegendChip({label, colorClass}: {label: string; colorClass: string}) {
  return (
    <span className="inline-flex items-center gap-2 ml-2 ">
      <span className={`h-3 w-3 rotate-45 ${colorClass}`} />
      {label}
    </span>
  )
}

function TimelineLegend() {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-navy/10 pb-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-forest">
          Milestone sequence
        </p>
        <p className="mt-2 max-w-[64ch] text-sm leading-6 text-navy/68">
          Each milestone now includes a short explanatory note so the sequence reads as a story, not
          just a list of dates.
        </p>
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

function ChevronStep({
  phase,
  state,
  index,
  isFirst,
}: {
  phase: TimelinePhase
  state: TimelineState
  index: number
  isFirst: boolean
}) {
  const classes = getStateClasses(state)

  return (
    <div
      className={[
        'relative flex-1 min-w-0 py-3 overflow-hidden',
        isFirst ? 'pl-6 pr-8' : 'pl-8 pr-8',
      ].join(' ')}
      style={{
        clipPath: isFirst
          ? 'polygon(0 0, calc(100% - 18px) 0, 100% 50%, calc(100% - 18px) 100%, 0 100%)'
          : 'polygon(0 0, calc(100% - 18px) 0, 100% 50%, calc(100% - 18px) 100%, 0 100%, 18px 50%)',
        marginLeft: isFirst ? '0' : '-10px',
        zIndex: timelineData.length - index,
      }}
    >
      <div className={`absolute inset-0 ${classes.stepSurface}`} />
      <div className="relative flex flex-col gap-0.5">
        <span className={`font-display text-lg font-bold leading-none ${classes.stepNumber}`}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span
          className={`text-[10px] font-semibold uppercase tracking-[0.12em] leading-tight truncate ${classes.stepDate}`}
        >
          {phase.date}
        </span>
      </div>
    </div>
  )
}

function TimelineCalloutCard({
  phase,
  index,
  state,
  align = 'left',
}: {
  phase: TimelinePhase
  index: number
  state: TimelineState
  align?: 'left' | 'center'
}) {
  const classes = getStateClasses(state)
  const isActive = state === 'active'
  const textAlign = align === 'center' ? 'text-center' : 'text-left'

  return (
    <article className={`clip-corner border p-4 sm:p-5 ${classes.cardSurface} ${textAlign}`}>
      <div
        className={`flex flex-wrap items-center gap-3 ${align === 'center' ? 'justify-center' : 'justify-start'}`}
      >
        <NumberBadge index={index} classes={classes} />
        {isActive && phase.activeLabel ? (
          <span
            className={`inline-flex px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${classes.label}`}
          >
            {phase.activeLabel}
          </span>
        ) : null}
      </div>

      <h3 className={`mt-4 font-display text-lg font-bold leading-snug ${classes.title}`}>
        {phase.title}
      </h3>
      <p className={`mt-3 text-sm leading-6 ${classes.body}`}>{phase.description}</p>
    </article>
  )
}

function ChevronTimelineRow({
  phases,
  startIndex,
  calloutPosition,
  rowLabel,
}: {
  phases: TimelinePhase[]
  startIndex: number
  calloutPosition: 'top' | 'bottom'
  rowLabel: string
}) {
  const activeIndex = getActiveIndex(timelineData)

  return (
    <div>
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-forest">
        {rowLabel}
      </p>

      {calloutPosition === 'top' ? (
        <>
          <div className="grid grid-cols-5 gap-4">
            {phases.map((phase, index) => {
              const globalIndex = startIndex + index
              return (
                <TimelineCalloutCard
                  key={phase._key}
                  phase={phase}
                  index={globalIndex}
                  state={getTimelineState(globalIndex, activeIndex)}
                />
              )
            })}
          </div>

          <div className="grid grid-cols-5 gap-4">
            {phases.map((phase, index) => {
              const globalIndex = startIndex + index
              const classes = getStateClasses(getTimelineState(globalIndex, activeIndex))

              return (
                <div key={phase._key} className="flex flex-col items-center">
                  <span className="h-8 w-px" style={{backgroundColor: 'transparent'}} />
                  <span className={`h-8 w-px ${classes.connector}`} />
                  <span className={`h-3 w-3 rotate-45 ${classes.marker}`} />
                </div>
              )
            })}
          </div>
        </>
      ) : null}

      <div className="flex items-stretch">
        {phases.map((phase, index) => {
          const globalIndex = startIndex + index
          return (
            <ChevronStep
              key={phase._key}
              phase={phase}
              state={getTimelineState(globalIndex, activeIndex)}
              index={globalIndex}
              isFirst={index === 0}
            />
          )
        })}
      </div>

      {calloutPosition === 'bottom' ? (
        <>
          <div className="grid grid-cols-5 gap-4">
            {phases.map((phase, index) => {
              const globalIndex = startIndex + index
              const classes = getStateClasses(getTimelineState(globalIndex, activeIndex))

              return (
                <div key={phase._key} className="flex flex-col items-center">
                  <span className={`h-3 w-3 rotate-45 ${classes.marker}`} />
                  <span className={`h-8 w-px ${classes.connector}`} />
                  <span className="h-8 w-px" style={{backgroundColor: 'transparent'}} />
                </div>
              )
            })}
          </div>

          <div className="grid grid-cols-5 gap-4">
            {phases.map((phase, index) => {
              const globalIndex = startIndex + index
              return (
                <TimelineCalloutCard
                  key={phase._key}
                  phase={phase}
                  index={globalIndex}
                  state={getTimelineState(globalIndex, activeIndex)}
                />
              )
            })}
          </div>
        </>
      ) : null}
    </div>
  )
}

function TimelineVariation1({phases}: {phases: TimelinePhase[]}) {
  const activeIndex = getActiveIndex(phases)

  return (
    <SectionWrapper background="white">
      <div className="container">
        <TimelineLegend />

        <div className="space-y-4 lg:hidden">
          {phases.map((phase, index) => {
            const state = getTimelineState(index, activeIndex)
            const classes = getStateClasses(state)

            return (
              <article
                key={phase._key}
                className={`clip-corner border p-4 sm:p-5 ${classes.cardSurface}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <NumberBadge index={index} classes={classes} />
                  <span
                    className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${classes.meta}`}
                  >
                    {phase.date}
                  </span>
                </div>

                <h3 className={`mt-4 font-display text-lg font-bold leading-snug ${classes.title}`}>
                  {phase.title}
                </h3>
                <p className={`mt-3 text-sm leading-6 ${classes.body}`}>{phase.description}</p>

                <div className="mt-5">
                  <div
                    className={`h-10 overflow-hidden ${classes.stepSurface}`}
                    style={{
                      clipPath:
                        'polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%, 16px 50%)',
                    }}
                  >
                    <div className="flex h-full items-center justify-between gap-3 pl-7 pr-6">
                      <span className={`font-display text-base font-bold shrink-0 ${classes.stepNumber}`}>
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

        <div className="hidden space-y-10 lg:block">
          <ChevronTimelineRow
            phases={phases.slice(0, 5)}
            startIndex={0}
            calloutPosition="top"
            rowLabel="Earlier engagement"
          />

          <ChevronTimelineRow
            phases={phases.slice(5)}
            startIndex={5}
            calloutPosition="bottom"
            rowLabel="Current phase and next steps"
          />
        </div>
      </div>
    </SectionWrapper>
  )
}

function TimelineVariation2({phases}: {phases: TimelinePhase[]}) {
  const activeIndex = getActiveIndex(phases)

  return (
    <SectionWrapper background="mist">
      <div className="container">
        <TimelineLegend />

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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {phases.map((phase, index) => {
            const state = getTimelineState(index, activeIndex)
            const classes = getStateClasses(state)
            const isActive = state === 'active'

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
                  <p className={`mt-3 text-sm leading-6 ${classes.body}`}>{phase.description}</p>
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
                      <span className={`font-display text-base font-bold shrink-0 ${classes.stepNumber}`}>
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

function TimelineSpineCard({
  phase,
  index,
  state,
  align,
}: {
  phase: TimelinePhase
  index: number
  state: TimelineState
  align: 'left' | 'right'
}) {
  const classes = getStateClasses(state)
  const textAlign = align === 'left' ? 'text-left' : 'text-right'
  const justify = align === 'left' ? 'justify-start' : 'justify-end'

  return (
    <article
      className={`clip-corner border px-5 py-5 sm:px-6 sm:py-6 ${classes.cardSurface} ${textAlign}`}
    >
      <div className={`flex flex-wrap items-center gap-3 ${justify}`}>
        <NumberBadge index={index} classes={classes} />
        <span className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${classes.meta}`}>
          {phase.date}
        </span>
        {state === 'active' && phase.activeLabel ? (
          <span
            className={`inline-flex px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${classes.label}`}
          >
            {phase.activeLabel}
          </span>
        ) : null}
      </div>

      <h3 className={`mt-4 font-display text-xl font-bold leading-tight ${classes.title}`}>
        {phase.title}
      </h3>
      <p className={`mt-3 text-sm leading-6 ${classes.body}`}>{phase.description}</p>
    </article>
  )
}

function TimelineVariation3({phases}: {phases: TimelinePhase[]}) {
  const activeIndex = getActiveIndex(phases)

  return (
    <SectionWrapper background="white">
      <div className="container">
        <TimelineLegend />

        <div className="hidden md:block">
          <div className="relative">
            <div className="absolute bottom-4 left-1/2 top-4 w-px -translate-x-1/2 bg-navy/12" />

            <div className="space-y-5">
              {phases.map((phase, index) => {
                const state = getTimelineState(index, activeIndex)
                const classes = getStateClasses(state)
                const isLeft = index % 2 !== 0

                return (
                  <div
                    key={phase._key}
                    className="grid grid-cols-[minmax(0,1fr)_3.75rem_minmax(0,1fr)] items-center gap-x-4"
                  >
                    {isLeft ? (
                      <TimelineSpineCard phase={phase} index={index} state={state} align="right" />
                    ) : (
                      <div />
                    )}

                    <div className="relative flex h-full items-center justify-center">
                      <div
                        className={[
                          'absolute top-1/2 h-px -translate-y-1/2',
                          isLeft ? 'left-1/2 right-0' : 'left-0 right-1/2',
                          classes.rowLine,
                        ].join(' ')}
                      />
                      <span className={`relative z-10 h-4 w-4 rotate-45 ${classes.marker}`} />
                    </div>

                    {isLeft ? (
                      <div />
                    ) : (
                      <TimelineSpineCard phase={phase} index={index} state={state} align="left" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="relative pl-8 md:hidden">
          <div className="absolute bottom-2 left-3 top-2 w-px bg-navy/12" />

          <div className="space-y-4">
            {phases.map((phase, index) => {
              const state = getTimelineState(index, activeIndex)
              const classes = getStateClasses(state)

              return (
                <div key={phase._key} className="relative">
                  <span
                    className={`absolute left-[-1.45rem] top-6 h-3.5 w-3.5 rotate-45 ${classes.marker}`}
                  />

                  <article className={`clip-corner border px-5 py-5 ${classes.cardSurface}`}>
                    <div className="flex flex-wrap items-center gap-3">
                      <NumberBadge index={index} classes={classes} />
                      <span
                        className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${classes.meta}`}
                      >
                        {phase.date}
                      </span>
                      {state === 'active' && phase.activeLabel ? (
                        <span
                          className={`inline-flex px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${classes.label}`}
                        >
                          {phase.activeLabel}
                        </span>
                      ) : null}
                    </div>

                    <h3
                      className={`mt-4 font-display text-xl font-bold leading-tight ${classes.title}`}
                    >
                      {phase.title}
                    </h3>
                    <p className={`mt-3 text-sm leading-6 ${classes.body}`}>{phase.description}</p>
                  </article>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

export default function TimelineModule({variation}: TimelineModuleProps) {
  switch (variation) {
    case 1:
      return <TimelineVariation1 phases={timelineData} />
    case 2:
      return <TimelineVariation2 phases={timelineData} />
    case 3:
      return <TimelineVariation3 phases={timelineData} />
    default:
      return <TimelineVariation1 phases={timelineData} />
  }
}
