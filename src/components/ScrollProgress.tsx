'use client'

import React, { useEffect, useRef } from 'react'

/**
 * scroll-progress — DESIGN's "thin (2px) black line at the very top of the
 * viewport". A linear horizontal indicator, never a spinner, keeping the
 * minimalist horizontal/vertical axis of the gallery. Width tracks scroll
 * depth; it sits above the content column (right of the fixed sidebar).
 */
export const ScrollProgress = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = ref.current
    if (!bar) return

    let frame = 0
    const update = () => {
      frame = 0
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      const ratio = max > 0 ? Math.min(doc.scrollTop / max, 1) : 0
      bar.style.transform = `scaleX(${ratio})`
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed right-0 left-0 top-0 h-[2px] lg:left-[var(--sidebar-width)]"
      style={{ zIndex: 'var(--z-progress)' }}
    >
      <div
        ref={ref}
        className="h-full w-full origin-left bg-ink"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  )
}
