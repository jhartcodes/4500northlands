import {defineField, defineType, defineArrayMember} from 'sanity'
import {UsersIcon} from '@sanity/icons'
import {portableTextEditor} from './portableText'

/**
 * Community Benefit Block — lists + accordion
 * Section id="community"
 */
export const communityBenefitBlock = defineType({
  name: 'communityBenefitBlock',
  title: 'Community Benefit',
  type: 'object',
  icon: UsersIcon,
  groups: [
    {name: 'intro', title: 'Intro + Total Card'},
    {name: 'summaryLists', title: 'Summary Lists'},
    {name: 'accordion', title: 'Full Accordion'},
  ],
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      description: 'Used for anchor navigation (e.g., "community")',
      initialValue: 'community',
      group: 'intro',
    }),
    defineField({
      name: 'sectionLabel',
      title: 'Section Label',
      type: 'string',
      group: 'intro',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'intro',
    }),
    defineField({
      name: 'introBody',
      title: 'Intro Body',
      type: 'array',
      of: portableTextEditor,
      group: 'intro',
    }),

    // $200M total card
    defineField({
      name: 'totalNumber',
      title: 'Total Number',
      type: 'string',
      description: 'e.g. "+$200M"',
      group: 'intro',
    }),
    defineField({
      name: 'totalLabel',
      title: 'Total Label',
      type: 'string',
      group: 'intro',
    }),
    defineField({
      name: 'totalSub',
      title: 'Total Subtitle',
      type: 'string',
      group: 'intro',
    }),

    // Summary lists
    defineField({
      name: 'cacSummaryItems',
      title: 'CAC Summary Items',
      type: 'array',
      description: 'Left column summary bullets',
      of: [defineArrayMember({type: 'string'})],
      group: 'summaryLists',
    }),
    defineField({
      name: 'addedBenefitItems',
      title: 'Added Benefit Items',
      type: 'array',
      description: 'Right column summary bullets',
      of: [defineArrayMember({type: 'string'})],
      group: 'summaryLists',
    }),

    // Full accordion
    defineField({
      name: 'accordionItems',
      title: 'Accordion Items',
      type: 'array',
      group: 'accordion',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'benefitItem',
          title: 'Benefit Item',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Accordion trigger text',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'itemType',
              title: 'Item Type',
              type: 'string',
              description: 'Controls badge colour',
              options: {
                list: [
                  {title: 'CAC', value: 'cac'},
                  {title: 'Added Benefit', value: 'addedBenefit'},
                ],
                layout: 'radio',
              },
              initialValue: 'cac',
            }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'array',
              of: portableTextEditor,
              description: 'Expanded detail content',
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'itemType',
            },
            prepare({title, subtitle}) {
              return {
                title: title || 'Benefit Item',
                subtitle: subtitle === 'addedBenefit' ? 'Added Benefit' : 'CAC',
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'sectionLabel',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'Community Benefit Block',
        subtitle: subtitle || 'Community Benefit',
      }
    },
  },
})
