import {defineField, defineType, defineArrayMember} from 'sanity'
import {BarChartIcon} from '@sanity/icons'

/**
 * Large Stats Row — Brentwood Block style
 * Development Plan stats
 */
export const devStatsBlock = defineType({
  name: 'devStatsBlock',
  title: 'Large Stats Row',
  type: 'object',
  icon: BarChartIcon,
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      description: 'Used for anchor navigation',
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
          {title: 'Navy (#1B3A52)', value: 'navy'},
          {title: 'Forest (#3A5A40)', value: 'forest'},
        ],
        layout: 'radio',
      },
      initialValue: 'white',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Optional title to display above the stats',
    }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      description: 'Up to 6 stats. Use "XX" as placeholder until final counts are confirmed.',
      validation: (Rule) => Rule.max(6),
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
              description: 'e.g. "70", "13.5ac", "XX"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Label below the number',
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
  ],
  preview: {
    select: {
      stats: 'stats',
    },
    prepare({stats}) {
      const count = stats?.length || 0
      return {
        title: 'Dev Stats Block',
        subtitle: `${count} stat${count !== 1 ? 's' : ''}`,
      }
    },
  },
})
