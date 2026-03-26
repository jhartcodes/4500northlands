'use client'

import Image from 'next/image'
import {stegaClean} from 'next-sanity'
import {urlForImage} from '@/sanity/lib/utils'
import {ButtonGroup} from './Button'

type HeroProps = {
  block: {
    _key: string
    _type: 'hero'
    sectionId?: string
    layout?: 'fullWidthBackground' | 'photoWithText'
    image?: any
    title?: string
    subtitle?: string
    textSize?: 'large' | 'small'
    textAlignLarge?: 'left' | 'center' | 'right'
    textAlignSmall?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
    buttons?: any[]
  }
  index: number
  pageId: string
  pageType: string
}

function getTextPositionClasses(textSize: string | undefined, alignLarge: string | undefined, alignSmall: string | undefined): string {
  const size = stegaClean(textSize)

  if (size === 'small') {
    const align = stegaClean(alignSmall) || 'bottomLeft'
    switch (align) {
      case 'topLeft':
        return 'items-start justify-start text-left'
      case 'topRight':
        return 'items-start justify-end text-right'
      case 'bottomRight':
        return 'items-end justify-end text-right'
      case 'bottomLeft':
      default:
        return 'items-end justify-start text-left'
    }
  }

  // Large text
  const align = stegaClean(alignLarge) || 'center'
  switch (align) {
    case 'left':
      return 'items-center justify-start text-left'
    case 'right':
      return 'items-center justify-end text-right'
    case 'center':
    default:
      return 'items-center justify-center text-center'
  }
}

export default function Hero({block}: HeroProps) {
  const {sectionId, layout, image, title, subtitle, textSize, textAlignLarge, textAlignSmall, buttons} = block
  const cleanLayout = stegaClean(layout) || 'fullWidthBackground'
  const cleanTextSize = stegaClean(textSize) || 'large'
  const imageUrl = image ? urlForImage(image)?.width(1920).height(1080).url() : null

  const positionClasses = getTextPositionClasses(textSize, textAlignLarge, textAlignSmall)

  return (
    <section
      id={stegaClean(sectionId) || undefined}
      className="relative w-full min-h-[70vh] lg:min-h-[80vh] flex"
    >
      {/* Background Image */}
      {imageUrl && (
        <div className="absolute inset-0 z-0">
          <Image
            src={imageUrl}
            alt={title || 'Hero image'}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Content */}
      <div className={`relative z-10 w-full flex px-6 lg:px-12 py-12 lg:py-24 ${positionClasses}`}>
        <div className={`max-w-4xl ${cleanTextSize === 'small' ? 'max-w-md p-6 bg-black/50 rounded-lg' : ''}`}>
          {title && (
            <h1 className={`font-bold text-white ${cleanTextSize === 'large' ? 'text-4xl md:text-5xl lg:text-6xl' : 'text-2xl md:text-3xl'}`}>
              {title}
            </h1>
          )}
          {subtitle && (
            <p className={`mt-4 text-white/90 ${cleanTextSize === 'large' ? 'text-lg md:text-xl lg:text-2xl' : 'text-base'}`}>
              {subtitle}
            </p>
          )}
          {buttons && buttons.length > 0 && (
            <div className="mt-8">
              <ButtonGroup buttons={buttons} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
