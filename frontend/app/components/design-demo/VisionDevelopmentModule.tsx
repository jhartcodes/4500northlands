'use client'

import SectionWrapper from '@/app/components/ui/SectionWrapper'

type VisionPhase = {
  _key: string
  phaseNumber: string
  title: string
  description: string
}

type VisionContent = {
  title: string
  subtitle: string
  phases: VisionPhase[]
}

const visionData: VisionContent = {
  title: 'The Vision - Development Plan',
  subtitle:
    'Our comprehensive approach ensures thoughtful development that balances community needs with sustainable growth, creating a vibrant neighborhood that serves Whistler for generations to come.',
  phases: [
    {
      _key: '1',
      phaseNumber: 'Phase 1',
      title: 'Foundation and Infrastructure',
      description:
        'Establishing essential roads, utilities, and enabling services that support the full development from day one.',
    },
    {
      _key: '2',
      phaseNumber: 'Phase 2',
      title: 'Core Development',
      description:
        'Building the residential, commercial, and daily-use spaces that make the neighborhood livable and active.',
    },
    {
      _key: '3',
      phaseNumber: 'Phase 3',
      title: 'Community Integration',
      description:
        'Completing parks, public realm improvements, and connections that tie the project into the wider Whistler community.',
    },
  ],
}

type VisionDevelopmentModuleProps = {
  variation: 1 | 2 | 3
}

function VisionHeader({
  title,
  subtitle,
  theme,
  eyebrow,
}: {
  title: string
  subtitle: string
  theme: 'dark' | 'light'
  eyebrow: string
}) {
  const titleColor = theme === 'dark' ? 'text-white' : 'text-navy'
  const bodyColor = theme === 'dark' ? 'text-white/78' : 'text-navy/70'

  return (
    <div className="mx-auto mb-14 max-w-3xl text-center">
      <p className={`text-sm font-semibold uppercase tracking-[0.28em] ${theme === 'dark' ? 'text-gold' : 'text-forest'}`}>
        {eyebrow}
      </p>
      <h2 className={`mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl ${titleColor}`}>
        {title}
      </h2>
      <p className={`mx-auto mt-5 max-w-[64ch] text-lg leading-8 ${bodyColor}`}>
        {subtitle}
      </p>
    </div>
  )
}

function VisionStage({
  children,
  tone,
}: {
  children: React.ReactNode
  tone: 'navy' | 'forest' | 'cream'
}) {
  const surface =
    tone === 'cream'
      ? 'border-navy/10 bg-white/72'
      : tone === 'forest'
        ? 'border-white/14 bg-white/[0.04]'
        : 'border-white/12 bg-white/[0.05]'

  return (
    <div className={`clip-corner border ${surface} p-5 sm:p-6 lg:p-8`}>
      {children}
    </div>
  )
}

function VisionVariation1({content}: {content: VisionContent}) {
  return (
    <SectionWrapper background="navy">
      <div className="container">
        <VisionHeader
          title={content.title}
          subtitle={content.subtitle}
          theme="dark"
          eyebrow="Phased implementation"
        />

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {content.phases.map((phase, index) => (
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
                  <span className="clip-corner inline-flex bg-gold px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-navy">
                    {phase.phaseNumber}
                  </span>
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
                <p className="mt-4 text-base leading-7 text-navy/72">
                  {phase.description}
                </p>

                {/* Bottom accent */}
                <div className="mt-6 flex items-center justify-end gap-2">
                  <div className="h-2 w-2 rotate-45 bg-gold" />
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}

function VisionVariation2({content}: {content: VisionContent}) {
  return (
    <SectionWrapper background="forest">
      <div className="container">
        <VisionHeader
          title={content.title}
          subtitle={content.subtitle}
          theme="dark"
          eyebrow="Structured progression"
        />

        <VisionStage tone="forest">
          <div className="clip-corner overflow-hidden border border-white/18">
            <div className="grid md:grid-cols-3">
              {content.phases.map((phase, index) => (
                <article
                  key={phase._key}
                  className={[
                    'relative flex min-h-[18rem] flex-col justify-between bg-white/[0.02] p-6 sm:p-7',
                    'transition duration-300 motion-safe:hover:bg-white/[0.05]',
                    index < content.phases.length - 1 ? 'border-b border-white/14 md:border-b-0 md:border-r' : '',
                  ].join(' ')}
                >
                  <span className="pointer-events-none absolute bottom-2 right-4 font-display text-[6rem] font-bold leading-none text-white/7 sm:text-[7rem]">
                    {index + 1}
                  </span>

                  <div className="relative z-10">
                    <div className="flex items-center gap-3">
                      <span className="clip-corner flex h-10 w-10 items-center justify-center bg-gold text-sm font-bold text-navy">
                        {index + 1}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">
                        {phase.phaseNumber}
                      </span>
                    </div>

                    <h3 className="mt-8 max-w-[16ch] font-display text-2xl font-bold leading-tight text-white">
                      {phase.title}
                    </h3>
                    <p className="mt-4 max-w-[30ch] text-base leading-7 text-white/76">
                      {phase.description}
                    </p>
                  </div>

                  <div className="relative z-10 mt-8 flex items-center gap-3">
                    <div className="h-px flex-1 bg-white/14" />
                    <div className="h-px w-14 bg-gold" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </VisionStage>
      </div>
    </SectionWrapper>
  )
}

function VisionVariation3({content}: {content: VisionContent}) {
  return (
    <SectionWrapper background="cream">
      <div className="container">
        <VisionHeader
          title={content.title}
          subtitle={content.subtitle}
          theme="light"
          eyebrow="Editorial columns"
        />

        <VisionStage tone="cream">
          <div className="grid gap-6 md:grid-cols-3 md:gap-0 md:divide-x md:divide-navy/10">
            {content.phases.map((phase, index) => (
              <article
                key={phase._key}
                className={[
                  'flex h-full flex-col px-2 md:px-7 lg:px-9',
                  index < content.phases.length - 1 ? 'pb-6 md:pb-0' : '',
                ].join(' ')}
              >
                <div className="flex items-center gap-4">
                  <span className="clip-corner flex h-12 w-12 items-center justify-center bg-navy font-display text-base font-bold text-white">
                    0{index + 1}
                  </span>
                  <div className="h-px flex-1 bg-gold/55" />
                </div>

                <div className="mt-7 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-forest">
                    {phase.phaseNumber}
                  </p>
                  <h3 className="mt-3 max-w-[15ch] font-display text-2xl font-bold leading-tight text-navy">
                    {phase.title}
                  </h3>
                  <p className="mt-4 max-w-[28ch] text-base leading-7 text-navy/72">
                    {phase.description}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-3">
                  <div className="h-px flex-1 bg-navy/10" />
                  <div className="h-2.5 w-2.5 rotate-45 bg-gold" />
                </div>
              </article>
            ))}
          </div>
        </VisionStage>
      </div>
    </SectionWrapper>
  )
}

export default function VisionDevelopmentModule({variation}: VisionDevelopmentModuleProps) {
  switch (variation) {
    case 1:
      return <VisionVariation1 content={visionData} />
    case 2:
      return <VisionVariation2 content={visionData} />
    case 3:
      return <VisionVariation3 content={visionData} />
    default:
      return <VisionVariation1 content={visionData} />
  }
}
