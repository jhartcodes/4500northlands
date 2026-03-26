import {defineField, defineType, defineArrayMember} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'
import {portableTextEditor} from './portableText'

/**
 * Rezoning Application Block — full-bleed image + text
 * Section id="rezoning" — navy background
 */
export const rezoningBlock = defineType({
  name: 'rezoningBlock',
  title: 'Rezoning Application',
  type: 'object',
  icon: DocumentTextIcon,
  groups: [
    {name: 'layout', title: 'Layout'},
    {name: 'content', title: 'Content'},
  ],
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      description: 'Used for anchor navigation (e.g., "rezoning")',
      initialValue: 'rezoning',
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
    defineField({
      name: 'imagePosition',
      title: 'Image Position',
      type: 'string',
      options: {
        list: [
          {title: 'Left — image left, text right', value: 'left'},
          {title: 'Right — text left, image right', value: 'right'},
        ],
        layout: 'radio',
      },
      initialValue: 'left',
      group: 'layout',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Full height, fills half the section',
      options: {hotspot: true},
      group: 'layout',
    }),

    // Content
    defineField({
      name: 'sectionLabel',
      title: 'Section Label',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'showDivider',
      title: 'Show Divider',
      type: 'boolean',
      initialValue: true,
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: portableTextEditor,
      group: 'content',
    }),
    defineField({
      name: 'buttons',
      title: 'Buttons',
      type: 'array',
      description: 'Up to 2 buttons',
      of: [defineArrayMember({type: 'button'})],
      validation: (Rule) => Rule.max(2),
      group: 'content',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'sectionLabel',
      media: 'image',
    },
    prepare({title, subtitle, media}) {
      return {
        title: title || 'Rezoning Block',
        subtitle: subtitle || 'Rezoning Application',
        media,
      }
    },
  },
})
