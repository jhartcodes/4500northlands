'use client'

import Image from 'next/image'
import {urlForImage} from '@/sanity/lib/utils'
import CustomPortableText from '@/app/components/PortableText'
import Divider from '@/app/components/ui/Divider'

type Column = {
  _key: string
  image?: any
  heading?: string
  body?: any[]
}

type AboutThreeColumnBlockProps = {
  block: {
    _key: string
    _type: 'aboutThreeColumnBlock'
    sectionId?: string
    sectionLabel?: string
    title?: string
    showDivider?: boolean
    introBody?: any[]
    columns?: Column[]
  }
  index: number
  pageId: string
  pageType: string
}

export default function AboutThreeColumnBlock({block}: AboutThreeColumnBlockProps) {
  const {sectionId, sectionLabel, title, showDivider, introBody, columns} = block

  return (
    <section id={sectionId || undefined} className="bg-white section-padding">
      <div className="container">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          {sectionLabel && (
            <p className="text-sm uppercase tracking-widest text-gold font-semibold mb-3">
              {sectionLabel}
            </p>
          )}
          {title && (
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">{title}</h2>
          )}
          {showDivider && <Divider className="mb-6" />}
          {introBody && introBody.length > 0 && <CustomPortableText value={introBody} />}
        </div>

        {/* Columns */}
        {columns && columns.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {columns.map((column) => {
              const imageUrl = column.image
                ? urlForImage(column.image)?.width(400).height(300).url()
                : null

              return (
                <div key={column._key} className="bg-cream rounded-lg overflow-hidden">
                  {imageUrl && (
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={imageUrl}
                        alt={column.heading || 'Column image'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {column.heading && (
                      <h3 className="font-display text-xl font-bold text-navy mb-4">
                        {column.heading}
                      </h3>
                    )}
                    {column.body && column.body.length > 0 && (
                      <CustomPortableText value={column.body} />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
