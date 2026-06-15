import type { Access } from 'payload'

/** Anyone, authenticated or not, may read. */
export const anyone: Access = () => true

/** Only authenticated users (the seeded owner) may perform the action. */
export const authenticated: Access = ({ req: { user } }) => Boolean(user)

/** Nobody can do this over the public API; only admin (authenticated) users. */
export const adminOnly: Access = ({ req: { user } }) => Boolean(user)

/**
 * Public reads are limited to published blog entries. Authenticated users
 * see everything (drafts included).
 */
export const publishedOrAuthenticated: Access = ({ req: { user } }) => {
  if (user) return true
  return {
    status: {
      equals: 'published',
    },
  }
}
