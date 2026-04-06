'use client'

import Image from 'next/image'
import {stegaClean} from 'next-sanity'
import {urlForImage} from '@/sanity/lib/utils'
import {ButtonGroup} from '@/app/components/Button'
import CustomPortableText from '@/app/components/PortableText'
import SectionWrapper, {isDarkBackground} from '@/app/components/ui/SectionWrapper'
import Divider from '@/app/components/ui/Divider'
import DidYouKnowCard from '@/app/components/ui/DidYouKnowCard'

type ImageTextBlockProps = {
  block: {
    _key: string
    _type: 'imageTextBlock'
    sectionId?: string
    imagePosition?: 'left' | 'right'
    background?: 'white' | 'cream' | 'mist' | 'navy' | 'forest'
    image?: any
    sectionLabel?: string
    title?: string
    showDivider?: boolean
    body?: any[]
    buttons?: any[]
    intro?: {
      sectionId?: string
      sectionLabel?: string
      title?: string
      showDivider?: boolean
      body?: any[]
    }
    didYouKnowCard?: {
      icon?: string
      eyebrow?: string
      title?: string
      body?: any[]
    }
  }
  index: number
  pageId: string
  pageType: string
}

export default function ImageTextBlock({block}: ImageTextBlockProps) {
  const {
    sectionId,
    imagePosition,
    background,
    image,
    sectionLabel,
    title,
    showDivider,
    body,
    buttons,
    intro,
    didYouKnowCard,
  } = block

  const isImageLeft = stegaClean(imagePosition) !== 'right'
  const isDark = isDarkBackground(background)
  const imageUrl = image ? urlForImage(image)?.width(800).height(600).quality(80).auto('format').fit('crop').url() : null
  const textColor = isDark ? 'text-white' : 'text-navy'

  return (
    <SectionWrapper background={background} sectionId={sectionId}>
      <div className="container">
        {/* Optional Intro Section */}
        {intro && (intro.title || intro.body) && (
          <div id={stegaClean(intro.sectionId) || undefined} className="max-w-3xl mb-12">
            {intro.sectionLabel && (
              <p className="text-sm uppercase tracking-widest text-gold font-semibold mb-3">
                {intro.sectionLabel}
              </p>
            )}
            {intro.title && (
              <h2 className={`font-display text-3xl md:text-4xl font-bold mb-4 ${textColor}`}>
                {intro.title}
              </h2>
            )}
            {intro.showDivider && <Divider className="mb-6" />}
            {intro.body && intro.body.length > 0 && (
              <CustomPortableText value={intro.body} isDark={isDark} />
            )}
          </div>
        )}

        <div
          className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
            isImageLeft ? '' : 'lg:[&>*:first-child]:order-2'
          }`}
        >
          {/* Image */}
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={title || 'Section image'}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            )}
          </div>

          {/* Text Content */}
          <div>
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
            {body && body.length > 0 && (
              <CustomPortableText value={body} isDark={isDark} className="mb-6" />
            )}
            {buttons && buttons.length > 0 && <ButtonGroup buttons={buttons} />}
          </div>
        </div>

        {/* Did You Know Card */}
        {didYouKnowCard && (didYouKnowCard.title || didYouKnowCard.body) && (
          <div className="mt-12">
            <DidYouKnowCard
              icon={didYouKnowCard.icon}
              eyebrow={didYouKnowCard.eyebrow}
              title={didYouKnowCard.title}
              body={didYouKnowCard.body}
              isDark={isDark}
            />
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
