'use client'

import Image from 'next/image'
import {stegaClean} from 'next-sanity'
import {urlForImage} from '@/sanity/lib/utils'
import {ButtonGroup} from '@/app/components/Button'

type HeroBlockProps = {
  block: {
    _key: string
    _type: 'heroBlock'
    sectionId?: string
    backgroundImage?: any
    eyebrow?: string
    title?: string
    body?: string
    buttons?: any[]
    overlayStrength?: 'light' | 'medium' | 'strong'
  }
  index: number
  pageId: string
  pageType: string
}

function getOverlayClass(strength?: string): string {
  const cleanStrength = stegaClean(strength) || 'medium'
  switch (cleanStrength) {
    case 'light':
      return 'bg-black/30'
    case 'strong':
      return 'bg-black/60'
    case 'medium':
    default:
      return 'bg-black/45'
  }
}

export default function HeroBlock({block}: HeroBlockProps) {
  const {sectionId, backgroundImage, eyebrow, title, body, buttons, overlayStrength} = block
  const imageUrl = backgroundImage ? urlForImage(backgroundImage)?.width(1920).height(1080).quality(80).auto('format').fit('crop').url() : null
  const overlayClass = getOverlayClass(overlayStrength)

  return (
    <section
      id={stegaClean(sectionId) || undefined}
      className="relative w-full min-h-[80vh] lg:min-h-screen flex items-center"
    >
      {/* Background Image */}
      {imageUrl && (
        <div className="absolute inset-0 z-0">
          <Image
            src={imageUrl}
            alt={title || 'Hero background'}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className={`absolute inset-0 ${overlayClass}`} />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 container py-24 lg:py-32">
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="text-sm uppercase tracking-widest text-gold font-semibold mb-4">
              {eyebrow}
            </p>
          )}
          {title && (
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {title}
            </h1>
          )}
          {body && (
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">{body}</p>
          )}
          {buttons && buttons.length > 0 && <ButtonGroup buttons={buttons} />}
        </div>
      </div>
    </section>
  )
}
