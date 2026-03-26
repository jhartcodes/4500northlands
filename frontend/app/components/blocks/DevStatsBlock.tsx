'use client'

import SectionWrapper, {isDarkBackground} from '@/app/components/ui/SectionWrapper'

type Stat = {
  _key: string
  number?: string
  label?: string
}

type DevStatsBlockProps = {
  block: {
    _key: string
    _type: 'devStatsBlock'
    sectionId?: string
    background?: 'white' | 'cream' | 'mist' | 'navy' | 'forest'
    title?: string
    stats?: Stat[]
  }
  index: number
  pageId: string
  pageType: string
}

export default function DevStatsBlock({block}: DevStatsBlockProps) {
  const {sectionId, background, title, stats} = block

  const isDark = isDarkBackground(background)
  const textColor = isDark ? 'text-white' : 'text-navy'
  const mutedColor = isDark ? 'text-white/70' : 'text-navy/60'
  const borderColor = isDark ? 'border-white/20' : 'border-navy/10'

  if (!stats || stats.length === 0) return null

  // Dynamic grid columns based on stat count
  const gridCols =
    stats.length <= 3
      ? `grid-cols-1 md:grid-cols-${stats.length}`
      : stats.length === 4
        ? 'grid-cols-2 md:grid-cols-4'
        : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'

  return (
    <SectionWrapper background={background} sectionId={sectionId}>
      <div className="container">
        {title && (
          <h2
            className={`font-display text-2xl md:text-3xl font-bold mb-8 text-center ${textColor}`}
          >
            {title}
          </h2>
        )}
        <div className={`grid ${gridCols} gap-0`}>
          {stats.map((stat, index) => (
            <div
              key={stat._key}
              className={`text-center py-8 px-6 lg:px-8 ${
                index !== stats.length - 1
                  ? `border-b md:border-b-0 md:border-r ${borderColor}`
                  : ''
              }`}
            >
              {stat.number && (
                <div
                  className={`font-display text-4xl md:text-5xl lg:text-6xl font-bold ${textColor}`}
                >
                  {stat.number}
                </div>
              )}
              {stat.label && (
                <div className={`text-sm md:text-base uppercase tracking-wide mt-2 ${mutedColor}`}>
                  {stat.label}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
