import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons'

/**
 * Button object — used in heroBlock, imageTextBlock, rezoningBlock, etc.
 */
export const button = defineType({
  name: 'button',
  title: 'Button',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Button label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({allowRelative: true, scheme: ['https', 'http', 'mailto', 'tel']}),
    }),
    defineField({
      name: 'variant',
      title: 'Button style',
      type: 'string',
      options: {
        list: [
          {title: 'Primary — gold, clipped corner', value: 'primary'},
          {title: 'Forest green — clipped corner', value: 'forest'},
          {title: 'Outline white (for dark backgrounds)', value: 'outlineWhite'},
          {title: 'Outline dark (for light backgrounds)', value: 'outlineDark'},
        ],
        layout: 'radio',
      },
      initialValue: 'forest',
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'variant',
    },
  },
})

export default button
