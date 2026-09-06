import {defineArrayMember, defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons'

/**
 * Image Block — one full-bleed image, or a row of two or three.
 *
 * Renamed from `fullWidthImageBlock` in September 2026; that type is gone and no
 * document references it any more. `layout` and `height` still fall back to
 * full-width/short when absent, which is what the migrated documents rely on.
 * See studio/migrations/renameFullWidthImageToImageBlock.ts
 */

const captionField = defineField({
  name: 'caption',
  title: 'Caption',
  type: 'string',
})

const altField = defineField({
  name: 'alt',
  title: 'Alt text',
  type: 'string',
  description: 'Describe the image for screen readers.',
})

export const imageBlock = defineType({
  name: 'imageBlock',
  title: 'Image',
  type: 'object',
  icon: ImageIcon,
  groups: [
    {name: 'layout', title: 'Layout'},
    {name: 'content', title: 'Caption'},
  ],
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      description: 'Used for anchor navigation.',
      group: 'layout',
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Full width — one edge-to-edge image', value: 'full'},
          {title: 'Grid — two or three images side by side', value: 'grid'},
        ],
        layout: 'radio',
      },
      initialValue: 'full',
      group: 'layout',
    }),
    defineField({
      name: 'height',
      title: 'Height',
      type: 'string',
      description:
        'Short and Tall crop the image to a fixed shape. Natural shows the whole image uncropped — use it for diagrams and comparison graphics, where a crop cuts off the edge labels.',
      options: {
        list: [
          {title: 'Short', value: 'short'},
          {title: 'Tall', value: 'tall'},
          {title: 'Natural — no crop', value: 'natural'},
        ],
        layout: 'radio',
      },
      initialValue: 'short',
      group: 'layout',
    }),

    // Full-width layout
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      fields: [altField],
      hidden: ({parent}) => parent?.layout === 'grid',
      group: 'layout',
    }),

    // Grid layout
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      description: 'Two or three images shown side by side. Each can carry its own caption.',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [altField, captionField],
          preview: {
            select: {media: 'asset', title: 'caption', subtitle: 'alt'},
            prepare({media, title, subtitle}) {
              return {media, title: title || 'Image', subtitle}
            },
          },
        }),
      ],
      validation: (Rule) => Rule.min(2).max(3),
      hidden: ({parent}) => parent?.layout !== 'grid',
      group: 'layout',
    }),

    // Caption
    defineField({
      name: 'captionStyle',
      title: 'Caption style',
      type: 'string',
      description:
        'On image caption will add dark overlay, choose below image for images that need clear display.',
      options: {
        list: [
          {title: 'Below image', value: 'below'},
          {title: 'On image', value: 'onImage'},
        ],
        layout: 'radio',
      },
      initialValue: 'below',
      group: 'content',
    }),
    defineField({
      name: 'kicker',
      title: 'Kicker',
      type: 'string',
      description: 'Small uppercase label above the caption.',
      group: 'content',
    }),
    defineField({
      ...captionField,
      description: 'In Grid layout this describes the row as a whole.',
      group: 'content',
    }),
  ],
  preview: {
    select: {
      media: 'image',
      firstOfGrid: 'images.0',
      caption: 'caption',
      alt: 'image.alt',
      layout: 'layout',
      height: 'height',
      images: 'images',
    },
    prepare({media, firstOfGrid, caption, alt, layout, height, images}) {
      const isGrid = layout === 'grid'
      const count = Array.isArray(images) ? images.length : 0
      return {
        title: caption || alt || 'Image',
        subtitle: isGrid
          ? `Grid · ${count} image${count === 1 ? '' : 's'} · ${height || 'short'}`
          : `Full width · ${height || 'short'}`,
        media: (isGrid ? firstOfGrid : media) ?? ImageIcon,
      }
    },
  },
})
