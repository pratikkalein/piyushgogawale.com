import type { CollectionConfig } from 'payload'

import { adminOnly } from '../access'

/**
 * Contact form entries. All public access is denied: the /api/contact route
 * writes here server-side via the Payload local API (which bypasses access
 * control), so no public create access is needed or granted.
 */
export const Submissions: CollectionConfig = {
  slug: 'submissions',
  labels: {
    singular: 'Submission',
    plural: 'Submissions',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'date'],
    description: 'Messages sent through the contact form.',
  },
  access: {
    create: adminOnly,
    read: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'text',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
  ],
}
