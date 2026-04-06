'use client'

import Image from 'next/image'
import {stegaClean} from 'next-sanity'
import {urlForImage} from '@/sanity/lib/utils'
import CustomPortableText from '@/app/components/PortableText'
import SectionWrapper, {isDarkBackground} from '@/app/components/ui/SectionWrapper'
import Accordion, {AccordionItem} from '@/app/components/ui/Accordion'

type AccordionItemType = {
  _key: string
  heading?: string
  body?: any[]
}

type ProcessBlockProps = {
  block: {
    _key: string
    _type: 'processBlock'
    sectionId?: string
    background?: 'white' | 'cream' | 'mist' | 'navy' | 'forest'
    imagePosition?: 'left' | 'right'
    image?: any
    sectionLabel?: string
    title?: string
    intro?: string
    accordionItems?: AccordionItemType[]
  }
  index: number
  pageId: string
  pageType: string
}

export default function ProcessBlock({block}: ProcessBlockProps) {
  const {sectionId, background, imagePosition, image, sectionLabel, title, intro, accordionItems} =
    block

  const isImageLeft = stegaClean(imagePosition) !== 'right'
  const isDark = isDarkBackground(background)
  const imageUrl = image ? urlForImage(image)?.width(800).height(800).quality(80).auto('format').fit('crop').url() : null
  const textColor = isDark ? 'text-white' : 'text-navy'

  return (
    <SectionWrapper background={background} sectionId={sectionId}>
      <div className="container">
        <div
          className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-start ${
            isImageLeft ? '' : 'lg:[&>*:first-child]:order-2'
          }`}
        >
          {/* Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden lg:sticky lg:top-8">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={title || 'Process image'}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            )}
          </div>

          {/* Text Content + Accordion */}
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
            {intro && (
              <p className={`text-lg leading-relaxed mb-8 ${isDark ? 'text-white/80' : 'text-navy/70'}`}>
                {intro}
              </p>
            )}

            {/* Accordion */}
            {accordionItems && accordionItems.length > 0 && (
              <Accordion>
                {accordionItems.map((item, index) => (
                  <AccordionItem
                    key={item._key}
                    heading={item.heading || `Item ${index + 1}`}
                    defaultOpen={index === 0}
                    isDark={isDark}
                  >
                    {item.body && item.body.length > 0 && (
                      <CustomPortableText value={item.body} isDark={isDark} />
                    )}
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
