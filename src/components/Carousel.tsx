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
      className="relative h-[70vh] min-h-[420px] w-full overflow-hidden bg-ink lg:h-[82vh]"
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
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === index ? 1 : 0, pointerEvents: i === index ? 'auto' : 'none' }}
        >
          <Image
            src={slide.coverUrl}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
          {/* Sunset scrim tint behind the editorial title */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(214,64,10,0.35) 100%)',
            }}
          />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-[1280px] px-6 pb-16 lg:px-8 lg:pb-24">
              <h1 className="hero-display max-w-4xl text-on-dark drop-shadow-sm">{slide.title}</h1>
              {slide.intro && (
                <p className="mt-4 max-w-xl text-lg text-on-dark/90">{slide.intro}</p>
              )}
            </div>
          </div>
        </Link>
      ))}

      {/* Prev / Next controls */}
      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(index - 1)}
            className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-on-dark backdrop-blur-sm transition-colors hover:bg-black/50"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(index + 1)}
            className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-on-dark backdrop-blur-sm transition-colors hover:bg-black/50"
          >
            ›
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((s, i) => (
              <button
                key={s.slug}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className="h-2 rounded-full transition-all"
                style={{
                  width: i === index ? 24 : 8,
                  background: i === index ? 'var(--color-on-dark)' : 'rgba(255,255,255,0.5)',
                }}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
