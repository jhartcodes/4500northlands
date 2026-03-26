'use client'

import Image from 'next/image'
import {urlForImage} from '@/sanity/lib/utils'

type LegendItem = {
  _key: string
  number?: number
  label?: string
}

type PlazaCallout = {
  _key: string
  heading?: string
  body?: string
}

type PlazaImage = {
  _key: string
  alt?: string
  [key: string]: any
}

type SitePlanBlockProps = {
  block: {
    _key: string
    _type: 'sitePlanBlock'
    sectionId?: string
    sitePlanImage?: any
    legendItems?: LegendItem[]
    plazaTitle?: string
    plazaImages?: PlazaImage[]
    plazaCallouts?: PlazaCallout[]
  }
  index: number
  pageId: string
  pageType: string
}

export default function SitePlanBlock({block}: SitePlanBlockProps) {
  const {sectionId, sitePlanImage, legendItems, plazaTitle, plazaImages, plazaCallouts} = block

  const sitePlanUrl = sitePlanImage
    ? urlForImage(sitePlanImage)?.width(1200)?.height(800)?.url()
    : null

  return (
    <section id={sectionId || undefined} className="bg-white section-padding">
      <div className="container">
        {/* Site Plan */}
        <div className="mb-16">
          {sitePlanUrl && (
            <div className="relative aspect-3/2 rounded-lg overflow-hidden mb-8">
              <Image
                src={sitePlanUrl}
                alt="Site plan"
                fill
                className="object-contain bg-mist"
                sizes="100vw"
              />
            </div>
          )}

          {/* Legend */}
          {legendItems && legendItems.length > 0 && (
            <div className="flex flex-wrap gap-4 justify-center">
              {legendItems.map((item) => (
                <div key={item._key} className="flex items-center gap-2">
                  {item.number && (
                    <span className="w-6 h-6 bg-gold text-navy rounded-full flex items-center justify-center text-sm font-bold">
                      {item.number}
                    </span>
                  )}
                  {item.label && <span className="text-navy/80">{item.label}</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Plaza Detail (optional) */}
        {plazaTitle && (
          <div className="border-t border-navy/10 pt-16">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-navy mb-8 text-center">
              {plazaTitle}
            </h3>

            <div className="flex flex-col gap-6">
              {/* Plaza Image */}
              {plazaImages && plazaImages.length > 0 && (
                <div className="flex flex-col items-center space-y-4">
                  {plazaImages?.map((image) => {
                    const imageUrl = urlForImage(image)?.url()

                    if (!imageUrl) {
                      return null
                    }

                    return (
                      <Image
                        key={image._key}
                        src={imageUrl}
                        alt={image.alt || plazaTitle}
                        width={1000}
                        height={529}
                      />
                    )
                  })}
                </div>
              )}

              {/* Plaza Callouts */}
              {plazaCallouts && plazaCallouts.length > 0 && (
                <div className="overflow-x-auto pb-2">
                  <div className="grid grid-flow-col auto-cols-[minmax(220px,260px)] gap-3">
                    {plazaCallouts.map((callout) => (
                      <div
                        key={callout._key}
                        className="bg-cream border border-navy/10 rounded-lg p-3 text-center"
                      >
                        {callout.heading && (
                          <h4 className="font-display text-sm font-bold text-navy mb-1.5">
                            {callout.heading}
                          </h4>
                        )}
                        {callout.body && <p className="text-xs text-navy/70">{callout.body}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
