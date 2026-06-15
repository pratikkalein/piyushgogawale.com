import Image from 'next/image'
import { notFound } from 'next/navigation'
import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { getPayloadClient } from '@/lib/payload'
import { mediaAlt, mediaSizeUrl, mediaUrl } from '@/lib/media'

export const revalidate = 60

const formatDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'blog',
    where: { and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }] },
    depth: 1,
    limit: 1,
  })

  const post = result.docs[0]
  if (!post) notFound()

  const coverUrl = mediaSizeUrl(post.cover, 'full') ?? mediaUrl(post.cover)

  return (
    <article className="mx-auto max-w-[720px] px-6 py-16 lg:py-24">
      <header>
        <p className="text-[13px] text-steel">{formatDate(post.date)}</p>
        <h1 className="mt-2 font-display text-[52px] leading-tight text-ink">{post.title}</h1>
      </header>

      {coverUrl && (
        <div className="relative mt-8 aspect-[3/2] w-full overflow-hidden rounded-lg shadow-[var(--shadow-image)]">
          <Image
            src={coverUrl}
            alt={mediaAlt(post.cover) || post.title}
            fill
            sizes="720px"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="prose-editorial mt-10">
        {post.body && <RichText data={post.body as unknown as SerializedEditorState} />}
      </div>
    </article>
  )
}
