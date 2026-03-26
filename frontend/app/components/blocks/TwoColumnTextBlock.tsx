'use client'

import CustomPortableText from '@/app/components/PortableText'
import SectionWrapper, {isDarkBackground} from '@/app/components/ui/SectionWrapper'

type TwoColumnTextBlockProps = {
  block: {
    _key: string
    _type: 'twoColumnTextBlock'
    sectionId?: string
    background?: 'white' | 'cream' | 'mist' | 'navy' | 'forest'
    sectionLabel?: string
    title?: string
    body?: any[]
    cardTitle?: string
    cardBody?: any[]
  }
  index: number
  pageId: string
  pageType: string
}

export default function TwoColumnTextBlock({block}: TwoColumnTextBlockProps) {
  const {sectionId, background, sectionLabel, title, body, cardTitle, cardBody} = block

  const isDark = isDarkBackground(background)
  const textColor = isDark ? 'text-white' : 'text-navy'
  const cardBg = isDark ? 'bg-white/10' : 'bg-cream'

  return (
    <SectionWrapper background={background} sectionId={sectionId}>
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left Column */}
          <div>
            {sectionLabel && (
              <p className="text-sm uppercase tracking-widest text-gold font-semibold mb-3">
                {sectionLabel}
              </p>
            )}
            {title && (
              <h2 className={`font-display text-3xl md:text-4xl font-bold mb-6 ${textColor}`}>
                {title}
              </h2>
            )}
            {body && body.length > 0 && <CustomPortableText value={body} isDark={isDark} />}
          </div>

          {/* Right Column (Card) */}
          <div className={`${cardBg} p-6 md:p-8 rounded-lg`}>
            {cardTitle && (
              <h3 className={`font-display text-xl md:text-2xl font-bold mb-4 ${textColor}`}>
                {cardTitle}
              </h3>
            )}
            {cardBody && cardBody.length > 0 && (
              <CustomPortableText value={cardBody} isDark={isDark} />
            )}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
