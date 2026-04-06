import {defineField, defineType} from 'sanity'
import {TextIcon} from '@sanity/icons'
import {portableTextEditor} from './portableText'

/**
 * Full Width Text Block
 * Single column rich text section with background color options.
 * Use for introductory text, standalone content sections, or announcements.
 */
export const fullWidthTextBlock = defineType({
  name: 'fullWidthTextBlock',
  title: 'Full Width Text',
  type: 'object',
  icon: TextIcon,
  groups: [
    {name: 'layout', title: 'Layout'},
    {name: 'content', title: 'Content'},
  ],
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      description: 'Used for anchor navigation',
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
          {title: 'Navy (#1B3A52)', value: 'navy'},
        ],
        layout: 'radio',
      },
      initialValue: 'white',
      group: 'layout',
    }),

    // Content
    defineField({
      name: 'sectionLabel',
      title: 'Section Label',
      type: 'string',
      description: 'Gold uppercase label above title',
      group: 'content',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Section heading',
      group: 'content',
    }),
    defineField({
      name: 'showDivider',
      title: 'Show Divider',
      type: 'boolean',
      description: 'Gold line under title',
      initialValue: true,
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: portableTextEditor,
      description: 'Full rich text content',
      group: 'content',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'sectionLabel',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'Full Width Text Block',
        subtitle: subtitle || 'Full Width Text',
      }
    },
  },
})
