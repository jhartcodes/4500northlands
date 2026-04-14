import {defineField, defineType, defineArrayMember} from 'sanity'
import {CalendarIcon} from '@sanity/icons'

/**
 * Timeline Block — Stacked Cards with progress bar
 * Milestone timeline showing project phases
 */
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
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'date',
              title: 'Date',
              type: 'string',
              description: 'e.g. "2021", "Winter 2025-2026", "September 2025"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              description: 'Brief explanation of this milestone',
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
              title: 'title',
              date: 'date',
              status: 'status',
            },
            prepare({title, date, status}) {
              const statusLabel = status === 'active' ? ' (Current)' : status === 'completed' ? ' (Done)' : ''
              return {
                title: title,
                subtitle: `${date}${statusLabel}`,
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
          ? `${count} phases — Current: ${activePhase.title}`
          : `${count} phase${count !== 1 ? 's' : ''}`,
      }
    },
  },
})
