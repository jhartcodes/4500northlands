'use client'

import Image from 'next/image'
import {stegaClean} from 'next-sanity'
import {urlForImage} from '@/sanity/lib/utils'
import {ButtonGroup} from '@/app/components/Button'
import CustomPortableText from '@/app/components/PortableText'
import {isDarkBackground} from '@/app/components/ui/SectionWrapper'
import Divider from '@/app/components/ui/Divider'

type RezoningBlockProps = {
  block: {
    _key: string
    _type: 'rezoningBlock'
    sectionId?: string
    background?: 'white' | 'cream' | 'mist' | 'navy' | 'forest'
    imagePosition?: 'left' | 'right'
    image?: any
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

const bgClasses: Record<string, string> = {
  white: 'bg-white',
  cream: 'bg-cream',
  mist: 'bg-mist',
  navy: 'bg-navy',
  forest: 'bg-forest',
}

export default function RezoningBlock({block}: RezoningBlockProps) {
  const {sectionId, background, imagePosition, image, sectionLabel, title, showDivider, body, buttons} =
    block

  const isImageLeft = stegaClean(imagePosition) !== 'right'
  const isDark = isDarkBackground(background)
  const bg = stegaClean(background) || 'navy'
  const bgClass = bgClasses[bg] || bgClasses.navy
  const imageUrl = image ? urlForImage(image)?.width(800).height(900).url() : null
  const textColor = isDark ? 'text-white' : 'text-navy'

  return (
    <section id={stegaClean(sectionId) || undefined} className={bgClass}>
      <div
        className={`grid lg:grid-cols-2 ${isImageLeft ? '' : 'lg:[&>*:first-child]:order-2'}`}
      >
        {/* Image - full height */}
        <div className="relative aspect-[4/5] lg:aspect-auto lg:min-h-[600px]">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={title || 'Rezoning image'}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          )}
        </div>

        {/* Text Content */}
        <div className="py-8 lg:py-16 content-padding flex flex-col justify-center">
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
    </section>
  )
}
