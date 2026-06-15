import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { slugField } from '../fields/slug'
import { revalidateSections, revalidateSectionsDelete } from '../hooks/revalidate'

export const Sections: CollectionConfig = {
  slug: 'sections',
  hooks: {
    afterChange: [revalidateSections],
    afterDelete: [revalidateSectionsDelete],
  },
  labels: {
    singular: 'Section',
    plural: 'Sections',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'featured', 'order', 'updatedAt'],
    description: 'Gallery sections. Tick "featured" to show a section in the home carousel.',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField('title'),
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'The cover image shown in the home carousel and the section index.',
      },
    },
    {
      name: 'intro',
      type: 'textarea',
      admin: {
        description: 'A short introduction shown at the top of the gallery.',
      },
    },
    {
      name: 'photos',
      type: 'array',
      label: 'Photos',
      labels: { singular: 'Photo', plural: 'Photos' },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show this section in the home page carousel.',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first in the carousel and section index.',
      },
    },
  ],
}
