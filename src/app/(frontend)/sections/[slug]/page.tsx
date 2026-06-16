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
    <article className="mx-auto max-w-[1600px] px-6 py-20 lg:px-16 lg:py-28">
      <header className="mb-14 border-b border-hairline pb-10">
        <p className="label-caps text-steel">
          Gallery · {photos.length} {photos.length === 1 ? 'Frame' : 'Frames'}
        </p>
        <h1 className="hero-display mt-5 max-w-[16ch] text-ink">{section.title}</h1>
        {section.intro && (
          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-slate">{section.intro}</p>
        )}
      </header>

      <Gallery photos={photos} />
    </article>
  )
}
