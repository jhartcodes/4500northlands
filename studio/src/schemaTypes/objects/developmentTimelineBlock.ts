import {defineField, defineType, defineArrayMember} from 'sanity'
import {BlockElementIcon} from '@sanity/icons'

/**
 * Development Timeline Block — Layered Cards
 * Phased development plan with visual phase cards
 */
export const developmentTimelineBlock = defineType({
  name: 'developmentTimelineBlock',
  title: 'Development Timeline Block',
  type: 'object',
  icon: BlockElementIcon,
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
          {title: 'Navy (#1B3A52)', value: 'navy'},
          {title: 'Forest (#3A5A40)', value: 'forest'},
          {title: 'Cream (#F5F2EC)', value: 'cream'},
        ],
        layout: 'radio',
      },
      initialValue: 'navy',
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      description: 'Small text above the title (e.g. "Phased implementation")',
      initialValue: 'Phased implementation',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Main heading for the section',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 3,
      description: 'Intro paragraph below the title',
    }),
    defineField({
      name: 'phases',
      title: 'Development Phases',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'developmentPhase',
          title: 'Development Phase',
          fields: [
            defineField({
              name: 'phaseNumber',
              title: 'Phase Number',
              type: 'string',
              description: 'e.g. "Phase 1"',
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              description: 'Details about this phase',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              phaseNumber: 'phaseNumber',
            },
            prepare({title, phaseNumber}) {
              return {
                title: title,
                subtitle: phaseNumber,
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
      phases: 'phases',
    },
    prepare({title, phases}) {
      const count = phases?.length || 0
      return {
        title: title || 'Development Timeline Block',
        subtitle: `${count} phase${count !== 1 ? 's' : ''}`,
      }
    },
  },
})
