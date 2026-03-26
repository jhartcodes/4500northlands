import {defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons'

/**
 * Full Width Image Block — edge-to-edge image with no padding
 */
export const fullWidthImageBlock = defineType({
  name: 'fullWidthImageBlock',
  title: 'Full Width Image',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      description: 'Used for anchor navigation',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Full-width image with no padding',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describe the image for accessibility',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      media: 'image',
      alt: 'image.alt',
    },
    prepare({media, alt}) {
      return {
        title: alt || 'Full Width Image',
        subtitle: 'Full Width Image Block',
        media,
      }
    },
  },
})
