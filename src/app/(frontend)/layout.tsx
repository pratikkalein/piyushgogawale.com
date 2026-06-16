import React from 'react'
import { Inter, Playfair_Display } from 'next/font/google'

import { getPayloadClient } from '@/lib/payload'
import { Nav, type NavLink } from '@/components/Nav'
import { Footer, type SocialLink } from '@/components/Footer'
import { ScrollProgress } from '@/components/ScrollProgress'
import './styles.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
})

export const metadata = {
  title: 'Piyush Gogawale — Photography',
  description: 'Editorial photography portfolio.',
}

const DEFAULT_NAV: NavLink[] = [
  { label: 'Work', href: '/#work' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayloadClient()
  const [settings, sectionsRes] = await Promise.all([
    payload.findGlobal({ slug: 'settings', depth: 0 }).catch(() => null),
    payload
      .find({ collection: 'sections', sort: 'order', depth: 0, limit: 100 })
      .catch(() => ({ docs: [] as { title: string; slug?: string | null }[] })),
  ])

  const title = settings?.title || 'Piyush Gogawale'
  const navLinks: NavLink[] =
    settings?.nav && settings.nav.length > 0
      ? settings.nav.map((n) => ({ label: n.label, href: n.href }))
      : DEFAULT_NAV
  const social: SocialLink[] = settings?.social?.map((s) => ({ label: s.label, url: s.url })) ?? []

  // Gallery sections drive the nav automatically — add one in /admin and it
  // appears in the sidebar (and footer) on the next revalidate, no code change.
  const sections: NavLink[] = sectionsRes.docs
    .filter((s) => s.slug)
    .map((s) => ({ label: s.title, href: `/sections/${s.slug}` }))

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <a
          href="#content"
          className="label-caps sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:bg-ink focus:px-4 focus:py-3 focus:text-on-dark"
        >
          Skip to content
        </a>
        <ScrollProgress />
        <Nav title={title} links={navLinks} sections={sections} social={social} />
        <div className="site-shell">
          <main id="content" className="flex-1">
            {children}
          </main>
          <Footer title={title} links={navLinks} sections={sections} social={social} />
        </div>
      </body>
    </html>
  )
}
