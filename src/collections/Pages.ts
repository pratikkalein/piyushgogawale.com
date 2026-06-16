import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { slugField } from '../fields/slug'
import { revalidatePages, revalidatePagesDelete } from '../hooks/revalidate'

export const Pages: CollectionConfig = {
  slug: 'pages',
  hooks: {
    afterChange: [revalidatePages],
    afterDelete: [revalidatePagesDelete],
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    description: 'Standalone pages such as About, reachable at /[slug].',
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
      name: 'lede',
      type: 'textarea',
      admin: {
        description:
          'Optional opening statement shown large beneath the title (used by the About page layout).',
      },
    },
    {
      name: 'portrait',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Optional portrait / lead image, shown alongside the text on the About page layout.',
      },
    },
    {
      name: 'content',
      type: 'richText',
    },
  ],
}
