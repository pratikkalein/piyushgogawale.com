import Link from 'next/link'
import React from 'react'

import { getPayloadClient } from '@/lib/payload'
import { mediaAlt, mediaSizeUrl, mediaUrl } from '@/lib/media'
import { Carousel, type Slide } from '@/components/Carousel'
import { SectionCard } from '@/components/SectionCard'

export const revalidate = 60

export default async function HomePage() {
  const payload = await getPayloadClient()

  const [featured, all] = await Promise.all([
    payload.find({
      collection: 'sections',
      where: { featured: { equals: true } },
      sort: 'order',
      depth: 1,
      limit: 20,
    }),
    payload.find({ collection: 'sections', sort: 'order', depth: 1, limit: 100 }),
  ])

  const slides: Slide[] = featured.docs
    .map((s): Slide | null => {
      const coverUrl = mediaSizeUrl(s.cover, 'full') ?? mediaUrl(s.cover)
      if (!coverUrl) return null
      return {
        slug: s.slug ?? '',
        title: s.title,
        intro: s.intro,
        coverUrl,
        alt: mediaAlt(s.cover) || s.title,
      }
    })
    .filter((s): s is Slide => s !== null)

  return (
    <>
      {slides.length > 0 ? (
        <Carousel slides={slides} />
      ) : (
        <section className="flex h-[60vh] items-center justify-center bg-surface px-6 text-center">
          <div>
            <h1 className="hero-display text-ink">Piyush Gogawale</h1>
            <p className="mt-4 text-steel">
              Mark a gallery section as <em>featured</em> in the admin to fill this carousel.
            </p>
          </div>
        </section>
      )}

      <section id="work" className="mx-auto max-w-[1280px] scroll-mt-20 px-6 py-24 lg:px-8">
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-[1px] text-primary">Galleries</p>
          <h2 className="mt-2 font-display text-[52px] leading-tight text-ink">Selected work</h2>
        </div>

        {all.docs.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {all.docs.map((s) => (
              <SectionCard
                key={s.id}
                slug={s.slug ?? ''}
                title={s.title}
                intro={s.intro}
                coverUrl={mediaSizeUrl(s.cover, 'card') ?? mediaUrl(s.cover)}
                alt={mediaAlt(s.cover) || s.title}
              />
            ))}
          </div>
        ) : (
          <p className="text-steel">No gallery sections yet.</p>
        )}
      </section>

      {/* cta-banner-cream */}
      <section className="mx-auto max-w-[1280px] px-6 pb-24 lg:px-8">
        <div className="rounded-lg bg-cream px-8 py-16 text-center">
          <h2 className="font-display text-[52px] leading-tight text-ink">Let’s work together</h2>
          <p className="mx-auto mt-3 max-w-md text-slate">
            Commissions, prints and collaborations — get in touch.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-on-dark"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </>
  )
}
