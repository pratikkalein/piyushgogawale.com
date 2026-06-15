import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { revalidateSettings } from '../hooks/revalidate'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Site settings',
  access: {
    read: anyone,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidateSettings],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Piyush Gogawale',
      admin: { description: 'Site wordmark shown in the nav and footer.' },
    },
    {
      name: 'nav',
      type: 'array',
      label: 'Navigation links',
      labels: { singular: 'Link', plural: 'Links' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    {
      name: 'social',
      type: 'array',
      label: 'Social links',
      labels: { singular: 'Link', plural: 'Links' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
}
