'use client'

import Image from 'next/image'
import {urlForImage} from '@/sanity/lib/utils'
import CustomPortableText from '@/app/components/PortableText'

type Stat = {
  _key: string
  number?: string
  label?: string
  description?: string
}

type TableRow = {
  _key: string
  label?: string
  value?: string
  jobs?: string
  isTotalRow?: boolean
}

type EconomicImpactBlockProps = {
  block: {
    _key: string
    _type: 'economicImpactBlock'
    sectionId?: string
    backgroundImage?: any
    sectionLabel?: string
    headline?: any[]
    stats?: Stat[]
    tableTitle?: string
    tableRows?: TableRow[]
    footnote?: string
  }
  index: number
  pageId: string
  pageType: string
}

export default function EconomicImpactBlock({block}: EconomicImpactBlockProps) {
  const {sectionId, backgroundImage, sectionLabel, headline, stats, tableTitle, tableRows, footnote} =
    block

  const imageUrl = backgroundImage ? urlForImage(backgroundImage)?.width(1920).height(800).url() : null

  return (
    <section id={sectionId || undefined} className="relative">
      {/* Header with Background */}
      <div className="relative py-16 lg:py-24">
        {imageUrl && (
          <div className="absolute inset-0 z-0">
            <Image
              src={imageUrl}
              alt="Economic impact background"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-navy/80" />
          </div>
        )}

        <div className="relative z-10 container">
          {sectionLabel && (
            <p className="text-sm uppercase tracking-widest text-gold font-semibold mb-4">
              {sectionLabel}
            </p>
          )}
          {headline && headline.length > 0 && (
            <div className="max-w-4xl">
              <CustomPortableText value={headline} isDark className="text-3xl md:text-4xl lg:text-5xl font-display font-bold" />
            </div>
          )}

          {/* Stats Grid */}
          {stats && stats.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
              {stats.map((stat) => (
                <div key={stat._key} className="text-center lg:text-left">
                  {stat.number && (
                    <div className="font-display text-3xl md:text-4xl font-bold text-gold">
                      {stat.number}
                    </div>
                  )}
                  {stat.label && (
                    <div className="text-sm uppercase tracking-wide text-white/70 mt-1">
                      {stat.label}
                    </div>
                  )}
                  {stat.description && (
                    <p className="text-white/80 text-sm mt-2">{stat.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table Section */}
      {tableRows && tableRows.length > 0 && (
        <div className="bg-white py-12 lg:py-16">
          <div className="container">
            {tableTitle && (
              <h3 className="font-display text-2xl md:text-3xl font-bold text-navy mb-8">
                {tableTitle}
              </h3>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-navy/10">
                    <th className="text-left py-4 pr-4 text-sm uppercase tracking-wide text-navy/60">
                      Description
                    </th>
                    <th className="text-right py-4 px-4 text-sm uppercase tracking-wide text-navy/60">
                      Economic Value
                    </th>
                    <th className="text-right py-4 pl-4 text-sm uppercase tracking-wide text-navy/60">
                      Jobs
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row) => (
                    <tr
                      key={row._key}
                      className={`border-b border-navy/10 ${
                        row.isTotalRow ? 'bg-gold/10 font-bold' : ''
                      }`}
                    >
                      <td className={`py-4 pr-4 ${row.isTotalRow ? 'text-navy' : 'text-navy/80'}`}>
                        {row.label}
                      </td>
                      <td
                        className={`py-4 px-4 text-right ${row.isTotalRow ? 'text-gold' : 'text-navy'}`}
                      >
                        {row.value}
                      </td>
                      <td
                        className={`py-4 pl-4 text-right ${row.isTotalRow ? 'text-gold' : 'text-navy'}`}
                      >
                        {row.jobs}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {footnote && <p className="text-sm text-navy/60 mt-6">{footnote}</p>}
          </div>
        </div>
      )}
    </section>
  )
}
