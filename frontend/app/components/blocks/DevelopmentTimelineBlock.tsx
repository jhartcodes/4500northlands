'use client'

import SectionWrapper, {isDarkBackground} from '@/app/components/ui/SectionWrapper'

type DevelopmentPhase = {
  _key: string
  phaseNumber?: string
  title?: string
  description?: string
}

type DevelopmentTimelineBlockProps = {
  block: {
    _key: string
    _type: 'developmentTimelineBlock'
    sectionId?: string
    background?: 'navy' | 'forest' | 'cream'
    eyebrow?: string
    title?: string
    subtitle?: string
    phases?: DevelopmentPhase[]
  }
  index: number
  pageId: string
  pageType: string
}

export default function DevelopmentTimelineBlock({block}: DevelopmentTimelineBlockProps) {
  const {sectionId, background = 'navy', eyebrow, title, subtitle, phases} = block

  const isDark = isDarkBackground(background)
  const titleColor = isDark ? 'text-white' : 'text-navy'
  const bodyColor = isDark ? 'text-white/80' : 'text-navy/70'
  const eyebrowColor = isDark ? 'text-gold' : 'text-forest'

  return (
    <SectionWrapper background={background} sectionId={sectionId}>
      <div className="container">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          {eyebrow && (
            <p className={`text-sm font-semibold uppercase tracking-[0.28em] ${eyebrowColor}`}>
              {eyebrow}
            </p>
          )}
          {title && (
            <h2
              className={`mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl ${titleColor}`}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p className={`mx-auto mt-5 max-w-[64ch] text-lg leading-8 ${bodyColor}`}>{subtitle}</p>
          )}
        </div>

        {/* Phase cards */}
        {phases && phases.length > 0 && (
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {phases.map((phase, index) => (
              <div key={phase._key} className="group relative">
                {/* Shadow layer - offset behind the card */}
                <div
                  className="absolute inset-0 bg-gold/20 clip-corner"
                  style={{
                    transform: 'translate(6px, 6px)',
                  }}
                />

                {/* Main card */}
                <article className="relative clip-corner border border-white/10 bg-cream p-6 text-navy shadow-[0_24px_48px_-20px_rgba(0,0,0,0.4)] transition duration-300 motion-safe:group-hover:-translate-y-1 lg:p-7">
                  {/* Header row */}
                  <div className="flex items-center justify-between gap-4">
                    {phase.phaseNumber && (
                      <span className="clip-corner inline-flex bg-gold px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-navy">
                        {phase.phaseNumber}
                      </span>
                    )}
                    <span className="font-display text-4xl font-bold text-navy/12">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="mt-6 flex items-center gap-3">
                    <div className="h-px w-12 bg-gold" />
                    <div className="h-px flex-1 bg-navy/10" />
                  </div>

                  {/* Content */}
                  <h3 className="mt-6 font-display text-2xl font-bold leading-tight text-navy">
                    {phase.title}
                  </h3>
                  {phase.description && (
                    <p className="mt-4 text-base leading-7 text-navy/72">{phase.description}</p>
                  )}

                  {/* Bottom accent */}
                  <div className="mt-6 flex items-center justify-end gap-2">
                    <div className="h-2 w-2 rotate-45 bg-gold" />
                  </div>
                </article>
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
