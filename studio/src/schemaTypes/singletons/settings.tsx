import {CogIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Settings schema Singleton. Global site configuration.
 * Learn more: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
 */

export const settings = defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
      rows: 3,
      description: 'Used for SEO and social sharing',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'ogImage',
      title: 'Default Social Image',
      type: 'image',
      description: 'Displayed on social cards and search engine results.',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          description: 'Important for accessibility and SEO.',
        }),
      ],
    }),
    defineField({
      name: 'privacyPolicyUrl',
      title: 'Privacy Policy URL',
      type: 'url',
      description: 'Link to the privacy policy page',
      initialValue: 'https://www.beedie.ca/legal-privacy/',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
        media: CogIcon,
      }
    },
  },
})
