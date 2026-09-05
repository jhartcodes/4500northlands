import {defineField, defineType, defineArrayMember} from 'sanity'
import {CalendarIcon} from '@sanity/icons'

/**
 * Timeline Block — Stacked Cards with progress bar
 * Milestone timeline showing project phases
 */

/**
 * Deliberately narrower than the shared `portableTextEditor`. Phase descriptions render
 * inside a five-column card roughly 220px wide, so headings, inline images and callout
 * boxes would break the grid. Paragraphs, bold/italic, links and lists only.
 */
const phaseDescriptionEditor = [
  defineArrayMember({
    type: 'block',
    styles: [{title: 'Normal', value: 'normal'}],
    marks: {
      decorators: [
        {title: 'Bold', value: 'strong'},
        {title: 'Italic', value: 'em'},
      ],
      annotations: [
        {
          name: 'link',
          type: 'object',
          title: 'Link',
          fields: [
            {
              name: 'href',
              type: 'url',
              title: 'URL',
              validation: (Rule) =>
                Rule.uri({allowRelative: true, scheme: ['https', 'http', 'mailto', 'tel']}),
            },
            {
              name: 'openInNewTab',
              type: 'boolean',
              title: 'Open in new tab',
              initialValue: false,
            },
          ],
        },
      ],
    },
    lists: [
      {title: 'Bullet list', value: 'bullet'},
      {title: 'Numbered list', value: 'number'},
    ],
  }),
]

export const timelineBlock = defineType({
  name: 'timelineBlock',
  title: 'Timeline Block',
  type: 'object',
  icon: CalendarIcon,
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
        ],
        layout: 'radio',
      },
      initialValue: 'mist',
    }),
    defineField({
      name: 'legendLabel',
      title: 'Legend Label',
      type: 'string',
      description: 'Eyebrow text above the legend (e.g. "Milestone sequence")',
      initialValue: 'Milestone sequence',
    }),
    defineField({
      name: 'legendDescription',
      title: 'Legend Description',
      type: 'text',
      rows: 2,
      description: 'Explanatory text in the legend area',
    }),
    defineField({
      name: 'phases',
      title: 'Timeline Phases',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'phase',
          title: 'Phase',
          fields: [
            defineField({
              name: 'date',
              title: 'Title (Year or Date)',
              type: 'string',
              description:
                'The heading shown in the ribbon at the top of the card. Free text — e.g. "2017", "2023 - 2024", "2027 Onwards", "Winter 2025-2026".',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'array',
              of: phaseDescriptionEditor,
              description:
                'Card body. Supports paragraphs, bold, italic, links and lists.',
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: 'status',
              title: 'Status',
              type: 'string',
              options: {
                list: [
                  {title: 'Completed', value: 'completed'},
                  {title: 'Active (Current)', value: 'active'},
                  {title: 'Upcoming', value: 'upcoming'},
                ],
                layout: 'radio',
              },
              validation: (Rule) => Rule.required(),
              initialValue: 'upcoming',
            }),
            defineField({
              name: 'activeLabel',
              title: 'Active Label',
              type: 'string',
              description: 'Label shown when phase is active (e.g. "We are here")',
              hidden: ({parent}) => parent?.status !== 'active',
            }),
          ],
          preview: {
            select: {
              date: 'date',
              status: 'status',
            },
            prepare({date, status}) {
              const statusLabel =
                status === 'active' ? 'Current' : status === 'completed' ? 'Completed' : 'Upcoming'
              return {
                title: date,
                subtitle: statusLabel,
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      phases: 'phases',
    },
    prepare({phases}) {
      const count = phases?.length || 0
      const activePhase = phases?.find((p: {status?: string}) => p.status === 'active')
      return {
        title: 'Timeline Block',
        subtitle: activePhase
          ? `${count} phases — Current: ${activePhase.date}`
          : `${count} phase${count !== 1 ? 's' : ''}`,
      }
    },
  },
})
