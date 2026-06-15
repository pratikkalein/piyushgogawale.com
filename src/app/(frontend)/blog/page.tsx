import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { getPayloadClient } from '@/lib/payload'
import { mediaAlt, mediaSizeUrl, mediaUrl } from '@/lib/media'

export const revalidate = 60

const formatDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''

export default async function BlogIndex() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'blog',
    where: { status: { equals: 'published' } },
    sort: '-date',
    depth: 1,
    limit: 50,
  })

  return (
    <section className="mx-auto max-w-[1280px] px-6 py-16 lg:px-8 lg:py-24">
      <div className="mb-12">
        <p className="text-xs font-semibold uppercase tracking-[1px] text-primary">Journal</p>
        <h1 className="mt-2 font-display text-[52px] leading-tight text-ink">Blog</h1>
      </div>

      {result.docs.length === 0 ? (
        <p className="text-steel">No posts published yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {result.docs.map((post) => {
            const coverUrl = mediaSizeUrl(post.cover, 'card') ?? mediaUrl(post.cover)
            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-lg border border-hairline-soft bg-canvas transition-shadow hover:shadow-[var(--shadow-card)]"
              >
                <div className="relative aspect-[3/2] w-full overflow-hidden bg-surface">
                  {coverUrl && (
                    <Image
                      src={coverUrl}
                      alt={mediaAlt(post.cover) || post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-[22px] font-medium leading-snug text-ink">{post.title}</h2>
                  <p className="mt-2 text-[13px] text-steel">{formatDate(post.date)}</p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}
