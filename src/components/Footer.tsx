import Link from 'next/link'
import React from 'react'

import type { NavLink, NavSocial } from './Nav'

export type SocialLink = NavSocial

export const Footer = ({
  title,
  links,
  sections = [],
  social,
}: {
  title: string
  links: NavLink[]
  sections?: NavLink[]
  social: SocialLink[]
}) => (
  <footer className="mt-auto border-t border-hairline-strong bg-canvas">
    <div className="px-6 py-16 lg:px-16">
      <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <div className="font-display text-2xl leading-tight text-ink">{title}</div>
          <p className="label-caps mt-4 text-steel">Editorial Photography</p>
        </div>

        {sections.length > 0 && (
          <div>
            <h4 className="label-caps text-steel">Galleries</h4>
            <ul className="mt-5 flex flex-col gap-3">
              {sections.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} className="link-underline nav-link inline-block text-charcoal">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h4 className="label-caps text-steel">Index</h4>
          <ul className="mt-5 flex flex-col gap-3">
            {links.map((l) => (
              <li key={l.href + l.label}>
                <Link href={l.href} className="link-underline nav-link inline-block text-charcoal">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {social.length > 0 && (
          <div>
            <h4 className="label-caps text-steel">Elsewhere</h4>
            <ul className="mt-5 flex flex-col gap-3">
              {social.map((s) => (
                <li key={s.url + s.label}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline nav-link inline-block text-charcoal"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-16 flex flex-col gap-2 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="label-caps text-steel">
          © {new Date().getFullYear()} {title}
        </p>
        <p className="label-caps text-steel">All Rights Reserved</p>
      </div>
    </div>
  </footer>
)
