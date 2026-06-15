'use client'

import Link from 'next/link'
import React, { useState } from 'react'

export type NavLink = { label: string; href: string }

export const Nav = ({ title, links }: { title: string; links: NavLink[] }) => {
  const [open, setOpen] = useState(false)

  // Pull out a "Contact" link to render as the primary CTA, if present.
  const contact = links.find((l) => /contact/i.test(l.label))
  const mainLinks = links.filter((l) => l !== contact)

  return (
    <header className="sticky top-0 z-50 bg-canvas border-b border-hairline-soft">
      <nav className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 lg:px-8">
        <Link href="/" className="font-display text-2xl tracking-tight text-ink">
          {title}
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 lg:flex">
          {mainLinks.map((l) => (
            <Link
              key={l.href + l.label}
              href={l.href}
              className="text-sm font-medium text-charcoal transition-colors hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
          {contact && (
            <Link
              href={contact.href}
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-on-primary transition-colors active:bg-primary-deep"
            >
              {contact.label}
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center lg:hidden"
        >
          <span className="relative block h-[2px] w-6 bg-ink before:absolute before:-top-2 before:block before:h-[2px] before:w-6 before:bg-ink before:content-[''] after:absolute after:top-2 after:block after:h-[2px] after:w-6 after:bg-ink after:content-['']" />
        </button>
      </nav>

      {open && (
        <div className="border-t border-hairline-soft bg-canvas px-6 py-4 lg:hidden">
          <div className="flex flex-col gap-4">
            {mainLinks.map((l) => (
              <Link
                key={l.href + l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-charcoal"
              >
                {l.label}
              </Link>
            ))}
            {contact && (
              <Link
                href={contact.href}
                onClick={() => setOpen(false)}
                className="inline-flex w-fit rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-on-primary"
              >
                {contact.label}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
