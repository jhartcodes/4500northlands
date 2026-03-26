import {defineQuery} from 'next-sanity'

export const settingsQuery = defineQuery(`*[_type == "settings"][0]{
  ...,
  logo {
    ...,
    asset->
  },
  ctaBackgroundImage {
    ...,
    asset->
  }
}`)

export const homeNavigationQuery = defineQuery(`
  *[_type == 'page' && slug.current == 'home'][0]{
    name,
    navigation[] {
      _key,
      label,
      sectionId
    }
  }
`)

// Reusable field snippets
const buttonFields = /* groq */ `
  {
    _key,
    label,
    href,
    variant,
    openInNewTab
  }
`

const portableTextFields = /* groq */ `
  {
    ...,
    markDefs[] {
      ...,
      _type == "link" => {
        href,
        openInNewTab
      }
    }
  }
`

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    navigation[] {
      _key,
      label,
      sectionId
    },
    seoTitle,
    seoDescription,
    "pageBuilder": pageBuilder[]{
      _key,
      _type,

      // Hero Block
      _type == "heroBlock" => {
        sectionId,
        backgroundImage {
          ...,
          asset->
        },
        eyebrow,
        title,
        body,
        "buttons": buttons[] ${buttonFields},
        overlayStrength
      },

      // Image + Text Block
      _type == "imageTextBlock" => {
        sectionId,
        imagePosition,
        background,
        image {
          ...,
          asset->
        },
        sectionLabel,
        title,
        showDivider,
        body[] ${portableTextFields},
        "buttons": buttons[] ${buttonFields},
        didYouKnowCard {
          icon,
          eyebrow,
          title,
          body[] ${portableTextFields}
        }
      },

      // Two-Column Text Block
      _type == "twoColumnTextBlock" => {
        sectionId,
        background,
        sectionLabel,
        title,
        body[] ${portableTextFields},
        cardTitle,
        cardBody[] ${portableTextFields}
      },

      // Did You Know Block
      _type == "didYouKnowBlock" => {
        sectionId,
        layout,
        background,
        icon,
        eyebrow,
        title,
        body[] ${portableTextFields},
        rightIcon,
        rightEyebrow,
        rightTitle,
        rightBody[] ${portableTextFields}
      },

      // Process Block
      _type == "processBlock" => {
        sectionId,
        background,
        imagePosition,
        image {
          ...,
          asset->
        },
        sectionLabel,
        title,
        intro,
        accordionItems[] {
          _key,
          heading,
          body[] ${portableTextFields}
        }
      },

      // Economic Impact Block
      _type == "economicImpactBlock" => {
        sectionId,
        backgroundImage {
          ...,
          asset->
        },
        sectionLabel,
        headline[] ${portableTextFields},
        stats[] {
          _key,
          number,
          label,
          description
        },
        tableTitle,
        tableRows[] {
          _key,
          label,
          value,
          jobs,
          isTotalRow
        },
        footnote
      },

      // CAC Calculation Block
      _type == "cacCalculationBlock" => {
        sectionId,
        badgeText,
        sectionLabel,
        title,
        showDivider,
        introBody[] ${portableTextFields},
        introImage {
          ...,
          asset->
        },
        imagePosition,
        stepsTitle,
        steps[] {
          _key,
          stepLabel,
          body[] ${portableTextFields}
        },
        formulaResidentialLabel,
        formulaResidentialSub,
        formulaHotelLabel,
        formulaHotelSub,
        formulaResultLabel
      },

      // Community Benefit Block
      _type == "communityBenefitBlock" => {
        sectionId,
        sectionLabel,
        title,
        introBody[] ${portableTextFields},
        totalNumber,
        totalLabel,
        totalSub,
        cacSummaryItems,
        addedBenefitItems,
        accordionItems[] {
          _key,
          label,
          itemType,
          body[] ${portableTextFields}
        }
      },

      // Alternating Content Block
      _type == "alternatingContentBlock" => {
        sectionId,
        background,
        sectionLabel,
        title,
        intro,
        rows[] {
          _key,
          imagePosition,
          textBackground,
          image {
            ...,
            asset->
          },
          rowLabel,
          rowTitle,
          showDivider,
          body[] ${portableTextFields},
          inlineNote
        }
      },

      // Dev Stats Block
      _type == "devStatsBlock" => {
        sectionId,
        background,
        title,
        stats[] {
          _key,
          number,
          label
        }
      },

      // Site Plan Block
      _type == "sitePlanBlock" => {
        sectionId,
        sitePlanImage {
          ...,
          asset->
        },
        legendItems[] {
          _key,
          number,
          label
        },
        plazaTitle,
        plazaImages[] {
          ...,
          asset->
        },
        plazaCallouts[] {
          _key,
          heading,
          body
        }
      },

      // Interactive Site Plan Block
      _type == "interactiveSitePlanBlock" => {
        sectionId,
        background,
        title,
        sitePlanImage {
          ...,
          asset->
        },
        hotspots[] {
          _key,
          number,
          positionX,
          positionY,
          label,
          description
        }
      },

      // Rezoning Block
      _type == "rezoningBlock" => {
        sectionId,
        background,
        imagePosition,
        image {
          ...,
          asset->
        },
        sectionLabel,
        title,
        showDivider,
        body[] ${portableTextFields},
        "buttons": buttons[] ${buttonFields}
      },

      // About Three Column Block
      _type == "aboutThreeColumnBlock" => {
        sectionId,
        sectionLabel,
        title,
        showDivider,
        introBody[] ${portableTextFields},
        columns[] {
          _key,
          image {
            ...,
            asset->
          },
          heading,
          body[] ${portableTextFields}
        }
      },

      // FAQ Block
      _type == "faqBlock" => {
        sectionId,
        background,
        title,
        items[] {
          _key,
          question,
          answer[] ${portableTextFields}
        }
      },

      // Full Width Image Block
      _type == "fullWidthImageBlock" => {
        sectionId,
        image {
          ...,
          asset->
        }
      }
    }
  }
`)

export const sitemapData = defineQuery(`
  *[_type == "page" && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`)

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`)
