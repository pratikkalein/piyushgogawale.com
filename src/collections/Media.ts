import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alt text',
      admin: {
        description: 'Describe the photo for accessibility and SEO.',
      },
    },
  ],
  upload: {
    // Image MIME types only (file-size cap is enforced globally in payload.config.ts).
    mimeTypes: ['image/*'],
    focalPoint: true,
    adminThumbnail: 'thumb',
    imageSizes: [
      { name: 'thumb', width: 400, position: 'centre' },
      { name: 'card', width: 1024, position: 'centre' },
      { name: 'full', width: 2000, position: 'centre' },
    ],
  },
}
