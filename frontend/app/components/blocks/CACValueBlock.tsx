'use client'

import type {CmsPortableText} from '@/sanity/lib/types'
import CustomPortableText from '@/app/components/PortableText'
import SectionWrapper from '@/app/components/ui/SectionWrapper'

type ValueCard = {
  _key: string
  value?: string
  label?: string
}

type CACValueBlockProps = {
  block: {
    _key: string
    _type: 'cacValueBlock'
    sectionId?: string
    totalValue?: string
    totalLabel?: string
    totalSubtitle?: CmsPortableText
    valueCards?: ValueCard[]
    incentive?: {
      value?: string
      label?: string
      body?: CmsPortableText
    }
  }
  index: number
  pageId: string
  pageType: string
}

export default function CACValueBlock({block}: CACValueBlockProps) {
  const {sectionId, totalValue, totalLabel, totalSubtitle, valueCards, incentive} = block

  const hasIncentive = incentive && (incentive.value || incentive.label || incentive.body?.length)

  return (
    <SectionWrapper background="white" sectionId={sectionId} fullPadding={false} className="pb-section">
      <div className="container">
        {/* Total Card */}
        {(totalValue || totalLabel) && (
          <div className="bg-white border border-navy/10 shadow-sm rounded-xl px-8 py-10 md:py-12 text-center mb-6">
            {totalValue && (
              <div className="font-display font-bold text-navy text-4xl md:text-5xl lg:text-6xl leading-none mb-3">
                {totalValue}
              </div>
            )}
            {totalLabel && (
              <p className="font-display font-bold text-navy text-xl md:text-2xl">{totalLabel}</p>
            )}
            {totalSubtitle && totalSubtitle.length > 0 && (
              <CustomPortableText
                value={totalSubtitle}
                className="mt-2 text-navy/70 [&_p]:mb-0 [&_p]:text-base md:[&_p]:text-lg"
              />
            )}
          </div>
        )}

        {/* Value Cards */}
        {valueCards && valueCards.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
            {valueCards.map((card) => (
              <div
                key={card._key}
                className="bg-white border border-navy/10 shadow-sm rounded-xl px-5 py-7 md:px-6 md:py-8"
              >
                {card.value && (
                  <div className="font-display font-bold text-navy text-4xl md:text-5xl lg:text-6xl leading-none mb-3">
                    {card.value}
                  </div>
                )}
                {card.label && <p className="text-navy/80 text-sm md:text-base">{card.label}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Incentive Bar */}
        {hasIncentive && (
          <div className="bg-gold/80 rounded-xl px-6 py-7 md:px-10 md:py-8 grid md:grid-cols-[auto_1fr] gap-6 md:gap-10 items-center">
            <div className="md:max-w-[12rem]">
              {incentive?.value && (
                <div className="font-display font-bold text-navy text-4xl md:text-5xl lg:text-6xl leading-none mb-2">
                  {incentive.value}
                </div>
              )}
              {incentive?.label && (
                <p className="text-navy font-semibold text-sm md:text-base">{incentive.label}</p>
              )}
            </div>
            {incentive?.body && incentive.body.length > 0 && (
              <CustomPortableText
                value={incentive.body}
                className="[&_p]:mb-0 [&_p]:text-navy [&_p]:text-base md:[&_p]:text-lg [&_p]:leading-relaxed"
              />
            )}
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
