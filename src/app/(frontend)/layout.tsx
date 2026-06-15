import React from 'react'
import { Inter, Fraunces } from 'next/font/google'

import { getPayloadClient } from '@/lib/payload'
import { Nav, type NavLink } from '@/components/Nav'
import { Footer, type SocialLink } from '@/components/Footer'
import { SunsetBand } from '@/components/SunsetBand'
import './styles.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz'],
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
  const settings = await payload.findGlobal({ slug: 'settings', depth: 0 }).catch(() => null)

  const title = settings?.title || 'Piyush Gogawale'
  const navLinks: NavLink[] =
    settings?.nav && settings.nav.length > 0
      ? settings.nav.map((n) => ({ label: n.label, href: n.href }))
      : DEFAULT_NAV
  const social: SocialLink[] = settings?.social?.map((s) => ({ label: s.label, url: s.url })) ?? []

  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Nav title={title} links={navLinks} />
        <main className="flex-1">{children}</main>
        <SunsetBand />
        <Footer title={title} links={navLinks} social={social} />
      </body>
    </html>
  )
}
