import {defineField, defineType, defineArrayMember} from 'sanity'
import {ActivityIcon} from '@sanity/icons'
import {portableTextEditor} from './portableText'

/**
 * CAC 101 — Calculation Steps Block
 * Section id="cac"
 */
export const cacCalculationBlock = defineType({
  name: 'cacCalculationBlock',
  title: 'CAC 101 — Calculation Steps',
  type: 'object',
  icon: ActivityIcon,
  groups: [
    {name: 'intro', title: 'Intro'},
    {name: 'steps', title: 'Steps'},
    {name: 'formula', title: 'Formula Visual'},
  ],
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      description: 'Used for anchor navigation (e.g., "cac")',
      initialValue: 'cac',
      group: 'intro',
    }),
    defineField({
      name: 'badgeText',
      title: 'Badge Text',
      type: 'string',
      description: 'Gold badge, e.g. "CAC 101"',
      initialValue: 'CAC 101',
      group: 'intro',
    }),
    defineField({
      name: 'sectionLabel',
      title: 'Section Label',
      type: 'string',
      group: 'intro',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'intro',
    }),
    defineField({
      name: 'showDivider',
      title: 'Show Divider',
      type: 'boolean',
      initialValue: true,
      group: 'intro',
    }),
    defineField({
      name: 'introBody',
      title: 'Intro Body',
      type: 'array',
      of: portableTextEditor,
      description: 'Left/text side intro content',
      group: 'intro',
    }),
    defineField({
      name: 'introImage',
      title: 'Intro Image',
      type: 'image',
      description: 'Right side intro image',
      options: {hotspot: true},
      group: 'intro',
    }),
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
      initialValue: 'right',
      group: 'intro',
    }),

    // 4-step calculation
    defineField({
      name: 'stepsTitle',
      title: 'Steps Title',
      type: 'string',
      description: 'Heading above the steps grid',
      group: 'steps',
    }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      group: 'steps',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'step',
          title: 'Step',
          fields: [
            defineField({
              name: 'stepLabel',
              title: 'Step Label',
              type: 'string',
              description: 'e.g. "Step One"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'array',
              of: portableTextEditor,
              description: 'Step description — bold key phrases',
            }),
          ],
          preview: {
            select: {
              title: 'stepLabel',
            },
          },
        }),
      ],
    }),

    // Formula visual labels
    defineField({
      name: 'formulaResidentialLabel',
      title: 'Formula Residential Label',
      type: 'string',
      group: 'formula',
    }),
    defineField({
      name: 'formulaResidentialSub',
      title: 'Formula Residential Subtitle',
      type: 'string',
      group: 'formula',
    }),
    defineField({
      name: 'formulaHotelLabel',
      title: 'Formula Hotel Label',
      type: 'string',
      group: 'formula',
    }),
    defineField({
      name: 'formulaHotelSub',
      title: 'Formula Hotel Subtitle',
      type: 'string',
      group: 'formula',
    }),
    defineField({
      name: 'formulaResultLabel',
      title: 'Formula Result Label',
      type: 'string',
      group: 'formula',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      badge: 'badgeText',
      media: 'introImage',
    },
    prepare({title, badge, media}) {
      return {
        title: title || 'CAC Calculation Block',
        subtitle: badge || 'CAC 101',
        media,
      }
    },
  },
})
