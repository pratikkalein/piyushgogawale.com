import Link from 'next/link'
import React from 'react'

import { getPayloadClient } from '@/lib/payload'
import { mediaAlt, mediaSizeUrl, mediaUrl } from '@/lib/media'
import { Carousel, type Slide } from '@/components/Carousel'
import { SectionCard } from '@/components/SectionCard'
import { Reveal } from '@/components/Reveal'

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

  const count = all.docs.length

  return (
    <>
      {slides.length > 0 ? (
        <Carousel slides={slides} />
      ) : (
        <section className="flex min-h-[60dvh] items-center bg-canvas px-6 py-24 lg:px-16">
          <div>
            <h1 className="hero-display text-ink">Piyush Gogawale</h1>
            <p className="mt-5 max-w-[48ch] text-steel">
              Mark a gallery section as <em>featured</em> in the admin to fill this carousel.
            </p>
          </div>
        </section>
      )}

      <section id="work" className="mx-auto max-w-[1600px] scroll-mt-24 px-6 py-24 lg:px-16 lg:py-32">
        <div className="flex items-end justify-between gap-6 border-b border-hairline-strong pb-6">
          <h2 className="headline text-ink">Selected Work</h2>
          <span className="label-caps shrink-0 pb-1 text-steel">
            {count} {count === 1 ? 'Gallery' : 'Galleries'}
          </span>
        </div>

        {count > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {all.docs.map((s, i) => (
              <Reveal key={s.id} index={i % 3}>
                <SectionCard
                  slug={s.slug ?? ''}
                  title={s.title}
                  intro={s.intro}
                  coverUrl={mediaSizeUrl(s.cover, 'card') ?? mediaUrl(s.cover)}
                  alt={mediaAlt(s.cover) || s.title}
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-12 text-steel">No gallery sections yet.</p>
        )}
      </section>

      {/* Drenched-black closing call to action */}
      <section className="bg-ink px-6 py-28 text-center lg:px-16 lg:py-36">
        <h2 className="hero-display text-on-dark">Let&rsquo;s work together</h2>
        <p className="label-caps mt-6 text-on-dark/60">Commissions · Prints · Collaborations</p>
        <Link href="/contact" className="btn btn-invert mt-10">
          Get in touch
        </Link>
      </section>
    </>
  )
}
