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
  FullWidthTextBlock,
  ContactCtaBlock,
  TimelineBlock,
  DevelopmentTimelineBlock,
} from '@/app/components/blocks'
import type {PageBuilderSection} from '@/sanity/lib/types'
import {dataAttr} from '@/sanity/lib/utils'

type BlockProps = {
  index: number
  block: PageBuilderSection
  pageId: string
  pageType: string
}

type BlocksType = {
  [key: string]: React.ElementType
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
  fullWidthTextBlock: FullWidthTextBlock,
  contactCtaBlock: ContactCtaBlock,
  timelineBlock: TimelineBlock,
  developmentTimelineBlock: DevelopmentTimelineBlock,
}

/**
 * Used by the <PageBuilder>, this component renders the component that matches the block type.
 */
export default function BlockRenderer({block, index, pageId, pageType}: BlockProps) {
  const Block = Blocks[block._type] as React.ComponentType<BlockProps> | undefined

  // Block does exist
  if (Block) {
    return (
      <div
        key={block._key}
        data-sanity={dataAttr({
          id: pageId,
          type: pageType,
          path: `pageBuilder[_key=="${block._key}"]`,
        }).toString()}
      >
        <Block key={block._key} block={block} index={index} pageId={pageId} pageType={pageType} />
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
