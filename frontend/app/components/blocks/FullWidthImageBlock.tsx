'use client'

import Image from 'next/image'
import {urlForImage} from '@/sanity/lib/utils'

type FullWidthImageBlockProps = {
  block: {
    _key: string
    _type: 'fullWidthImageBlock'
    sectionId?: string
    image?: {
      alt?: string
      [key: string]: any
    }
  }
  index: number
  pageId: string
  pageType: string
}

export default function FullWidthImageBlock({block}: FullWidthImageBlockProps) {
  const {sectionId, image} = block

  const imageUrl = image ? urlForImage(image)?.width(1920).quality(80).auto('format').fit('crop').url() : null

  if (!imageUrl) return null

  return (
    <section id={sectionId || undefined} className="w-full">
      <div className="relative w-full aspect-[21/9] md:aspect-[3/1]">
        <Image
          src={imageUrl}
          alt={image?.alt || ''}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>
    </section>
  )
}
