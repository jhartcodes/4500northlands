'use client'

import CustomPortableText from '@/app/components/PortableText'
import Accordion, {AccordionItem} from '@/app/components/ui/Accordion'

type BenefitItem = {
  _key: string
  label?: string
  itemType?: 'cac' | 'addedBenefit'
  body?: any[]
}

type CommunityBenefitBlockProps = {
  block: {
    _key: string
    _type: 'communityBenefitBlock'
    sectionId?: string
    sectionLabel?: string
    title?: string
    introBody?: any[]
    totalNumber?: string
    totalLabel?: string
    totalSub?: string
    cacSummaryItems?: string[]
    addedBenefitItems?: string[]
    accordionItems?: BenefitItem[]
  }
  index: number
  pageId: string
  pageType: string
}

export default function CommunityBenefitBlock({block}: CommunityBenefitBlockProps) {
  const {
    sectionId,
    sectionLabel,
    title,
    introBody,
    totalNumber,
    totalLabel,
    totalSub,
    cacSummaryItems,
    addedBenefitItems,
    accordionItems,
  } = block

  return (
    <section id={sectionId || undefined} className="bg-white section-padding">
      <div className="container">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-12">
          <div>
            {sectionLabel && (
              <p className="text-sm uppercase tracking-widest text-gold font-semibold mb-3">
                {sectionLabel}
              </p>
            )}
            {title && (
              <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">{title}</h2>
            )}
            {introBody && introBody.length > 0 && <CustomPortableText value={introBody} />}
          </div>

          {/* Total Card */}
          {totalNumber && (
            <div className="bg-cream p-8 rounded-lg text-center flex flex-col justify-center">
              <div className="font-display text-4xl md:text-5xl font-bold text-gold">
                {totalNumber}
              </div>
              {totalLabel && (
                <div className="text-lg font-semibold text-navy mt-2">{totalLabel}</div>
              )}
              {totalSub && <div className="text-navy/60 mt-1">{totalSub}</div>}
            </div>
          )}
        </div>

        {/* Summary Lists */}
        {(cacSummaryItems?.length || addedBenefitItems?.length) && (
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* CAC Items */}
            {cacSummaryItems && cacSummaryItems.length > 0 && (
              <div className="bg-mist p-6 rounded-lg">
                <h4 className="font-display text-lg font-bold text-navy mb-4">CAC Contributions</h4>
                <ul className="space-y-2">
                  {cacSummaryItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-navy/80">
                      <span className="text-gold shrink-0">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Added Benefit Items */}
            {addedBenefitItems && addedBenefitItems.length > 0 && (
              <div className="bg-mist p-6 rounded-lg">
                <h4 className="font-display text-lg font-bold text-navy mb-4">Added Benefits</h4>
                <ul className="space-y-2">
                  {addedBenefitItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-navy/80">
                      <span className="text-forest shrink-0">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Accordion */}
        {accordionItems && accordionItems.length > 0 && (
          <div className="bg-cream rounded-lg p-6 md:p-8">
            <Accordion>
              {accordionItems.map((item) => (
                <AccordionItem
                  key={item._key}
                  heading={item.label || 'Benefit'}
                  badge={
                    item.itemType
                      ? {
                          text: item.itemType === 'cac' ? 'CAC' : 'Added Benefit',
                          variant: item.itemType,
                        }
                      : undefined
                  }
                >
                  {item.body && item.body.length > 0 && <CustomPortableText value={item.body} />}
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </div>
    </section>
  )
}
