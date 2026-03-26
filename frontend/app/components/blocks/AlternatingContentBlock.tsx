'use client'

import Image from 'next/image'
import {stegaClean} from 'next-sanity'
import {urlForImage} from '@/sanity/lib/utils'
import CustomPortableText from '@/app/components/PortableText'
import SectionWrapper, {isDarkBackground} from '@/app/components/ui/SectionWrapper'
import Divider from '@/app/components/ui/Divider'

type ContentRow = {
  _key: string
  imagePosition?: 'left' | 'right'
  textBackground?: 'white' | 'cream' | 'mist'
  image?: any
  rowLabel?: string
  rowTitle?: string
  showDivider?: boolean
  body?: any[]
  inlineNote?: string
}

type AlternatingContentBlockProps = {
  block: {
    _key: string
    _type: 'alternatingContentBlock'
    sectionId?: string
    background?: 'white' | 'cream' | 'mist' | 'navy' | 'forest'
    sectionLabel?: string
    title?: string
    intro?: string
    rows?: ContentRow[]
  }
  index: number
  pageId: string
  pageType: string
}

const textBgClasses: Record<string, string> = {
  white: 'bg-white',
  cream: 'bg-cream',
  mist: 'bg-mist',
}

export default function AlternatingContentBlock({block}: AlternatingContentBlockProps) {
  const {sectionId, background, sectionLabel, title, intro, rows} = block

  const isDark = isDarkBackground(background)
  const textColor = isDark ? 'text-white' : 'text-navy'

  return (
    <SectionWrapper background={background} sectionId={sectionId}>
      <div className="container">
        {/* Section Header */}
        {(sectionLabel || title || intro) && (
          <div className="max-w-3xl mb-12">
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
              <p className={`text-lg leading-relaxed ${isDark ? 'text-white/80' : 'text-navy/70'}`}>
                {intro}
              </p>
            )}
          </div>
        )}

        {/* Rows */}
        {rows && rows.length > 0 && (
          <div className="space-y-8 lg:space-y-0">
            {rows.map((row) => {
              const isImageLeft = stegaClean(row.imagePosition) !== 'right'
              const textBg = stegaClean(row.textBackground) || 'white'
              const textBgClass = textBgClasses[textBg] || textBgClasses.white
              const imageUrl = row.image
                ? urlForImage(row.image)?.width(800).height(600).url()
                : null

              return (
                <div
                  key={row._key}
                  className={`grid lg:grid-cols-2 ${
                    isImageLeft ? '' : 'lg:[&>*:first-child]:order-2'
                  }`}
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[400px]">
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt={row.rowTitle || 'Content image'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    )}
                  </div>

                  {/* Text */}
                  <div className={`${textBgClass} p-8 lg:p-12 flex flex-col justify-center`}>
                    {row.rowLabel && (
                      <p className="text-sm uppercase tracking-widest text-gold font-semibold mb-3">
                        {row.rowLabel}
                      </p>
                    )}
                    {row.rowTitle && (
                      <h3 className="font-display text-2xl md:text-3xl font-bold text-navy mb-4">
                        {row.rowTitle}
                      </h3>
                    )}
                    {row.showDivider && <Divider className="mb-6" />}
                    {row.body && row.body.length > 0 && (
                      <CustomPortableText value={row.body} className="mb-4" />
                    )}
                    {row.inlineNote && (
                      <div className="mt-4 p-4 bg-gold/10 rounded border-l-4 border-gold">
                        <p className="text-sm text-navy/80">{row.inlineNote}</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
