import {defineField, defineType, defineArrayMember} from 'sanity'
import {TimelineIcon} from '@sanity/icons'
import {portableTextEditor} from './portableText'

/**
 * Process / Our History Block — accordion + image
 * Section id="process"
 */
export const processBlock = defineType({
  name: 'processBlock',
  title: 'Process / Our History',
  type: 'object',
  icon: TimelineIcon,
  groups: [
    {name: 'layout', title: 'Layout'},
    {name: 'content', title: 'Content'},
    {name: 'accordion', title: 'Accordion'},
  ],
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      description: 'Used for anchor navigation (e.g., "process")',
      initialValue: 'process',
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
      initialValue: 'white',
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

    // Image
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      group: 'content',
    }),

    // Text
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
      name: 'intro',
      title: 'Intro',
      type: 'text',
      description: 'Plain paragraph above accordion',
      rows: 3,
      group: 'content',
    }),

    // Accordion items
    defineField({
      name: 'accordionItems',
      title: 'Accordion Items',
      type: 'array',
      group: 'accordion',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'accordionItem',
          title: 'Accordion Item',
          fields: [
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
              description: 'Accordion trigger label',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'array',
              of: portableTextEditor,
              description: 'Timeline entries, paragraphs, lists — full rich text',
            }),
          ],
          preview: {
            select: {
              title: 'heading',
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
      media: 'image',
    },
    prepare({title, subtitle, media}) {
      return {
        title: title || 'Process Block',
        subtitle: subtitle || 'Process / Our History',
        media,
      }
    },
  },
})
