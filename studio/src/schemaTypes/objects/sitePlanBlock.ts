import {defineField, defineType, defineArrayMember} from 'sanity'
import {PinIcon} from '@sanity/icons'

/**
 * Site Plan + Legend Block
 * Proposed Site Plan + Plaza sections
 */
export const sitePlanBlock = defineType({
  name: 'sitePlanBlock',
  title: 'Site Plan + Legend',
  type: 'object',
  icon: PinIcon,
  groups: [
    {name: 'sitePlan', title: 'Site Plan'},
    {name: 'plaza', title: 'Plaza Detail'},
  ],
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      description: 'Used for anchor navigation (e.g., "site-plan")',
      group: 'sitePlan',
    }),
    defineField({
      name: 'sitePlanImage',
      title: 'Site Plan Images',
      type: 'image',
      options: {hotspot: true},
      group: 'sitePlan',
    }),
    defineField({
      name: 'legendItems',
      title: 'Legend Items',
      type: 'array',
      group: 'sitePlan',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'legendItem',
          title: 'Legend Item',
          fields: [
            defineField({
              name: 'number',
              title: 'Number',
              type: 'number',
              description: '1–9, renders as numbered circle',
              validation: (Rule) => Rule.min(1).max(9),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              title: 'label',
              number: 'number',
            },
            prepare({title, number}) {
              return {
                title: `${number}. ${title}` || 'Legend Item',
              }
            },
          },
        }),
      ],
    }),

    // Plaza detail (optional)
    defineField({
      name: 'plazaTitle',
      title: 'Plaza Title',
      type: 'string',
      description: 'Leave blank to hide plaza section',
      group: 'plaza',
    }),


    defineField({
      name: 'plazaImages',
      title: 'Plaza Images',
      type: 'array',
      description: 'Add one or more plaza images. First image is featured.',
      options: {
        layout: 'grid',
      },
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative text',
              type: 'string',
            }),
          ],
        }),
      ],
      group: 'plaza',
    }),
    defineField({
      name: 'plazaCallouts',
      title: 'Plaza Callouts',
      type: 'array',
      group: 'plaza',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'plazaCallout',
          title: 'Plaza Callout',
          fields: [
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
            }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              title: 'heading',
              subtitle: 'body',
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      media: 'sitePlanImage',
    },
    prepare({media}) {
      return {
        title: 'Site Plan Block',
        subtitle: 'Site Plan + Legend',
        media,
      }
    },
  },
})
