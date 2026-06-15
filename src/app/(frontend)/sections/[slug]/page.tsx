import { notFound } from 'next/navigation'
import React from 'react'

import { getPayloadClient } from '@/lib/payload'
import { mediaAlt, mediaDimensions, mediaSizeUrl, mediaUrl } from '@/lib/media'
import { Gallery, type Photo } from '@/components/Gallery'

export const revalidate = 60

export default async function SectionPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'sections',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })

  const section = result.docs[0]
  if (!section) notFound()

  const photos: Photo[] = (section.photos ?? [])
    .map((row) => {
      const img = row.image
      const url = mediaSizeUrl(img, 'full') ?? mediaUrl(img)
      const thumbUrl = mediaSizeUrl(img, 'card') ?? url
      if (!url || !thumbUrl) return null
      const { width, height } = mediaDimensions(img)
      return { url, thumbUrl, alt: mediaAlt(img), width, height }
    })
    .filter((p): p is Photo => p !== null)

  return (
    <article className="mx-auto max-w-[1280px] px-6 py-16 lg:px-8 lg:py-24">
      <header className="mb-12 max-w-2xl">
        <h1 className="font-display text-[52px] leading-tight text-ink lg:text-[64px]">
          {section.title}
        </h1>
        {section.intro && <p className="mt-4 text-lg leading-relaxed text-slate">{section.intro}</p>}
      </header>

      <Gallery photos={photos} />
    </article>
  )
}
