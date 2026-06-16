import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { getPayloadClient } from '@/lib/payload'
import { mediaAlt, mediaDimensions, mediaSizeUrl, mediaUrl } from '@/lib/media'

export const revalidate = 60

export const metadata = {
  title: 'About — Piyush Gogawale',
  description: 'About the photographer.',
}

export default async function AboutPage() {
  const payload = await getPayloadClient()

  const [result, settings] = await Promise.all([
    payload.find({
      collection: 'pages',
      where: { slug: { equals: 'about' } },
      depth: 1,
      limit: 1,
    }),
    payload.findGlobal({ slug: 'settings', depth: 0 }).catch(() => null),
  ])

  const page = result.docs[0]
  const name = settings?.title || 'Piyush Gogawale'
  const title = page?.title || 'About'
  const lede = page?.lede
  const portraitUrl = page ? (mediaSizeUrl(page.portrait, 'full') ?? mediaUrl(page.portrait)) : null
  const { width, height } = mediaDimensions(page?.portrait)

  return (
    <article className="mx-auto max-w-[1600px] px-6 py-20 lg:px-16 lg:py-28">
      <header className="border-b border-hairline-strong pb-12">
        <p className="label-caps text-steel">About</p>
        <h1 className="hero-display mt-5 max-w-[14ch] text-ink">{title}</h1>
        {lede && (
          <p className="mt-8 max-w-[44ch] text-[clamp(1.25rem,0.9rem+1.1vw,1.6rem)] leading-snug text-slate">
            {lede}
          </p>
        )}
      </header>

      <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-14 lg:grid-cols-12">
        {portraitUrl && (
          <figure className="lg:col-span-5">
            <div className="relative w-full overflow-hidden bg-surface lg:sticky lg:top-12">
              <Image
                src={portraitUrl}
                alt={mediaAlt(page?.portrait) || `Portrait of ${name}`}
                width={width}
                height={height}
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="h-auto w-full object-cover"
                priority
              />
              <figcaption className="label-caps mt-4 text-steel">{name}</figcaption>
            </div>
          </figure>
        )}

        <div className={portraitUrl ? 'lg:col-span-6 lg:col-start-7' : 'lg:col-span-8'}>
          {page?.content ? (
            <div className="prose-editorial">
              <RichText data={page.content as unknown as SerializedEditorState} />
            </div>
          ) : (
            <p className="text-steel">
              Add a page with the slug <code>about</code> in the admin to fill this page — a lede,
              a portrait and your statement.
            </p>
          )}

          {/* One clear path to contact */}
          <div className="mt-14 border-t border-hairline pt-10">
            <p className="font-display text-[26px] leading-tight text-ink">
              Let&rsquo;s make something together.
            </p>
            <Link href="/contact" className="btn btn-primary mt-6">
              Get in touch
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
