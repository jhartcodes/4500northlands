import {defineField, defineType, defineArrayMember} from 'sanity'
import {InlineIcon} from '@sanity/icons'
import {portableTextEditor} from './portableText'

/**
 * About — Three Column Cards Block
 * Section id="about"
 * Current columns: Philanthropy & Community Impact, Beedie Luminaries, Cindy Beedie
 */
export const aboutThreeColumnBlock = defineType({
  name: 'aboutThreeColumnBlock',
  title: 'About — Three Column Cards',
  type: 'object',
  icon: InlineIcon,
  groups: [
    {name: 'intro', title: 'Section Intro'},
    {name: 'columns', title: 'Columns'},
  ],
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      description: 'Used for anchor navigation (e.g., "about")',
      initialValue: 'about',
      group: 'intro',
    }),
    defineField({
      name: 'sectionLabel',
      title: 'Section Label',
      type: 'string',
      group: 'intro',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'intro',
    }),
    defineField({
      name: 'showDivider',
      title: 'Show Divider',
      type: 'boolean',
      initialValue: true,
      group: 'intro',
    }),
    defineField({
      name: 'introBody',
      title: 'Intro Body',
      type: 'array',
      of: portableTextEditor,
      description: 'Paragraphs above the 3 columns',
      group: 'intro',
    }),

    // Columns
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'array',
      description: 'Up to 3 columns',
      validation: (Rule) => Rule.max(3),
      group: 'columns',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'column',
          title: 'Column',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {hotspot: true},
            }),
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
            }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'array',
              of: portableTextEditor,
            }),
          ],
          preview: {
            select: {
              title: 'heading',
              media: 'image',
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
        title: title || 'About Three Column Block',
        subtitle: subtitle || 'About — Three Column Cards',
      }
    },
  },
})
