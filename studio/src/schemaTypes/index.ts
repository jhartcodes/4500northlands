import {page} from './documents/page'
import {settings} from './singletons/settings'
import {link} from './objects/link'
import {button} from './objects/button'

// Page Builder Blocks
import {heroBlock} from './objects/heroBlock'
import {imageTextBlock} from './objects/imageTextBlock'
import {twoColumnTextBlock} from './objects/twoColumnTextBlock'
import {didYouKnowBlock} from './objects/didYouKnowBlock'
import {processBlock} from './objects/processBlock'
import {economicImpactBlock} from './objects/economicImpactBlock'
import {cacCalculationBlock} from './objects/cacCalculationBlock'
import {communityBenefitBlock} from './objects/communityBenefitBlock'
import {alternatingContentBlock} from './objects/alternatingContentBlock'
import {devStatsBlock} from './objects/devStatsBlock'
import {sitePlanBlock} from './objects/sitePlanBlock'
import {rezoningBlock} from './objects/rezoningBlock'
import {aboutThreeColumnBlock} from './objects/aboutThreeColumnBlock'
import {faqBlock} from './objects/faqBlock'
import {fullWidthImageBlock} from './objects/fullWidthImageBlock'
import {fullWidthTextBlock} from './objects/fullWidthTextBlock'
import {contactCtaBlock} from './objects/contactCtaBlock'
import {interactiveSitePlanBlock} from './objects/interactiveSitePlanBlock'
import {timelineBlock} from './objects/timelineBlock'
import {developmentTimelineBlock} from './objects/developmentTimelineBlock'

// Export an array of all the schema types.
// This is used in the Sanity Studio configuration.
// https://www.sanity.io/docs/studio/schema-types

export const schemaTypes = [
  // Singletons
  settings,
  // Documents
  page,
  // Objects - Core
  link,
  button,
  // Objects - Page Builder Blocks (15 blocks)
  heroBlock,
  imageTextBlock,
  twoColumnTextBlock,
  didYouKnowBlock,
  processBlock,
  economicImpactBlock,
  cacCalculationBlock,
  communityBenefitBlock,
  alternatingContentBlock,
  devStatsBlock,
  sitePlanBlock,
  rezoningBlock,
  aboutThreeColumnBlock,
  faqBlock,
  fullWidthImageBlock,
  fullWidthTextBlock,
  contactCtaBlock,
  interactiveSitePlanBlock,
  timelineBlock,
  developmentTimelineBlock,
]
