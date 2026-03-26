'use client'

import {stegaClean} from 'next-sanity'
import SectionWrapper, {isDarkBackground} from '@/app/components/ui/SectionWrapper'
import DidYouKnowCard from '@/app/components/ui/DidYouKnowCard'

type DidYouKnowBlockProps = {
  block: {
    _key: string
    _type: 'didYouKnowBlock'
    sectionId?: string
    layout?: 'single' | 'twoColumn'
    background?: 'white' | 'cream' | 'mist' | 'navy' | 'forest'
    // Left/single card
    icon?: string
    eyebrow?: string
    title?: string
    body?: any[]
    // Right card (two-column only)
    rightIcon?: string
    rightEyebrow?: string
    rightTitle?: string
    rightBody?: any[]
  }
  index: number
  pageId: string
  pageType: string
}

export default function DidYouKnowBlock({block}: DidYouKnowBlockProps) {
  const {
    sectionId,
    layout,
    background,
    icon,
    eyebrow,
    title,
    body,
    rightIcon,
    rightEyebrow,
    rightTitle,
    rightBody,
  } = block

  const isTwoColumn = stegaClean(layout) === 'twoColumn'
  const isDark = isDarkBackground(background)

  return (
    <SectionWrapper background={background} sectionId={sectionId}>
      <div className="container">
        <div className={`grid ${isTwoColumn ? 'lg:grid-cols-2' : 'max-w-3xl mx-auto'} gap-8`}>
          {/* Primary Card */}
          <DidYouKnowCard
            icon={icon}
            eyebrow={eyebrow}
            title={title}
            body={body}
            isDark={isDark}
          />

          {/* Right Card (two-column only) */}
          {isTwoColumn && (
            <DidYouKnowCard
              icon={rightIcon}
              eyebrow={rightEyebrow}
              title={rightTitle}
              body={rightBody}
              isDark={isDark}
            />
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}
