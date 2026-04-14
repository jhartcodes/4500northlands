import {defineField, defineType, defineArrayMember} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

/**
 * Page schema for a single-page website with block-based content.
 * Each block can have a sectionId for anchor-based navigation.
 * Learn more: https://www.sanity.io/docs/studio/schema-types
 */

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Page Name',
      type: 'string',
      description: 'Internal name for the page',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'navigation',
      title: 'Navigation Items',
      description: 'Menu items that link to sections on the page',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'navItem',
          title: 'Navigation Item',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'sectionId',
              title: 'Section ID',
              type: 'string',
              description: 'The ID of the section to scroll to',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'sectionId',
            },
            prepare({title, subtitle}) {
              return {
                title: title,
                subtitle: `#${subtitle}`,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page Builder',
      description: 'Build your page using these content blocks',
      type: 'array',
      of: [
        // 16 Page Builder Blocks
        defineArrayMember({type: 'heroBlock'}),
        defineArrayMember({type: 'imageTextBlock'}),
        defineArrayMember({type: 'twoColumnTextBlock'}),
        defineArrayMember({type: 'didYouKnowBlock'}),
        defineArrayMember({type: 'processBlock'}),
        defineArrayMember({type: 'economicImpactBlock'}),
        defineArrayMember({type: 'cacCalculationBlock'}),
        defineArrayMember({type: 'communityBenefitBlock'}),
        defineArrayMember({type: 'alternatingContentBlock'}),
        defineArrayMember({type: 'devStatsBlock'}),
        defineArrayMember({type: 'sitePlanBlock'}),
        defineArrayMember({type: 'interactiveSitePlanBlock'}),
        defineArrayMember({type: 'rezoningBlock'}),
        defineArrayMember({type: 'aboutThreeColumnBlock'}),
        defineArrayMember({type: 'faqBlock'}),
        defineArrayMember({type: 'fullWidthImageBlock'}),
        defineArrayMember({type: 'fullWidthTextBlock'}),
        defineArrayMember({type: 'contactCtaBlock'}),
        defineArrayMember({type: 'timelineBlock'}),
        defineArrayMember({type: 'developmentTimelineBlock'}),
      ],
      options: {
        insertMenu: {
          views: [
            {
              name: 'grid',
              previewImageUrl: (schemaTypeName) =>
                `/static/page-builder-thumbnails/${schemaTypeName}.webp`,
            },
          ],
        },
      },
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Title for search engines (defaults to page name if empty)',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      description: 'Description for search engines',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      slug: 'slug.current',
    },
    prepare({title, slug}) {
      return {
        title: title,
        subtitle: `/${slug}`,
        media: DocumentIcon,
      }
    },
  },
})
