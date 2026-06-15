import type { Field, FieldHook } from 'payload'

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * Auto-generates a slug from the `from` field when the slug is left empty,
 * and normalises any slug the editor types by hand.
 */
const formatSlugHook =
  (fallbackFrom: string): FieldHook =>
  ({ data, operation, originalDoc, value }) => {
    if (typeof value === 'string' && value.length > 0) {
      return slugify(value)
    }

    if (operation === 'create' || !originalDoc?.slug) {
      const fallbackData = data?.[fallbackFrom] ?? originalDoc?.[fallbackFrom]
      if (typeof fallbackData === 'string' && fallbackData.length > 0) {
        return slugify(fallbackData)
      }
    }

    return value
  }

/**
 * A reusable, unique, auto-generated slug field. Pass the source field name
 * (e.g. 'title') to derive the slug from it.
 */
export const slugField = (from = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  index: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: 'Auto-generated from the title. Leave blank to generate; edit to override.',
  },
  hooks: {
    beforeValidate: [formatSlugHook(from)],
  },
})
