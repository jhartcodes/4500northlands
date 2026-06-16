import {defineField, defineType, defineArrayMember} from 'sanity'
import {TrendUpwardIcon} from '@sanity/icons'
import {portableTextEditor} from './portableText'

/**
 * CAC Value Block
 * Replaces the old "CAC 101 — Calculation Steps" grid.
 * Layout: full-width total card → row of value stat cards → gold incentive bar.
 */
export const cacValueBlock = defineType({
  name: 'cacValueBlock',
  title: 'CAC Value',
  type: 'object',
  icon: TrendUpwardIcon,
  groups: [
    {name: 'total', title: 'Total Card'},
    {name: 'cards', title: 'Value Cards'},
    {name: 'incentive', title: 'Incentive Bar'},
  ],
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      description: 'Used for anchor navigation (e.g., "cac")',
      group: 'total',
    }),

    // Total card
    defineField({
      name: 'totalValue',
      title: 'Total Value',
      type: 'string',
      description: 'Large headline figure, e.g. "$46M"',
      validation: (Rule) => Rule.required(),
      group: 'total',
    }),
    defineField({
      name: 'totalLabel',
      title: 'Total Label',
      type: 'string',
      description: 'Bold label under the figure, e.g. "Total CAC Value"',
      group: 'total',
    }),
    defineField({
      name: 'totalSubtitle',
      title: 'Total Subtitle',
      type: 'array',
      of: portableTextEditor,
      description: 'Optional supporting line, e.g. "Including the **$1M** RMOW Schedule Incentive Contribution". Bold key phrases.',
      group: 'total',
    }),

    // Value cards
    defineField({
      name: 'valueCards',
      title: 'Value Cards',
      type: 'array',
      group: 'cards',
      validation: (Rule) => Rule.min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'valueCard',
          title: 'Value Card',
          fields: [
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              description: 'Large figure, e.g. "$15M"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Description, e.g. "Investment towards Off-site Recreation"',
            }),
          ],
          preview: {
            select: {
              title: 'value',
              subtitle: 'label',
            },
          },
        }),
      ],
    }),

    // Incentive bar (optional)
    defineField({
      name: 'incentive',
      title: 'Incentive Bar',
      type: 'object',
      description: 'Optional gold highlight bar below the value cards. Leave blank to hide.',
      group: 'incentive',
      fields: [
        defineField({
          name: 'value',
          title: 'Value',
          type: 'string',
          description: 'Large figure, e.g. "$1M"',
        }),
        defineField({
          name: 'label',
          title: 'Label',
          type: 'string',
          description: 'Label under the figure, e.g. "RMOW Schedule Incentive Contribution"',
        }),
        defineField({
          name: 'body',
          title: 'Body',
          type: 'array',
          of: portableTextEditor,
          description: 'Supporting paragraph — bold key phrases and dates.',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'totalValue',
      subtitle: 'totalLabel',
    },
    prepare({title, subtitle}) {
      return {
        title: title ? `${title} — CAC Value` : 'CAC Value',
        subtitle: subtitle || 'Value cards + incentive',
      }
    },
  },
})
