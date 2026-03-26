import {defineField, defineType} from 'sanity'
import {BulbOutlineIcon} from '@sanity/icons'
import {portableTextEditor} from './portableText'

/**
 * Did You Know Card — single or two-column layout
 * Standalone version of the DYK card component.
 */
export const didYouKnowBlock = defineType({
  name: 'didYouKnowBlock',
  title: 'Did You Know Card',
  type: 'object',
  icon: BulbOutlineIcon,
  groups: [
    {name: 'layout', title: 'Layout'},
    {name: 'leftCard', title: 'Card (or Left Card)'},
    {name: 'rightCard', title: 'Right Card (Two-Column Only)'},
  ],
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      description: 'Used for anchor navigation',
      group: 'layout',
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Single', value: 'single'},
          {title: 'Two Column', value: 'twoColumn'},
        ],
        layout: 'radio',
      },
      initialValue: 'single',
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

    // Card (or left card)
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Select an icon to display',
      group: 'leftCard',
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
      group: 'leftCard',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Card heading',
      validation: (Rule) => Rule.required(),
      group: 'leftCard',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: portableTextEditor,
      group: 'leftCard',
    }),

    // Right card (two-column only)
    defineField({
      name: 'rightIcon',
      title: 'Right Card Icon',
      type: 'string',
      description: 'Select an icon to display',
      group: 'rightCard',
      hidden: ({parent}) => parent?.layout !== 'twoColumn',
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
      name: 'rightEyebrow',
      title: 'Right Card Eyebrow',
      type: 'string',
      initialValue: 'Did You Know?',
      group: 'rightCard',
      hidden: ({parent}) => parent?.layout !== 'twoColumn',
    }),
    defineField({
      name: 'rightTitle',
      title: 'Right Card Title',
      type: 'string',
      description: 'Card heading',
      group: 'rightCard',
      hidden: ({parent}) => parent?.layout !== 'twoColumn',
    }),
    defineField({
      name: 'rightBody',
      title: 'Right Card Body',
      type: 'array',
      of: portableTextEditor,
      group: 'rightCard',
      hidden: ({parent}) => parent?.layout !== 'twoColumn',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      layout: 'layout',
    },
    prepare({title, layout}) {
      return {
        title: title || 'Did You Know',
        subtitle: layout === 'twoColumn' ? 'Two Column Layout' : 'Single Card',
      }
    },
  },
})
