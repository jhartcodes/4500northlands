import {defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons'

/**
 * @deprecated Replaced by `imageBlock`. Kept registered ONLY so that documents
 * still carrying `_type: "fullWidthImageBlock"` keep rendering while the rename
 * migration runs. Hidden from the "add block" menu — nothing new should use it.
 *
 * Remove this file, its registration in index.ts, and its entry in
 * documents/page.ts once `renameFullWidthImageToImageBlock.ts` has been applied
 * to production. See "Renaming or removing a block type" in the README.
 */
export const fullWidthImageBlock = defineType({
  name: 'fullWidthImageBlock',
  title: 'Full Width Image (deprecated — use Image)',
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
