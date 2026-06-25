import {defineField, defineType, defineArrayMember} from 'sanity'
import {ActivityIcon} from '@sanity/icons'
import {portableTextEditor} from './portableText'

/**
 * CAC Steps Block
 * Section id="cac"
 */
export const cacCalculationBlock = defineType({
  name: 'cacCalculationBlock',
  title: 'CAC Steps',
  type: 'object',
  icon: ActivityIcon,
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      description: 'Used for anchor navigation (e.g., "cac")',
      initialValue: 'cac',
    }),
    defineField({
      name: 'stepsTitle',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
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
    }),
    defineField({
      name: 'formulaResidentialSub',
      title: 'Formula Residential Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'formulaHotelLabel',
      title: 'Formula Hotel Label',
      type: 'string',
    }),
    defineField({
      name: 'formulaHotelSub',
      title: 'Formula Hotel Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'formulaResultLabel',
      title: 'Formula Result Label',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'stepsTitle',
    },
    prepare({title}) {
      return {
        title: title || 'CAC Steps',
        subtitle: 'CAC Steps',
      }
    },
  },
})
