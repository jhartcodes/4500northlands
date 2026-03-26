import {defineField, defineType} from 'sanity'
import {BlockContentIcon} from '@sanity/icons'
import {portableTextEditor} from './portableText'

/**
 * Two-Column Text Block — "CAC Value Gap" style
 * Left column with text, right column rendered as inset card.
 */
export const twoColumnTextBlock = defineType({
  name: 'twoColumnTextBlock',
  title: 'Two-Column Text',
  type: 'object',
  icon: BlockContentIcon,
  groups: [
    {name: 'layout', title: 'Layout'},
    {name: 'leftColumn', title: 'Left Column'},
    {name: 'rightColumn', title: 'Right Column (Card)'},
  ],
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      description: 'Used for anchor navigation (e.g., "cac-gap")',
      group: 'layout',
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
      group: 'layout',
    }),

    // Left column
    defineField({
      name: 'sectionLabel',
      title: 'Section Label',
      type: 'string',
      description: 'Gold uppercase label',
      group: 'leftColumn',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Column heading',
      group: 'leftColumn',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: portableTextEditor,
      description: 'Full rich text',
      group: 'leftColumn',
    }),

    // Right column (card)
    defineField({
      name: 'cardTitle',
      title: 'Card Title',
      type: 'string',
      description: 'Card heading',
      group: 'rightColumn',
    }),
    defineField({
      name: 'cardBody',
      title: 'Card Body',
      type: 'array',
      of: portableTextEditor,
      description: 'Full rich text',
      group: 'rightColumn',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'sectionLabel',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'Two-Column Text Block',
        subtitle: subtitle || 'Two-Column Text',
      }
    },
  },
})
