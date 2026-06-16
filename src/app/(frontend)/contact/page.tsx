'use client'

import React, { useState } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactPage() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('submitting')
    setError('')

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
      // Honeypot — must stay empty.
      company: (form.elements.namedItem('company') as HTMLInputElement).value,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Something went wrong. Please try again.')
      setStatus('success')
      form.reset()
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <section className="mx-auto max-w-[560px] px-6 py-20 lg:py-28">
      <p className="label-caps text-steel">Contact</p>
      <h1 className="hero-display mt-4 text-ink">Get in touch</h1>
      <p className="mt-6 max-w-[48ch] text-slate">
        For commissions, prints and collaborations. I’ll reply by email.
      </p>

      <form onSubmit={onSubmit} className="mt-14" noValidate>
        {/* Honeypot field, visually hidden from real users */}
        <div className="absolute left-[-9999px]" aria-hidden="true">
          <label>
            Company
            <input type="text" name="company" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="flex flex-col gap-9">
          <Field label="Name">
            <input
              name="name"
              type="text"
              required
              maxLength={120}
              autoComplete="name"
              placeholder="Your name"
              className="field-underline"
            />
          </Field>
          <Field label="Email">
            <input
              name="email"
              type="email"
              required
              maxLength={200}
              autoComplete="email"
              inputMode="email"
              placeholder="you@example.com"
              className="field-underline"
            />
          </Field>
          <Field label="Message">
            <textarea
              name="message"
              required
              rows={5}
              maxLength={4000}
              placeholder="Tell me about your project"
              className="field-underline resize-y"
            />
          </Field>

          <button type="submit" disabled={status === 'submitting'} className="btn btn-primary mt-2 self-start">
            {status === 'submitting' ? 'Sending…' : 'Send message'}
          </button>

          <p role="status" aria-live="polite" className="sr-only">
            {status === 'submitting' ? 'Sending your message' : ''}
          </p>
          {status === 'success' && (
            <p
              role="status"
              aria-live="polite"
              className="flex items-center gap-2 font-medium text-ink"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8.5l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              Thanks — your message has been sent. I’ll reply by email.
            </p>
          )}
          {status === 'error' && (
            <p role="alert" className="text-sm font-medium" style={{ color: 'var(--color-error)' }}>
              {error}
            </p>
          )}
        </div>
      </form>
    </section>
  )
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="flex flex-col gap-2">
    <span className="label-caps text-steel">{label}</span>
    {children}
  </label>
)
