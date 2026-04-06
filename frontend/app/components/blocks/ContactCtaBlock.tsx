'use client'

import Image from 'next/image'
import {urlForImage} from '@/sanity/lib/utils'

type BlockProps = {
  index: number
  block: {
    _key: string
    _type: 'contactCtaBlock'
    sectionId?: string
    heading?: string
    subtext?: string
    contactEmail?: string
    buttonLabel?: string
    background?: 'navy' | 'forest' | 'image'
    backgroundImage?: any
  }
  pageId: string
  pageType: string
}

export default function ContactCtaBlock({block}: BlockProps) {
  const {
    sectionId,
    heading = 'Get In Touch!',
    subtext = 'If you have questions, or would like more information',
    contactEmail,
    buttonLabel = 'Contact Us',
    background = 'navy',
    backgroundImage,
  } = block

  if (!contactEmail) return null

  const imageUrl = backgroundImage ? urlForImage(backgroundImage)?.width(1920).height(600).quality(80).auto('format').fit('crop').url() : null
  const hasBackgroundImage = background === 'image' && imageUrl

  // Background color classes based on selection
  const bgColorClass = background === 'forest' ? 'bg-forest' : 'bg-navy'
  // Overlay color for image background
  const overlayClass = background === 'image' ? 'bg-navy/80' : ''

  return (
    <section id={sectionId} className="relative">
      {/* Background */}
      <div className={`relative py-16 lg:py-20 ${!hasBackgroundImage ? bgColorClass : ''}`}>
        {hasBackgroundImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={imageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className={`absolute inset-0 ${overlayClass}`} />
          </div>
        )}

        <div className="relative z-10 container text-center">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gold mb-4">
            {heading}
          </h2>
          <p className="text-white/80 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            {subtext}
          </p>
          <a
            href={`mailto:${contactEmail}`}
            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold bg-gold text-navy clip-corner hover:bg-gold/90 transition-all duration-200"
          >
            {buttonLabel}
          </a>
        </div>
      </div>
    </section>
  )
}
