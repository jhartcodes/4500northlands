'use client'

import {stegaClean} from 'next-sanity'

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
    theme?: string
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

type ThemeTokens = {
  /** Solid total card */
  slab: string
  slabValue: string
  slabLabel: string
  /** Prose classes for the subtitle. Arbitrary variants must stay literal for Tailwind. */
  slabSubtitle: string
  /** Tinted value cards */
  cardTint: string
  cardRule: string
  cardValue: string
  cardLabel: string
  /** Incentive bar — kept in the gold/navy accent so it stays distinct from the total card */
  bar: string
  barValue: string
  barLabel: string
  barProse: string
}

const themes: Record<string, ThemeTokens> = {
  navy: {
    slab: 'bg-navy',
    slabValue: 'text-gold',
    slabLabel: 'text-white',
    slabSubtitle: 'text-white/75 [&_strong]:text-gold',
    cardTint: 'bg-cream',
    cardRule: 'border-gold',
    cardValue: 'text-navy',
    cardLabel: 'text-navy/70',
    bar: 'bg-gold',
    barValue: 'text-navy',
    barLabel: 'text-navy',
    barProse: '[&_p]:text-navy',
  },
  forest: {
    slab: 'bg-forest',
    slabValue: 'text-gold',
    slabLabel: 'text-white',
    slabSubtitle: 'text-white/75 [&_strong]:text-gold',
    cardTint: 'bg-mist',
    cardRule: 'border-gold',
    cardValue: 'text-forest',
    cardLabel: 'text-forest/80',
    bar: 'bg-gold',
    barValue: 'text-navy',
    barLabel: 'text-navy',
    barProse: '[&_p]:text-navy',
  },
  gold: {
    slab: 'bg-gold',
    slabValue: 'text-navy',
    slabLabel: 'text-navy',
    slabSubtitle: 'text-navy [&_strong]:font-bold',
    cardTint: 'bg-cream',
    cardRule: 'border-navy',
    cardValue: 'text-navy',
    cardLabel: 'text-navy/70',
    bar: 'bg-navy',
    barValue: 'text-gold',
    barLabel: 'text-white',
    barProse: '[&_p]:text-white',
  },
}

/**
 * In preview, Visual Editing appends invisible stega characters to every editable
 * string, which makes even an empty field truthy. Test the cleaned value so preview
 * and production agree on what to render; render the raw value so click-to-edit
 * still resolves the field.
 */
const hasText = (value?: string) => Boolean(stegaClean(value)?.trim())

export default function CACValueBlock({block}: CACValueBlockProps) {
  const {sectionId, theme, totalValue, totalLabel, totalSubtitle, valueCards, incentive} = block

  const t = themes[stegaClean(theme) || 'navy'] || themes.navy
  const hasIncentive =
    incentive &&
    (hasText(incentive.value) || hasText(incentive.label) || Boolean(incentive.body?.length))

  return (
    <SectionWrapper
      background="white"
      sectionId={sectionId}
      fullPadding={false}
      className="pb-section"
    >
      <div className="container">
        {/* Total Card — solid slab so the headline figure carries the section */}
        {(hasText(totalValue) || hasText(totalLabel)) && (
          <div className={`${t.slab} rounded-xl px-8 py-12 md:py-16 text-center mb-4 md:mb-6`}>
            {hasText(totalValue) && (
              <div
                className={`font-display font-bold ${t.slabValue} text-5xl md:text-6xl lg:text-7xl leading-none mb-3`}
              >
                {totalValue}
              </div>
            )}
            {hasText(totalLabel) && (
              <p className={`font-display font-bold ${t.slabLabel} text-xl md:text-2xl`}>
                {totalLabel}
              </p>
            )}
            {totalSubtitle && totalSubtitle.length > 0 && (
              <CustomPortableText
                value={totalSubtitle}
                className={`mt-2 ${t.slabSubtitle} [&_p]:mb-0 [&_p]:text-base md:[&_p]:text-lg`}
              />
            )}
          </div>
        )}

        {/* Value Cards — tinted ground and a theme rule instead of a hairline border */}
        {valueCards && valueCards.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {valueCards.map((card) => (
              <div
                key={card._key}
                className={`${t.cardTint} ${t.cardRule} border-t-4 rounded-b-xl px-5 py-7 md:px-6 md:py-8`}
              >
                {hasText(card.value) && (
                  <div
                    className={`font-display font-bold ${t.cardValue} text-4xl md:text-5xl lg:text-6xl leading-none mb-3`}
                  >
                    {card.value}
                  </div>
                )}
                {hasText(card.label) && (
                  <p className={`${t.cardLabel} text-sm md:text-base`}>{card.label}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Incentive Bar — optional, hidden unless the editor fills it in */}
        {hasIncentive && (
          <div
            className={`${t.bar} rounded-xl px-6 py-7 md:px-10 md:py-8 mt-4 md:mt-6 grid md:grid-cols-[auto_1fr] gap-6 md:gap-10 items-center`}
          >
            <div className="md:max-w-[12rem]">
              {hasText(incentive?.value) && (
                <div
                  className={`font-display font-bold ${t.barValue} text-4xl md:text-5xl lg:text-6xl leading-none mb-2`}
                >
                  {incentive.value}
                </div>
              )}
              {hasText(incentive?.label) && (
                <p className={`${t.barLabel} font-semibold text-sm md:text-base`}>
                  {incentive.label}
                </p>
              )}
            </div>
            {incentive?.body && incentive.body.length > 0 && (
              <CustomPortableText
                value={incentive.body}
                className={`${t.barProse} [&_p]:mb-0 [&_p]:text-base md:[&_p]:text-lg [&_p]:leading-relaxed`}
              />
            )}
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
