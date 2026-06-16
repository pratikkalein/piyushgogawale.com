'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export type NavLink = { label: string; href: string }
export type NavSocial = { label: string; url: string }

/** href "/#work" → "/"; "/blog" → "/blog". Hash + trailing slash stripped. */
const pathOf = (href: string) => {
  const path = href.split('#')[0].split('?')[0]
  if (path === '' || path === '/') return '/'
  return path.replace(/\/$/, '')
}

const useActive = () => {
  const pathname = usePathname() || '/'
  return (href: string) => {
    const path = pathOf(href)
    return path === '/' ? pathname === '/' : pathname === path || pathname.startsWith(`${path}/`)
  }
}

export const Nav = ({
  title,
  links,
  sections = [],
  social = [],
}: {
  title: string
  links: NavLink[]
  sections?: NavLink[]
  social?: NavSocial[]
}) => {
  const [open, setOpen] = useState(false)
  const isActive = useActive()

  // Split out Contact to anchor it as the persistent primary action.
  const contact = links.find((l) => /contact/i.test(l.label))
  // Page links = everything except Contact, and (when the sidebar already lists
  // gallery sections) the generic "Work" anchor those sections now replace.
  const pageLinks = links.filter(
    (l) => l !== contact && !(sections.length > 0 && (/#work/.test(l.href) || /^work$/i.test(l.label))),
  )

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const StackedLink = ({ link, large = false }: { link: NavLink; large?: boolean }) => {
    const active = isActive(link.href)
    return (
      <Link
        href={link.href}
        onClick={() => setOpen(false)}
        aria-current={active ? 'page' : undefined}
        className={`group flex items-center text-ink ${large ? 'py-1.5' : ''}`}
      >
        {/* Active / hover indicator — DESIGN's 16px horizontal line. */}
        <span
          aria-hidden="true"
          className={`block h-px shrink-0 bg-ink transition-all duration-300 ease-out ${
            active ? 'mr-3 w-4' : 'mr-0 w-0 group-hover:mr-3 group-hover:w-4'
          }`}
        />
        <span
          className={
            large
              ? `font-display leading-none ${active ? 'font-medium' : ''}`
              : `nav-link transition-colors ${active ? 'font-semibold' : 'text-charcoal group-hover:text-ink'}`
          }
          style={large ? { fontSize: 'clamp(1.75rem, 6vw, 2.5rem)' } : undefined}
        >
          {link.label}
        </span>
      </Link>
    )
  }

  const NavBody = ({ large = false }: { large?: boolean }) => (
    <>
      {sections.length > 0 && (
        <div>
          <p className="label-caps mb-5 text-steel">Work</p>
          <div className={`flex flex-col ${large ? 'gap-1' : 'gap-4'}`}>
            {sections.map((l) => (
              <StackedLink key={l.href + l.label} link={l} large={large} />
            ))}
          </div>
        </div>
      )}

      {pageLinks.length > 0 && (
        <div className={sections.length > 0 ? 'mt-9 border-t border-hairline pt-8' : ''}>
          <div className={`flex flex-col ${large ? 'gap-1' : 'gap-4'}`}>
            {pageLinks.map((l) => (
              <StackedLink key={l.href + l.label} link={l} large={large} />
            ))}
          </div>
        </div>
      )}
    </>
  )

  const BottomBlock = ({ stacked = false }: { stacked?: boolean }) => (
    <div className="flex flex-col gap-8">
      {contact && (
        <Link href={contact.href} onClick={() => setOpen(false)} className="btn btn-primary w-full">
          {contact.label}
        </Link>
      )}
      {social.length > 0 && (
        <ul className={stacked ? 'flex flex-wrap gap-x-6 gap-y-3' : 'flex flex-col gap-3'}>
          {social.map((s) => (
            <li key={s.url + s.label}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="label-caps link-underline inline-block text-steel transition-colors hover:text-ink"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )

  return (
    <>
      {/* ---------------------------------------------------------------- */}
      {/* Desktop: fixed vertical sidebar anchor                            */}
      {/* ---------------------------------------------------------------- */}
      <aside
        className="fixed inset-y-0 left-0 hidden w-[var(--sidebar-width)] flex-col border-r border-hairline-strong bg-canvas lg:flex"
        style={{ zIndex: 'var(--z-sidebar)' }}
      >
        <div className="shrink-0 px-8 pt-10">
          <Link href="/" className="font-display text-2xl leading-tight tracking-tight text-ink">
            {title}
          </Link>
        </div>

        <nav className="mt-14 flex-1 overflow-y-auto px-8" aria-label="Primary">
          <NavBody />
        </nav>

        <div className="shrink-0 px-8 pb-10 pt-8">
          <BottomBlock />
        </div>
      </aside>

      {/* ---------------------------------------------------------------- */}
      {/* Mobile: fixed top bar + full-screen drawer                        */}
      {/* ---------------------------------------------------------------- */}
      <header
        className="fixed inset-x-0 top-0 flex h-[var(--topbar-height)] items-center justify-between border-b border-hairline-strong bg-canvas pl-6 pr-2 lg:hidden"
        // Sit above the drawer so the toggle stays visible as the close (X) button.
        style={{ zIndex: 'calc(var(--z-overlay) + 1)' }}
      >
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="font-display text-xl leading-none tracking-tight text-ink"
        >
          {title}
        </Link>
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-12 w-12 items-center justify-center text-ink"
        >
          {open ? (
            <span className="relative block h-4 w-5">
              <span className="absolute left-0 top-1/2 block h-px w-5 -translate-y-1/2 rotate-45 bg-ink" />
              <span className="absolute left-0 top-1/2 block h-px w-5 -translate-y-1/2 -rotate-45 bg-ink" />
            </span>
          ) : (
            <span className="relative block h-3 w-5">
              <span className="absolute left-0 top-0 block h-px w-5 bg-ink" />
              <span className="absolute bottom-0 left-0 block h-px w-5 bg-ink" />
            </span>
          )}
        </button>
      </header>

      {/* Drawer */}
      <div
        className={`fixed inset-0 flex flex-col bg-canvas transition-opacity duration-300 ease-out lg:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        style={{ zIndex: 'var(--z-overlay)' }}
        aria-hidden={!open}
      >
        <nav
          className="flex-1 overflow-y-auto px-6 pt-[calc(var(--topbar-height)+2rem)]"
          aria-label="Primary"
        >
          <NavBody large />
        </nav>
        <div className="shrink-0 px-6 pb-10 pt-6">
          <BottomBlock stacked />
        </div>
      </div>
    </>
  )
}
