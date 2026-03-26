'use client'

import Image from 'next/image'
import {stegaClean} from 'next-sanity'
import {urlForImage} from '@/sanity/lib/utils'

type StatItem = {
  _key: string
  _type: 'statItem'
  image?: any
  value?: string
  title?: string
  subtitle?: string
}

type StatsSectionProps = {
  block: {
    _key: string
    _type: 'statsSection'
    sectionId?: string
    title?: string
    subtitle?: string
    stats?: StatItem[]
    source?: string
  }
  index: number
  pageId: string
  pageType: string
}

function StatCard({stat}: {stat: StatItem}) {
  const imageUrl = stat.image ? urlForImage(stat.image)?.width(400).height(300).url() : null

  return (
    <div className="flex flex-col items-center text-center p-6">
      {imageUrl && (
        <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
          <Image
            src={imageUrl}
            alt={stat.title || 'Stat image'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>
      )}
      {stat.value && (
        <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {stat.value}
        </div>
      )}
      {stat.title && (
        <div className="text-lg font-medium text-gray-700">
          {stat.title}
        </div>
      )}
      {stat.subtitle && (
        <div className="text-sm text-gray-500 mt-1">
          {stat.subtitle}
        </div>
      )}
    </div>
  )
}

export default function StatsSection({block}: StatsSectionProps) {
  const {sectionId, title, subtitle, stats, source} = block

  if (!stats || stats.length === 0) return null

  const gridCols = stats.length <= 3 ? `grid-cols-1 md:grid-cols-${stats.length}` : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'

  return (
    <section
      id={stegaClean(sectionId) || undefined}
      className="py-16 lg:py-24 bg-gray-50"
    >
      <div className="container">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className={`grid ${gridCols} gap-8`}>
          {stats.map((stat) => (
            <StatCard key={stat._key} stat={stat} />
          ))}
        </div>

        {source && (
          <p className="text-center text-sm text-gray-500 mt-8">
            Source: {source}
          </p>
        )}
      </div>
    </section>
  )
}
