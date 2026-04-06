import {defineField, defineType, defineArrayMember} from 'sanity'
import {HomeIcon} from '@sanity/icons'
import {portableTextEditor} from './portableText'

/**
 * Full Bleed Hero — section id="hero"
 * Large background image with title, eyebrow, body text and buttons.
 */
export const heroBlock = defineType({
  name: 'heroBlock',
  title: 'Full Bleed Hero',
  type: 'object',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      description: 'Used for anchor navigation (e.g., "hero")',
      initialValue: 'hero',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      description: 'Full-bleed background. Hotspot enabled.',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      description: 'Small gold uppercase label above title',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Large hero title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body (Legacy)',
      type: 'text',
      description: 'Deprecated: Use Body Content below instead',
      rows: 3,
      deprecated: {
        reason: 'Use the new "Body Content" field below for rich text formatting.',
      },
      hidden: ({value}) => !value,
    }),
    defineField({
      name: 'bodyContent',
      title: 'Body Content',
      type: 'array',
      of: portableTextEditor,
      description: 'Rich text body content with formatting options',
    }),
    defineField({
      name: 'buttons',
      title: 'Buttons',
      type: 'array',
      description: 'Up to 2 buttons',
      of: [defineArrayMember({type: 'button'})],
      validation: (Rule) => Rule.max(2),
    }),
    defineField({
      name: 'overlayStrength',
      title: 'Overlay Strength',
      type: 'string',
      description: 'Darkness of the image overlay',
      options: {
        list: [
          {title: 'Light', value: 'light'},
          {title: 'Medium', value: 'medium'},
          {title: 'Strong', value: 'strong'},
        ],
        layout: 'radio',
      },
      initialValue: 'medium',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'backgroundImage',
    },
    prepare({title, media}) {
      return {
        title: title || 'Hero Block',
        subtitle: 'Full Bleed Hero',
        media,
      }
    },
  },
})
