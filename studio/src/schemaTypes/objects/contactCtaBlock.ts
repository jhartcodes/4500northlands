import {defineField, defineType} from 'sanity'
import {EnvelopeIcon} from '@sanity/icons'

/**
 * Contact CTA Block
 * Call-to-action section with email contact button
 */
export const contactCtaBlock = defineType({
  name: 'contactCtaBlock',
  title: 'Contact CTA',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      description: 'Used for anchor navigation (e.g., "contact")',
      initialValue: 'contact',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Main heading text',
      initialValue: 'Get In Touch!',
    }),
    defineField({
      name: 'subtext',
      title: 'Subtext',
      type: 'string',
      description: 'Supporting text below the heading',
      initialValue: 'If you have questions, or would like more information',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      description: 'Email address for the contact button',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'buttonLabel',
      title: 'Button Label',
      type: 'string',
      description: 'Text for the contact button',
      initialValue: 'Contact Us',
    }),
    defineField({
      name: 'background',
      title: 'Background Style',
      type: 'string',
      options: {
        list: [
          {title: 'Navy', value: 'navy'},
          {title: 'Forest', value: 'forest'},
          {title: 'Image', value: 'image'},
        ],
        layout: 'radio',
      },
      initialValue: 'navy',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      description: 'Background image (only used when background style is "Image")',
      options: {hotspot: true},
      hidden: ({parent}) => parent?.background !== 'image',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      email: 'contactEmail',
    },
    prepare({title, email}) {
      return {
        title: title || 'Contact CTA',
        subtitle: email || 'No email set',
        media: EnvelopeIcon,
      }
    },
  },
})
