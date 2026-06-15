import Link from 'next/link'
import React from 'react'

import type { NavLink } from './Nav'

export type SocialLink = { label: string; url: string }

export const Footer = ({
  title,
  links,
  social,
}: {
  title: string
  links: NavLink[]
  social: SocialLink[]
}) => (
  <footer className="bg-cream px-6 py-16 lg:px-8">
    <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 md:grid-cols-3">
      <div>
        <div className="font-display text-2xl text-ink">{title}</div>
        <p className="mt-3 text-sm text-steel">Editorial photography.</p>
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-steel">Explore</h4>
        <ul className="mt-4 flex flex-col gap-2">
          {links.map((l) => (
            <li key={l.href + l.label}>
              <Link href={l.href} className="text-sm text-primary">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {social.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-steel">Elsewhere</h4>
          <ul className="mt-4 flex flex-col gap-2">
            {social.map((s) => (
              <li key={s.url + s.label}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>

    <div className="mx-auto mt-12 max-w-[1280px] text-xs text-steel">
      © {new Date().getFullYear()} {title}. All rights reserved.
    </div>
  </footer>
)
