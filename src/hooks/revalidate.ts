import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

/**
 * On-demand revalidation. Calling revalidatePath inside Payload hooks lets new
 * CMS content appear on the public site without a redeploy. The dynamic import
 * + try/catch keeps the Payload CLI (migrations) working outside Next's runtime.
 */
const revalidate = async (paths: string[]) => {
  try {
    const { revalidatePath } = await import('next/cache')
    for (const p of paths) revalidatePath(p)
  } catch {
    // Not running inside the Next.js request context (e.g. CLI) — ignore.
  }
}

export const revalidateSections: CollectionAfterChangeHook = async ({ doc }) => {
  await revalidate(['/', `/sections/${doc?.slug}`])
  return doc
}
export const revalidateSectionsDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  await revalidate(['/', `/sections/${doc?.slug}`])
  return doc
}

export const revalidatePages: CollectionAfterChangeHook = async ({ doc }) => {
  await revalidate([`/${doc?.slug}`])
  return doc
}
export const revalidatePagesDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  await revalidate([`/${doc?.slug}`])
  return doc
}

export const revalidateBlog: CollectionAfterChangeHook = async ({ doc }) => {
  await revalidate(['/blog', `/blog/${doc?.slug}`])
  return doc
}
export const revalidateBlogDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  await revalidate(['/blog', `/blog/${doc?.slug}`])
  return doc
}

export const revalidateSettings: GlobalAfterChangeHook = async ({ doc }) => {
  await revalidate(['/'])
  return doc
}
