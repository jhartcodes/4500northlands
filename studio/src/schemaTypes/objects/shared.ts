import {defineField} from 'sanity'

/**
 * Section background colour — shared across blocks that support background switching.
 */
export const sectionBackgroundField = defineField({
  name: 'background',
  title: 'Section background',
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
})

/**
 * Image position (left / right) — shared across blocks with image+text layouts.
 */
export const imagePositionField = defineField({
  name: 'imagePosition',
  title: 'Image position',
  type: 'string',
  options: {
    list: [
      {title: 'Left — image left, text right', value: 'left'},
      {title: 'Right — text left, image right', value: 'right'},
    ],
    layout: 'radio',
  },
  initialValue: 'left',
})
