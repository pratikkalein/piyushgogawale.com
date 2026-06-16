'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useCallback, useEffect, useRef, useState } from 'react'

export type Slide = {
  slug: string
  title: string
  intro?: string | null
  coverUrl: string
  alt: string
}

const pad = (n: number) => String(n).padStart(2, '0')

const Chevron = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={dir === 'left' ? 'rotate-180' : undefined}
  >
    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square" />
  </svg>
)

export const Carousel = ({ slides }: { slides: Slide[] }) => {
  const [index, setIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const count = slides.length

  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(index + 1)
      if (e.key === 'ArrowLeft') go(index - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, go])

  if (count === 0) return null

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured galleries"
      className="relative h-[78vh] min-h-[460px] w-full overflow-hidden bg-ink"
      onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return
        const delta = e.changedTouches[0].clientX - touchStartX.current
        if (delta > 50) go(index - 1)
        if (delta < -50) go(index + 1)
        touchStartX.current = null
      }}
    >
      {slides.map((slide, i) => (
        <Link
          key={slide.slug}
          href={`/sections/${slide.slug}`}
          aria-hidden={i !== index}
          tabIndex={i === index ? 0 : -1}
          className="group absolute inset-0 transition-opacity duration-700 ease-out focus-visible:outline-on-dark focus-visible:[outline-offset:-3px]"
          style={{ opacity: i === index ? 1 : 0, pointerEvents: i === index ? 'auto' : 'none' }}
        >
          <div className={`kb absolute inset-0 ${i === index ? 'kb-active' : ''}`}>
            <Image
              src={slide.coverUrl}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
          {/* Monochrome scrim — title legibility, no colour. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 38%, rgba(0,0,0,0.6) 100%)',
            }}
          />
          <div className="absolute inset-x-0 bottom-0 px-6 pb-24 lg:px-16 lg:pb-28">
            <p className="label-caps text-on-dark/70">Featured · {pad(i + 1)}</p>
            <h1 className="hero-display mt-4 max-w-[16ch] text-on-dark">{slide.title}</h1>
            {slide.intro && (
              <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-on-dark/85">
                {slide.intro}
              </p>
            )}
            <span className="label-caps mt-7 inline-flex items-center gap-3 text-on-dark">
              View Gallery
              <span className="block h-px w-8 bg-on-dark transition-all duration-300 ease-out group-hover:w-14" />
            </span>
          </div>
        </Link>
      ))}

      {/* Controls */}
      {count > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between px-6 pb-7 lg:px-16">
          {/* Segmented line indicators — 44px-tall hit areas */}
          <div className="pointer-events-auto flex items-center gap-1">
            {slides.map((s, i) => (
              <button
                key={s.slug}
                type="button"
                aria-label={`Go to slide ${i + 1}: ${s.title}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className="group flex h-11 items-center px-1 focus-visible:outline-on-dark"
              >
                <span
                  className={`block h-px transition-all duration-300 ease-out ${
                    i === index ? 'w-10 bg-on-dark' : 'w-5 bg-on-dark/40 group-hover:bg-on-dark/80'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Counter + prev / next */}
          <div className="pointer-events-auto flex items-center gap-5">
            <span className="label-caps text-on-dark/80">
              {pad(index + 1)} / {pad(count)}
            </span>
            <div className="flex">
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() => go(index - 1)}
                className="flex h-11 w-11 items-center justify-center border border-on-dark/40 text-on-dark transition-colors hover:bg-on-dark hover:text-ink focus-visible:outline-on-dark"
              >
                <Chevron dir="left" />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() => go(index + 1)}
                className="-ml-px flex h-11 w-11 items-center justify-center border border-on-dark/40 text-on-dark transition-colors hover:bg-on-dark hover:text-ink focus-visible:outline-on-dark"
              >
                <Chevron dir="right" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
