import React from 'react'

import {
  HeroBlock,
  ImageTextBlock,
  TwoColumnTextBlock,
  DidYouKnowBlock,
  ProcessBlock,
  EconomicImpactBlock,
  CACCalculationBlock,
  CommunityBenefitBlock,
  AlternatingContentBlock,
  DevStatsBlock,
  SitePlanBlock,
  InteractiveSitePlanBlock,
  RezoningBlock,
  AboutThreeColumnBlock,
  FAQBlock,
  FullWidthImageBlock,
  ContactCtaBlock,
} from '@/app/components/blocks'
import {dataAttr} from '@/sanity/lib/utils'

type BlockProps = {
  index: number
  block: any
  pageId: string
  pageType: string
}

type BlocksType = {
  [key: string]: React.FC<BlockProps>
}

const Blocks: BlocksType = {
  // New page builder blocks
  heroBlock: HeroBlock,
  imageTextBlock: ImageTextBlock,
  twoColumnTextBlock: TwoColumnTextBlock,
  didYouKnowBlock: DidYouKnowBlock,
  processBlock: ProcessBlock,
  economicImpactBlock: EconomicImpactBlock,
  cacCalculationBlock: CACCalculationBlock,
  communityBenefitBlock: CommunityBenefitBlock,
  alternatingContentBlock: AlternatingContentBlock,
  devStatsBlock: DevStatsBlock,
  sitePlanBlock: SitePlanBlock,
  interactiveSitePlanBlock: InteractiveSitePlanBlock,
  rezoningBlock: RezoningBlock,
  aboutThreeColumnBlock: AboutThreeColumnBlock,
  faqBlock: FAQBlock,
  fullWidthImageBlock: FullWidthImageBlock,
  contactCtaBlock: ContactCtaBlock,
}

/**
 * Used by the <PageBuilder>, this component renders the component that matches the block type.
 */
export default function BlockRenderer({block, index, pageId, pageType}: BlockProps) {
  // Block does exist
  if (typeof Blocks[block._type] !== 'undefined') {
    return (
      <div
        key={block._key}
        data-sanity={dataAttr({
          id: pageId,
          type: pageType,
          path: `pageBuilder[_key=="${block._key}"]`,
        }).toString()}
      >
        {React.createElement(Blocks[block._type], {
          key: block._key,
          block: block,
          index: index,
          pageId: pageId,
          pageType: pageType,
        })}
      </div>
    )
  }
  // Block doesn't exist yet
  return React.createElement(
    () => (
      <div className="w-full bg-cream text-center text-navy/60 p-20 rounded">
        A &ldquo;{block._type}&rdquo; block hasn&apos;t been created
      </div>
    ),
    {key: block._key},
  )
}
