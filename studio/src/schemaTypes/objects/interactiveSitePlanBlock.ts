import {defineField, defineType, defineArrayMember} from 'sanity'
import {PinIcon} from '@sanity/icons'

/**
 * Interactive Site Plan Block
 * Site plan image with numbered hotspot markers that show tooltips on hover/tap
 */
export const interactiveSitePlanBlock = defineType({
  name: 'interactiveSitePlanBlock',
  title: 'Interactive Site Plan',
  type: 'object',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      description: 'Used for anchor navigation (e.g., "interactive-site-plan")',
    }),
    defineField({
      name: 'background',
      title: 'Section Background',
      type: 'string',
      options: {
        list: [
          {title: 'White', value: 'white'},
          {title: 'Cream (#F5F2EC)', value: 'cream'},
          {title: 'Mist (#E8EDE9)', value: 'mist'},
        ],
        layout: 'radio',
      },
      initialValue: 'white',
    }),
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'Optional title above the site plan',
    }),
    defineField({
      name: 'sitePlanImage',
      title: 'Site Plan Image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hotspots',
      title: 'Hotspots',
      type: 'array',
      description: 'Interactive markers on the site plan',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'hotspot',
          title: 'Hotspot',
          fields: [
            defineField({
              name: 'number',
              title: 'Number',
              type: 'number',
              description: 'Number displayed in the marker (1-9)',
              validation: (Rule) => Rule.required().min(1).max(9),
            }),
            defineField({
              name: 'positionX',
              title: 'Position X (%)',
              type: 'number',
              description: 'Horizontal position from left (0-100)',
              validation: (Rule) => Rule.required().min(0).max(100),
            }),
            defineField({
              name: 'positionY',
              title: 'Position Y (%)',
              type: 'number',
              description: 'Vertical position from top (0-100)',
              validation: (Rule) => Rule.required().min(0).max(100),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Short name for this area',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              description: 'Detailed text shown in the tooltip on hover/tap',
            }),
          ],
          preview: {
            select: {
              number: 'number',
              label: 'label',
            },
            prepare({number, label}) {
              return {
                title: `${number}. ${label}` || 'Hotspot',
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
      media: 'sitePlanImage',
    },
    prepare({title, media}) {
      return {
        title: title || 'Interactive Site Plan',
        subtitle: 'Interactive Site Plan Block',
        media,
      }
    },
  },
})
