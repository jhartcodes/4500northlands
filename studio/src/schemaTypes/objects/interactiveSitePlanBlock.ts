import {defineField, defineType, defineArrayMember} from 'sanity'
import {PinIcon} from '@sanity/icons'
import {portableTextEditor} from './portableText'

export const interactiveSitePlanBlock = defineType({
  name: 'interactiveSitePlanBlock',
  title: 'Interactive Site Plan',
  type: 'object',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      description: 'Used for anchor navigation (e.g., "site-plan")',
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
        ],
        layout: 'radio',
      },
      initialValue: 'white',
    }),
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'Optional heading above the map(s)',
    }),
    defineField({
      name: 'body',
      title: 'Intro Text',
      type: 'array',
      of: portableTextEditor,
      description: 'Optional rich text shown below the title and above the maps',
    }),
    defineField({
      name: 'maps',
      title: 'Maps',
      type: 'array',
      description: 'Select which site plan maps to display and in what order',
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'mapEntry',
          title: 'Map',
          fields: [
            defineField({
              name: 'mapTitle',
              title: 'Map Title',
              type: 'string',
              description: 'Eyebrow label shown above this map in gold uppercase text',
            }),
            defineField({
              name: 'mapId',
              title: 'Map',
              type: 'string',
              options: {
                list: [
                  {title: 'Full Site', value: 'fullsite'},
                  {title: 'Lower Meadow', value: 'lowermeadow'},
                  {title: 'Upper Meadow', value: 'uppermeadow'},
                ],
                layout: 'radio',
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'pdfUrl',
              title: 'PDF Download Link',
              type: 'url',
              description: 'Optional link to download the full-resolution PDF of this map',
            }),
            defineField({
              name: 'hotspots',
              title: 'Hotspot Labels',
              type: 'array',
              description: 'Edit the number, title and description shown for each marker. Positions are set by the dev team.',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'hotspot',
                  title: 'Hotspot',
                  fields: [
                    defineField({
                      name: 'number',
                      title: 'Number',
                      type: 'number',
                      description: 'Must match the marker number on the map (1–9)',
                      validation: (Rule) => Rule.required().min(1).max(9).integer(),
                    }),
                    defineField({
                      name: 'label',
                      title: 'Title',
                      type: 'string',
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: 'description',
                      title: 'Description',
                      type: 'text',
                      rows: 3,
                    }),
                  ],
                  preview: {
                    select: {number: 'number', label: 'label'},
                    prepare({number, label}) {
                      return {title: `${number}. ${label}`}
                    },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {mapId: 'mapId', mapTitle: 'mapTitle'},
            prepare({mapId, mapTitle}) {
              const labels: Record<string, string> = {
                fullsite: 'Full Site',
                lowermeadow: 'Lower Meadow',
                uppermeadow: 'Upper Meadow',
              }
              const base = labels[mapId] ?? mapId
              return {title: mapTitle ? `${mapTitle} — ${base}` : base}
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {
        title: title || 'Interactive Site Plan',
        subtitle: 'Interactive Site Plan Block',
      }
    },
  },
})
