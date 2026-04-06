import {defineField, defineType, defineArrayMember} from 'sanity'
import {SplitHorizontalIcon} from '@sanity/icons'
import {portableTextEditor} from './portableText'

/**
 * Image + Text Block — "The Path Forward" style
 * Used for: The Path Forward, Where We Are Today, Current Status, Community Impact
 * Most reusable block on the site.
 */
export const imageTextBlock = defineType({
  name: 'imageTextBlock',
  title: 'Image + Text',
  type: 'object',
  icon: SplitHorizontalIcon,
  groups: [
    {name: 'layout', title: 'Layout'},
    {name: 'intro', title: 'Intro (Optional)'},
    {name: 'content', title: 'Content'},
    {name: 'didYouKnow', title: 'Did You Know Card'},
  ],
  fields: [
    // Section ID
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      description: 'Used for anchor navigation',
      group: 'layout',
    }),

    // Layout config
    defineField({
      name: 'imagePosition',
      title: 'Image Position',
      type: 'string',
      options: {
        list: [
          {title: 'Left — image left, text right', value: 'left'},
          {title: 'Right — text left, image right', value: 'right'},
        ],
        layout: 'radio',
      },
      initialValue: 'left',
      group: 'layout',
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
      group: 'layout',
    }),

    // Optional Intro Section
    defineField({
      name: 'intro',
      title: 'Intro Section',
      type: 'object',
      description: 'Optional intro text displayed above the image/text grid',
      group: 'intro',
      fields: [
        defineField({
          name: 'sectionId',
          title: 'Section ID',
          type: 'string',
          description: 'Used for anchor navigation to the intro',
        }),
        defineField({
          name: 'sectionLabel',
          title: 'Section Label',
          type: 'string',
          description: 'Gold uppercase label',
        }),
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          description: 'Intro heading',
        }),
        defineField({
          name: 'showDivider',
          title: 'Show Divider',
          type: 'boolean',
          description: 'Gold line under title',
          initialValue: true,
        }),
        defineField({
          name: 'body',
          title: 'Body',
          type: 'array',
          of: portableTextEditor,
          description: 'Intro text content',
        }),
      ],
    }),

    // Image
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      group: 'content',
    }),

    // Text side
    defineField({
      name: 'sectionLabel',
      title: 'Section Label',
      type: 'string',
      description: 'Gold uppercase label (e.g. "The Path Forward")',
      group: 'content',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Section heading',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'showDivider',
      title: 'Show Divider',
      type: 'boolean',
      description: 'Gold line under title',
      initialValue: true,
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: portableTextEditor,
      description:
        'Full rich text. Callout Box → left-border panel. Large Statement → big OCP line.',
      group: 'content',
    }),
    defineField({
      name: 'buttons',
      title: 'Buttons',
      type: 'array',
      of: [defineArrayMember({type: 'button'})],
      description: 'Up to 3 buttons',
      validation: (Rule) => Rule.max(3),
      group: 'content',
    }),

    // Embedded DYK card (optional)
    defineField({
      name: 'didYouKnowCard',
      title: 'Did You Know Card (optional)',
      type: 'object',
      description: 'Renders a DYK card below the image/text grid. Leave blank to hide.',
      group: 'didYouKnow',
      fields: [
        defineField({
          name: 'icon',
          title: 'Icon',
          type: 'string',
          description: 'Select an icon to display',
          options: {
            list: [
              {title: 'Home', value: 'home'},
              {title: 'Racquet', value: 'racquet'},
              {title: 'Health', value: 'health'},
              {title: 'Money', value: 'money'},
              {title: 'Tree', value: 'tree'},
              {title: 'Community', value: 'community'},
              {title: 'Child', value: 'child'},
              {title: 'Computer', value: 'computer'},
              {title: 'Connector', value: 'connector'},
              {title: 'Art', value: 'art'},
              {title: 'Steps', value: 'steps'},
              {title: 'Traffic Light', value: 'traffic-light'},
              {title: 'Barrier', value: 'barrier'},
              {title: 'Investment', value: 'investment'},
              {title: 'Food', value: 'food'},
              {title: 'Accessibility', value: 'accessibility'},
              {title: 'Calculator', value: 'calculator'},
              {title: 'Bed', value: 'bed'},
              {title: 'Checkmark', value: 'checkmark'},
              {title: 'Gap', value: 'gap'},
              {title: 'Question Mark', value: 'question-mark'},
              {title: 'Tennis Racquet', value: 'tennis-racquet'},
              {title: 'Tennis Ball', value: 'tennis-ball'},
              {title: 'Cash', value: 'cash'},
            ],
          },
        }),
        defineField({
          name: 'eyebrow',
          title: 'Eyebrow',
          type: 'string',
          initialValue: 'Did You Know?',
        }),
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
        }),
        defineField({
          name: 'body',
          title: 'Body',
          type: 'array',
          of: portableTextEditor,
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'sectionLabel',
      media: 'image',
    },
    prepare({title, subtitle, media}) {
      return {
        title: title || 'Image + Text Block',
        subtitle: subtitle || 'Image + Text',
        media,
      }
    },
  },
})
