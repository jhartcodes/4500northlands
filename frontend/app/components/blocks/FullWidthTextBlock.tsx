'use client'

import CustomPortableText from '@/app/components/PortableText'
import SectionWrapper, {isDarkBackground} from '@/app/components/ui/SectionWrapper'
import Divider from '@/app/components/ui/Divider'
import {ButtonGroup} from '@/app/components/Button'

type FullWidthTextBlockProps = {
  block: {
    _key: string
    _type: 'fullWidthTextBlock'
    sectionId?: string
    background?: 'white' | 'cream' | 'navy'
    sectionLabel?: string
    title?: string
    showDivider?: boolean
    body?: any[]
    buttons?: any[]
  }
  index: number
  pageId: string
  pageType: string
}

export default function FullWidthTextBlock({block}: FullWidthTextBlockProps) {
  const {sectionId, background, sectionLabel, title, showDivider, body, buttons} = block

  const isDark = isDarkBackground(background)
  const textColor = isDark ? 'text-white' : 'text-navy'

  return (
    <SectionWrapper background={background} sectionId={sectionId}>
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {sectionLabel && (
            <p className="text-sm uppercase tracking-widest text-gold font-semibold mb-3">
              {sectionLabel}
            </p>
          )}
          {title && (
            <h2 className={`font-display text-3xl md:text-4xl font-bold mb-4 ${textColor}`}>
              {title}
            </h2>
          )}
          {showDivider && <Divider className="mb-6" />}
          {body && body.length > 0 && <CustomPortableText value={body} isDark={isDark} />}
          {buttons && buttons.length > 0 && (
            <div className="mt-8">
              <ButtonGroup buttons={buttons} />
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}
