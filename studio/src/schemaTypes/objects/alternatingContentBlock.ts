import {defineField, defineType, defineArrayMember} from 'sanity'
import {StackCompactIcon} from '@sanity/icons'
import {portableTextEditor} from './portableText'

/**
 * Alternating Image/Text Rows — Development Plan
 * Section id="development" rows
 * Each row independently controls image position and text panel background.
 */
export const alternatingContentBlock = defineType({
  name: 'alternatingContentBlock',
  title: 'Alternating Image/Text Rows',
  type: 'object',
  icon: StackCompactIcon,
  groups: [
    {name: 'section', title: 'Section'},
    {name: 'rows', title: 'Rows'},
  ],
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      description: 'Used for anchor navigation (e.g., "development")',
      group: 'section',
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
      group: 'section',
    }),
    defineField({
      name: 'sectionLabel',
      title: 'Section Label',
      type: 'string',
      group: 'section',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'section',
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 3,
      group: 'section',
    }),

    // Rows
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      group: 'rows',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'contentRow',
          title: 'Content Row',
          fields: [
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
            }),
            defineField({
              name: 'textBackground',
              title: 'Text Background',
              type: 'string',
              options: {
                list: [
                  {title: 'White', value: 'white'},
                  {title: 'Cream (#F5F2EC)', value: 'cream'},
                  {title: 'Mist (#E8EDE9)', value: 'mist'},
                ],
                layout: 'radio',
              },
              initialValue: 'white',
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {hotspot: true},
            }),
            defineField({
              name: 'rowLabel',
              title: 'Row Label',
              type: 'string',
              description: 'Gold uppercase row label',
            }),
            defineField({
              name: 'rowTitle',
              title: 'Row Title',
              type: 'string',
            }),
            defineField({
              name: 'showDivider',
              title: 'Show Divider',
              type: 'boolean',
              initialValue: true,
            }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'array',
              of: portableTextEditor,
            }),
            defineField({
              name: 'inlineNote',
              title: 'Inline Note',
              type: 'text',
              description: '"Did you know?" callout at bottom of text panel',
              rows: 2,
            }),
          ],
          preview: {
            select: {
              title: 'rowTitle',
              subtitle: 'rowLabel',
              media: 'image',
            },
            prepare({title, subtitle, media}) {
              return {
                title: title || 'Content Row',
                subtitle: subtitle || '',
                media,
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
      subtitle: 'sectionLabel',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'Alternating Content Block',
        subtitle: subtitle || 'Development Plan',
      }
    },
  },
})
