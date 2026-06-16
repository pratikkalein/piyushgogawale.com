'use client'

import React, { useEffect, useRef } from 'react'

/**
 * Scroll-reveal wrapper for grid items (galleries, posts, photos). The hidden
 * state lives in CSS gated on `scripting: enabled`, so content is visible by
 * default; this only adds `.is-visible` once the item scrolls into view, firing
 * once. A timeout fallback guarantees the item reveals even if the observer
 * never fires (short pages, background tabs), so it can never ship blank.
 *
 * `index` drives the staggered transition-delay via the `--reveal-i` token.
 */
export const Reveal = ({
  children,
  index = 0,
  className = '',
}: {
  children: React.ReactNode
  index?: number
  className?: string
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reveal = () => el.classList.add('is-visible')

    if (typeof IntersectionObserver === 'undefined') {
      reveal()
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            reveal()
            io.disconnect()
            break
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    io.observe(el)

    const fallback = window.setTimeout(() => {
      reveal()
      io.disconnect()
    }, 1600)

    return () => {
      io.disconnect()
      window.clearTimeout(fallback)
    }
  }, [])

  return (
    <div ref={ref} className={`reveal ${className}`} style={{ '--reveal-i': index } as React.CSSProperties}>
      {children}
    </div>
  )
}
