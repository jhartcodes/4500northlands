import {defineField, defineType, defineArrayMember} from 'sanity'
import {HelpCircleIcon} from '@sanity/icons'
import {portableTextEditor} from './portableText'

/**
 * FAQ — Accordion Block
 * Section id="faq" — navy background
 */
export const faqBlock = defineType({
  name: 'faqBlock',
  title: 'FAQ — Accordion',
  type: 'object',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      description: 'Used for anchor navigation (e.g., "faq")',
      initialValue: 'faq',
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
      initialValue: 'navy',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Section heading',
    }),
    defineField({
      name: 'items',
      title: 'FAQ Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqItem',
          title: 'FAQ Item',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'array',
              of: portableTextEditor,
              description: 'Bold, italic, links, lists all supported',
            }),
          ],
          preview: {
            select: {
              title: 'question',
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      items: 'items',
    },
    prepare({title, items}) {
      const count = items?.length || 0
      return {
        title: title || 'FAQ Block',
        subtitle: `${count} question${count !== 1 ? 's' : ''}`,
      }
    },
  },
})
