import type { Media } from '@/payload-types'

export type MediaRef = number | Media | null | undefined

/** Resolve a media relationship to its primary public URL (or null). */
export const mediaUrl = (m: MediaRef): string | null => {
  if (!m || typeof m === 'number') return null
  return m.url ?? null
}

/** Resolve a specific generated size URL, falling back to the original. */
export const mediaSizeUrl = (m: MediaRef, size: 'thumb' | 'card' | 'full'): string | null => {
  if (!m || typeof m === 'number') return null
  return m.sizes?.[size]?.url ?? m.url ?? null
}

export const mediaAlt = (m: MediaRef): string => {
  if (!m || typeof m === 'number') return ''
  return m.alt ?? ''
}

export const mediaDimensions = (m: MediaRef): { width: number; height: number } => {
  if (!m || typeof m === 'number') return { width: 1600, height: 1067 }
  return { width: m.width ?? 1600, height: m.height ?? 1067 }
}
