import {defineField, defineType, defineArrayMember} from 'sanity'
import {TrendUpwardIcon} from '@sanity/icons'
import {portableTextEditor} from './portableText'

/**
 * Economic Impact Block — stats grid + full table
 * Section id="economic-impact"
 */
export const economicImpactBlock = defineType({
  name: 'economicImpactBlock',
  title: 'Economic Impact',
  type: 'object',
  icon: TrendUpwardIcon,
  groups: [
    {name: 'header', title: 'Header'},
    {name: 'stats', title: 'Headline Stats'},
    {name: 'table', title: 'Impact Table'},
  ],
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      description: 'Used for anchor navigation (e.g., "economic-impact")',
      initialValue: 'economic-impact',
      group: 'header',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      description: 'Full-bleed section background',
      options: {hotspot: true},
      group: 'header',
    }),
    defineField({
      name: 'sectionLabel',
      title: 'Section Label',
      type: 'string',
      group: 'header',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'array',
      of: portableTextEditor,
      description: 'Use "Gold accent" decorator on the key phrase',
      group: 'header',
    }),

    // Headline stats
    defineField({
      name: 'stats',
      title: 'Headline Stats',
      type: 'array',
      description: 'Up to 4 stats',
      validation: (Rule) => Rule.max(4),
      group: 'stats',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stat',
          title: 'Stat',
          fields: [
            defineField({
              name: 'number',
              title: 'Number',
              type: 'string',
              description: 'e.g. "$25.9M"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Uppercase label',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              description: 'Supporting description text',
              rows: 2,
            }),
          ],
          preview: {
            select: {
              title: 'number',
              subtitle: 'label',
            },
          },
        }),
      ],
    }),

    // Impact table
    defineField({
      name: 'tableTitle',
      title: 'Table Title',
      type: 'string',
      group: 'table',
    }),
    defineField({
      name: 'tableRows',
      title: 'Table Rows',
      type: 'array',
      group: 'table',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'tableRow',
          title: 'Table Row',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Row description',
            }),
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              description: 'Economic value (e.g. "$47M")',
            }),
            defineField({
              name: 'jobs',
              title: 'Jobs',
              type: 'string',
              description: 'Jobs figure',
            }),
            defineField({
              name: 'isTotalRow',
              title: 'Is Total Row',
              type: 'boolean',
              description: 'Render as gold highlighted total row',
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'value',
              isTotalRow: 'isTotalRow',
            },
            prepare({title, subtitle, isTotalRow}) {
              return {
                title: title || 'Row',
                subtitle: isTotalRow ? `${subtitle} (Total)` : subtitle,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'footnote',
      title: 'Footnote',
      type: 'text',
      description: 'Statistics Canada attribution note',
      rows: 2,
      group: 'table',
    }),
  ],
  preview: {
    select: {
      title: 'sectionLabel',
      media: 'backgroundImage',
    },
    prepare({title, media}) {
      return {
        title: title || 'Economic Impact Block',
        subtitle: 'Economic Impact',
        media,
      }
    },
  },
})
