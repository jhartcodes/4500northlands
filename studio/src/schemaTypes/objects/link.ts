import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons'

type LinkParent = {
  linkType?: 'href' | 'anchor' | 'page'
  href?: string
  anchor?: string
  page?: {_ref: string}
}

/**
 * Link schema object. This link object lets the user select the type of link:
 * URL, anchor (scroll to section), or page reference.
 * Learn more: https://www.sanity.io/docs/studio/object-type
 */

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      initialValue: 'href',
      options: {
        list: [
          {title: 'URL', value: 'href'},
          {title: 'Anchor (scroll to section)', value: 'anchor'},
          {title: 'Page', value: 'page'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({
          allowRelative: true,
          scheme: ['http', 'https', 'mailto', 'tel'],
        }).custom((value, context) => {
          const parent = context.parent as LinkParent
          if (parent?.linkType === 'href' && !value) {
            return 'URL is required when Link Type is URL'
          }
          return true
        }),
      hidden: ({parent}) => parent?.linkType !== 'href',
    }),
    defineField({
      name: 'anchor',
      title: 'Section ID',
      type: 'string',
      description: 'The section ID to scroll to (e.g., "economic-impact", "faq")',
      hidden: ({parent}) => parent?.linkType !== 'anchor',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as LinkParent
          if (parent?.linkType === 'anchor' && !value) {
            return 'Section ID is required for anchor links'
          }
          return true
        }),
    }),
    defineField({
      name: 'page',
      title: 'Page',
      type: 'reference',
      to: [{type: 'page'}],
      hidden: ({parent}) => parent?.linkType !== 'page',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as LinkParent
          if (parent?.linkType === 'page' && !value) {
            return 'Page reference is required when Link Type is Page'
          }
          return true
        }),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
      hidden: ({parent}) => parent?.linkType === 'anchor',
    }),
  ],
})
