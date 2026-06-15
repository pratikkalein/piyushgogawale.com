import { NextResponse } from 'next/server'

import { getPayloadClient } from '@/lib/payload'

export const runtime = 'nodejs'

// --- Basic in-memory IP rate limiting (per server instance) ---------------
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 5
const hits = new Map<string, { count: number; resetAt: number }>()

const rateLimited = (ip: string): boolean => {
  const now = Date.now()
  const entry = hits.get(ip)
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  entry.count += 1
  return entry.count > MAX_PER_WINDOW
}

// --- Helpers --------------------------------------------------------------
const stripHtml = (s: string) => s.replace(/<[^>]*>/g, '')
const clean = (s: unknown, max: number) =>
  typeof s === 'string' ? stripHtml(s).trim().slice(0, max) : ''
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)

export async function POST(req: Request) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again shortly.' },
      { status: 429 },
    )
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // Honeypot: silently accept but do nothing (bots fill this).
  if (typeof body.company === 'string' && body.company.trim() !== '') {
    return NextResponse.json({ ok: true })
  }

  const name = clean(body.name, 120)
  const email = clean(body.email, 200)
  const message = clean(body.message, 4000)

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  // 1) Save to the CMS via the Payload local API (bypasses public access control).
  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'submissions',
      data: { name, email, message, date: new Date().toISOString() },
    })
  } catch (err) {
    console.error('Failed to save submission:', err)
    return NextResponse.json({ error: 'Could not save your message.' }, { status: 500 })
  }

  // 2) Forward to email via FormSubmit (server-side; alias kept private).
  const alias = process.env.CONTACT_ALIAS
  if (alias) {
    try {
      await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(alias)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `New message from ${name} — piyushgogawale.com`,
          _template: 'table',
        }),
      })
    } catch (err) {
      // The message is already stored in the CMS, so this is non-fatal.
      console.error('FormSubmit forward failed:', err)
    }
  }

  return NextResponse.json({ ok: true })
}
