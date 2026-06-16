import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { getPayloadClient } from '@/lib/payload'
import { mediaAlt, mediaSizeUrl, mediaUrl } from '@/lib/media'
import { Reveal } from '@/components/Reveal'

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

  const count = result.docs.length

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-24 lg:px-16 lg:py-32">
      <div className="flex items-end justify-between gap-6 border-b border-hairline-strong pb-6">
        <h1 className="headline text-ink">Journal</h1>
        <span className="label-caps shrink-0 pb-1 text-steel">
          {count} {count === 1 ? 'Entry' : 'Entries'}
        </span>
      </div>

      {count === 0 ? (
        <p className="mt-12 text-steel">No posts published yet.</p>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {result.docs.map((post, i) => {
            const coverUrl = mediaSizeUrl(post.cover, 'card') ?? mediaUrl(post.cover)
            return (
              <Reveal key={post.id} index={i % 3}>
              <Link href={`/blog/${post.slug}`} className="group flex flex-col">
                <div className="relative aspect-[3/2] w-full overflow-hidden bg-surface">
                  {coverUrl && (
                    <Image
                      src={coverUrl}
                      alt={mediaAlt(post.cover) || post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="img-zoom object-cover"
                    />
                  )}
                </div>
                <p className="label-caps mt-5 text-steel">{formatDate(post.date)}</p>
                <h2 className="mt-3 font-display text-[24px] leading-snug text-ink">{post.title}</h2>
              </Link>
              </Reveal>
            )
          })}
        </div>
      )}
    </section>
  )
}
