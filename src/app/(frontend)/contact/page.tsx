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
    <section className="mx-auto max-w-[520px] px-6 py-16 lg:py-24">
      <h1 className="font-display text-[52px] leading-tight text-ink">Get in touch</h1>
      <p className="mt-3 text-slate">
        For commissions, prints and collaborations. I’ll reply by email.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-8 rounded-lg border border-beige-deep bg-cream p-8"
        noValidate
      >
        {/* Honeypot field, visually hidden from real users */}
        <div className="absolute left-[-9999px]" aria-hidden="true">
          <label>
            Company
            <input type="text" name="company" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="flex flex-col gap-4">
          <Field label="Name">
            <input
              name="name"
              type="text"
              required
              maxLength={120}
              className="h-11 rounded-md border border-hairline-strong bg-canvas px-3 text-ink outline-none focus:border-2 focus:border-primary"
            />
          </Field>
          <Field label="Email">
            <input
              name="email"
              type="email"
              required
              maxLength={200}
              className="h-11 rounded-md border border-hairline-strong bg-canvas px-3 text-ink outline-none focus:border-2 focus:border-primary"
            />
          </Field>
          <Field label="Message">
            <textarea
              name="message"
              required
              rows={5}
              maxLength={4000}
              className="rounded-md border border-hairline-strong bg-canvas p-3 text-ink outline-none focus:border-2 focus:border-primary"
            />
          </Field>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="mt-2 rounded-md bg-ink px-5 py-3 text-sm font-medium text-on-dark transition-opacity disabled:opacity-50"
          >
            {status === 'submitting' ? 'Sending…' : 'Send message'}
          </button>

          {status === 'success' && (
            <p className="text-sm font-medium text-primary">
              Thanks — your message has been sent.
            </p>
          )}
          {status === 'error' && <p className="text-sm font-medium text-sunshine-900">{error}</p>}
        </div>
      </form>
    </section>
  )
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-sm font-medium text-charcoal">{label}</span>
    {children}
  </label>
)
