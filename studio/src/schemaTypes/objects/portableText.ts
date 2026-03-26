import {defineArrayMember} from 'sanity'

/**
 * Shared Portable Text definition — import this into any block that needs
 * a rich-text editor. Contains every mark, decorator, style and inline type
 * used across the 4500 Northlands site.
 */
export const portableTextEditor = [
  defineArrayMember({
    type: 'block',

    // Paragraph styles
    styles: [
      {title: 'Normal', value: 'normal'},
      {title: 'Heading 2', value: 'h2'},
      {title: 'Heading 3', value: 'h3'},
      {title: 'Heading 4', value: 'h4'},
      {title: 'Quote', value: 'blockquote'},
      // Maps to the big green OCP-style "This is permitted by..." line
      {title: 'Large Statement', value: 'largeStatement'},
      // Maps to .path-rezoning left-bordered callout box
      {title: 'Callout Box', value: 'calloutBox'},
      // Maps to small gold uppercase section label
      {title: 'Section Label', value: 'sectionLabel'},
    ],

    // Inline marks
    marks: {
      decorators: [
        {title: 'Bold', value: 'strong'},
        {title: 'Italic', value: 'em'},
        {title: 'Underline', value: 'underline'},
        // Renders text in --gold colour
        {title: 'Gold accent', value: 'goldAccent'},
        // Renders text in --forest colour
        {title: 'Forest accent', value: 'forestAccent'},
        // Renders text in --navy colour
        {title: 'Navy accent', value: 'navyAccent'},
      ],
      annotations: [
        {
          name: 'link',
          type: 'object',
          title: 'Link',
          fields: [
            {
              name: 'href',
              type: 'url',
              title: 'URL',
              validation: (Rule) =>
                Rule.uri({allowRelative: true, scheme: ['https', 'http', 'mailto', 'tel']}),
            },
            {
              name: 'openInNewTab',
              type: 'boolean',
              title: 'Open in new tab',
              initialValue: false,
            },
          ],
        },
      ],
    },

    // List types
    lists: [
      {title: 'Bullet list', value: 'bullet'},
      {title: 'Numbered list', value: 'number'},
      // Renders with the → gold arrow prefix (.benefit-list style)
      {title: 'Arrow list (→)', value: 'arrowList'},
      // Renders with — em-dash prefix (.alt-content-body li style)
      {title: 'Dash list (—)', value: 'dashList'},
    ],
  }),

  // Inline image block
  defineArrayMember({
    type: 'image',
    title: 'Image',
    options: {hotspot: true},
    fields: [
      {
        name: 'alt',
        type: 'string',
        title: 'Alt text',
        validation: (Rule) => Rule.required(),
      },
      {
        name: 'caption',
        type: 'string',
        title: 'Caption (optional)',
      },
    ],
  }),
]
