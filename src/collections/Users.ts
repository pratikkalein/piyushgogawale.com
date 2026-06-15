import type { CollectionConfig } from 'payload'

import { authenticated } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  access: {
    // Only authenticated users may manage users. No public self-registration:
    // the owner account is seeded via the first-user screen, then this locks down.
    create: authenticated,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
    admin: ({ req: { user } }) => Boolean(user),
  },
  auth: {
    // Throttle brute-force login attempts.
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000, // 10 minutes
    tokenExpiration: 7 * 24 * 60 * 60, // 7 days
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
      // httpOnly is always enabled for Payload auth cookies.
    },
  },
  fields: [
    // Email + password are added by the auth config.
  ],
  versions: false,
}
