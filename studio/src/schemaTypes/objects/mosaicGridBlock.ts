import {defineField, defineType, defineArrayMember} from 'sanity'
import {ThLargeIcon, BlockElementIcon, ImageIcon} from '@sanity/icons'

/**
 * Mosaic Grid
 * Full-bleed mosaic of coloured text tiles and photo tiles.
 *
 * Rows hold 2 or 3 tiles of equal width and tiles sit flush — no gutters, square
 * corners. Tile width is derived from the number of tiles in the row rather than
 * stored, so a row can never claim a column count its contents don't match.
 */

/** Light surfaces only — tile text is always navy, so there is no dark branch. */
const tileBackgrounds = [
  {title: 'White', value: 'white'},
  {title: 'Cream (#F5F2EC)', value: 'cream'},
  {title: 'Mist (#E8EDE9)', value: 'mist'},
]

/**
 * One shared four-step scale for both the title and the body, each rung named for
 * the heading it matches so the client picks by reference to the rest of the site.
 */
const textSizes = [
  {title: 'Small — matches Heading 4', value: 'small'},
  {title: 'Medium — matches Heading 3', value: 'medium'},
  {title: 'Large — matches Heading 2', value: 'large'},
  {title: 'Extra Large — matches Heading 2 (Large)', value: 'extraLarge'},
]

const textTile = defineArrayMember({
  type: 'object',
  name: 'textTile',
  title: 'Text Tile',
  icon: BlockElementIcon,
  fields: [
    defineField({
      name: 'background',
      title: 'Tile Background',
      type: 'string',
      options: {list: tileBackgrounds, layout: 'radio'},
      initialValue: 'cream',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Optional large line, e.g. "277" or "$45M". Leave blank for a body-only tile.',
    }),
    defineField({
      name: 'titleSize',
      title: 'Title Size',
      type: 'string',
      options: {list: textSizes, layout: 'radio'},
      initialValue: 'large',
      hidden: ({parent}) => !parent?.title,
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'string',
      description: 'The label, e.g. "New Homes" or "Amenity Contribution".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bodySize',
      title: 'Body Size',
      type: 'string',
      options: {list: textSizes, layout: 'radio'},
      initialValue: 'medium',
    }),
  ],
  preview: {
    select: {title: 'title', body: 'body', background: 'background'},
    prepare({title, body, background}) {
      return {
        title: title ? `${title} — ${body}` : body || 'Text Tile',
        subtitle: `Text · ${background || 'cream'}`,
      }
    },
  },
})

const imageTile = defineArrayMember({
  type: 'object',
  name: 'imageTile',
  title: 'Image Tile',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Fills the tile edge to edge. Use the hotspot to set what stays in frame when cropped.',
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
    select: {media: 'image', alt: 'image.alt'},
    prepare({media, alt}) {
      return {title: alt || 'Image Tile', subtitle: 'Photo', media}
    },
  },
})

export const mosaicGridBlock = defineType({
  name: 'mosaicGridBlock',
  title: 'Mosaic Grid',
  type: 'object',
  icon: ThLargeIcon,
  groups: [
    {name: 'section', title: 'Section'},
    {name: 'rows', title: 'Rows'},
  ],
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      description: 'Used for anchor navigation (e.g., "highlights")',
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
      description: 'Sits behind the heading. The mosaic itself is full bleed and covers it.',
      group: 'section',
    }),
    defineField({
      name: 'sectionLabel',
      title: 'Section Label',
      type: 'string',
      description: 'Optional gold uppercase eyebrow above the heading',
      group: 'section',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Optional heading. Leave blank for a mosaic with no heading.',
      group: 'section',
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      group: 'rows',
      description: 'Each row holds 2 or 3 tiles of equal width.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'mosaicRow',
          title: 'Row',
          fields: [
            defineField({
              name: 'tiles',
              title: 'Tiles',
              type: 'array',
              description:
                'Add 2 or 3 tiles. Their width is split evenly across the row, so a row is never left with a gap.',
              of: [textTile, imageTile],
              validation: (Rule) => Rule.required().min(2).max(3),
            }),
          ],
          preview: {
            select: {tiles: 'tiles'},
            prepare({tiles}) {
              const list: Array<{_type?: string; title?: string; body?: string}> = tiles || []
              const summary = list
                .map((tile) =>
                  tile._type === 'imageTile' ? 'Photo' : tile.title || tile.body || 'Text',
                )
                .join('  ·  ')
              return {
                title: `${list.length} tile${list.length === 1 ? '' : 's'}`,
                subtitle: summary || 'Empty row',
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', rows: 'rows'},
    prepare({title, rows}) {
      const rowCount = rows?.length || 0
      const tileCount = (rows || []).reduce(
        (total: number, row: {tiles?: unknown[]}) => total + (row.tiles?.length || 0),
        0,
      )
      return {
        title: title || 'Mosaic Grid',
        subtitle: `${rowCount} row${rowCount === 1 ? '' : 's'} · ${tileCount} tiles`,
      }
    },
  },
})
