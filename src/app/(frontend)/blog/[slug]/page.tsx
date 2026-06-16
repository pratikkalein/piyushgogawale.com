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
    <article className="mx-auto max-w-[760px] px-6 py-20 lg:py-28">
      <header>
        <p className="label-caps text-steel">{formatDate(post.date)}</p>
        <h1 className="mt-4 font-display text-[clamp(2.25rem,1.5rem+3vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-ink">
          {post.title}
        </h1>
      </header>

      {coverUrl && (
        <div className="relative mt-10 aspect-[3/2] w-full overflow-hidden bg-surface">
          <Image
            src={coverUrl}
            alt={mediaAlt(post.cover) || post.title}
            fill
            sizes="760px"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="prose-editorial mt-12">
        {post.body && <RichText data={post.body as unknown as SerializedEditorState} />}
      </div>
    </article>
  )
}
