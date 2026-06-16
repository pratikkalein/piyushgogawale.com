'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'

import { HeroCanvas } from '@/components/HeroCanvas'

export type Slide = {
  slug: string
  title: string
  intro?: string | null
  coverUrl: string
  alt: string
}

const pad = (n: number) => String(n).padStart(2, '0')

/** WebGL support, probed once and cached (it never changes at runtime). */
let webglCache: boolean | null = null
const supportsWebGL = () => {
  if (webglCache !== null) return webglCache
  try {
    const c = document.createElement('canvas')
    webglCache = !!(c.getContext('webgl') || c.getContext('experimental-webgl'))
  } catch {
    webglCache = false
  }
  return webglCache
}

/* The WebGL hero is allowed only when the client supports WebGL and the user
   hasn't asked to reduce motion. Read as an external store so the value is
   `false` during SSR/first paint (matching the DOM-only fallback) and updates
   if the motion preference changes — no setState-in-effect. */
const REDUCE_MQ = '(prefers-reduced-motion: reduce)'
const subscribeMotion = (cb: () => void) => {
  const mq = window.matchMedia(REDUCE_MQ)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}
const heroAllowed = () => !window.matchMedia(REDUCE_MQ).matches && supportsWebGL()
const useHeroAllowed = () =>
  useSyncExternalStore(
    subscribeMotion,
    heroAllowed,
    () => false, // server snapshot
  )

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

  // WebGL hero: enabled only on capable clients; turns itself off if the canvas
  // ever fails, so the plain <Image> crossfade always backs it.
  const [canvasFailed, setCanvasFailed] = useState(false)
  const [canvasReady, setCanvasReady] = useState(false)
  const canvasOn = useHeroAllowed() && !canvasFailed

  // Pause autoplay on hover / keyboard focus within the hero.
  const [paused, setPaused] = useState(false)

  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(index + 1)
      if (e.key === 'ArrowLeft') go(index - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, go])

  // Autoplay — advance every 6s so the ink-dissolve plays itself. Skips when
  // paused, when the tab is hidden, for reduced-motion users, or for a lone slide.
  useEffect(() => {
    if (count <= 1 || paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') setIndex((i) => (i + 1) % count)
    }, 6000)
    return () => window.clearInterval(id)
  }, [count, paused])

  if (count === 0) return null

  const images = slides.map((s) => s.coverUrl)

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured galleries"
      className="relative h-[calc(100dvh-var(--topbar-height))] min-h-[460px] w-full overflow-hidden bg-ink lg:h-[100dvh]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return
        const delta = e.changedTouches[0].clientX - touchStartX.current
        if (delta > 50) go(index - 1)
        if (delta < -50) go(index + 1)
        touchStartX.current = null
      }}
    >
      {/* z0 — DOM image crossfade. The SSR / no-JS / no-WebGL / reduced-motion
          baseline, and the layer the canvas fades in over. Decorative here:
          the accessible name lives on the text link below. */}
      <div className="absolute inset-0" aria-hidden="true">
        {slides.map((slide, i) => (
          <div
            key={slide.slug}
            className={`kb absolute inset-0 transition-opacity duration-700 ease-out ${
              i === index ? 'kb-active' : ''
            }`}
            style={{ opacity: i === index ? 1 : 0 }}
          >
            <Image
              src={slide.coverUrl}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* z10 — WebGL living wall, fading in once its textures are ready. On any
          failure it un-mounts and the crossfade above shows through. */}
      {canvasOn && (
        <HeroCanvas
          images={images}
          index={index}
          onReady={() => setCanvasReady(true)}
          onFail={() => {
            setCanvasFailed(true)
            setCanvasReady(false)
          }}
          className="absolute inset-0 z-10 h-full w-full"
          style={{
            opacity: canvasReady ? 1 : 0,
            transition: 'opacity 700ms var(--ease-out-expo)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* z20 — monochrome scrim for title legibility, no colour. */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 38%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* z30 — title + full-area click target (one interactive slide at a time). */}
      {slides.map((slide, i) => (
        <Link
          key={slide.slug}
          href={`/sections/${slide.slug}`}
          aria-hidden={i !== index}
          tabIndex={i === index ? 0 : -1}
          className="group absolute inset-0 z-30 transition-opacity duration-700 ease-out focus-visible:outline-on-dark focus-visible:[outline-offset:-3px]"
          style={{ opacity: i === index ? 1 : 0, pointerEvents: i === index ? 'auto' : 'none' }}
        >
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
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 flex items-end justify-between px-6 pb-7 lg:px-16">
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

      {/* Scroll-down cue — the hero now fills the viewport, so signal the
          content below. Anchors to the work section for a tap/click shortcut. */}
      <a
        href="#work"
        aria-label="Scroll to selected work"
        className="group absolute bottom-7 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-2 text-on-dark/70 transition-colors hover:text-on-dark focus-visible:outline-on-dark"
      >
        <span className="label-caps hidden sm:block">Scroll</span>
        <svg
          width="16"
          height="24"
          viewBox="0 0 16 24"
          fill="none"
          aria-hidden="true"
          className="scroll-cue"
        >
          <path
            d="M8 1v20M2 15l6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="square"
          />
        </svg>
      </a>
    </section>
  )
}
