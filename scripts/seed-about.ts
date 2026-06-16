/**
 * One-off dev seed: create (or update) the `about` page so the About layout
 * can be previewed locally. Run with: pnpm payload run ./scripts/seed-about.ts
 * Safe to re-run; it upserts on the `about` slug. Not used in production.
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const text = (value: string) => ({
  type: 'text',
  version: 1,
  text: value,
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
})

const paragraph = (value: string) => ({
  type: 'paragraph',
  version: 1,
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  textFormat: 0,
  children: [text(value)],
})

const content = {
  root: {
    type: 'root',
    version: 1,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    children: [
      paragraph(
        'I am a photographer working across editorial, portrait and commercial commissions. My work looks for the quiet moment inside a loud one — the held breath before a frame resolves into something true.',
      ),
      paragraph(
        'For the last decade I have made pictures for magazines, galleries and the people who simply wanted to remember a day exactly as it felt. I shoot on both film and digital, and I print everything I am proud of.',
      ),
      paragraph(
        'I work out of the studio but most of the good frames happen somewhere else entirely. If you have a story you want told carefully, I would like to hear about it.',
      ),
    ],
  },
}

// Hard safety guard: this dev seed must never touch a remote/production DB.
const uri = process.env.DATABASE_URI ?? ''
console.log('seed target DATABASE_URI host:', uri.replace(/\/\/[^@]*@/, '//****@'))
if (!/127\.0\.0\.1|localhost/.test(uri)) {
  throw new Error('Refusing to seed: DATABASE_URI is not localhost. Aborting before any write.')
}

const payload = await getPayload({ config })

const existing = await payload.find({
  collection: 'pages',
  where: { slug: { equals: 'about' } },
  limit: 1,
})

const data = {
  title: 'On the work',
  slug: 'about',
  lede: 'Editorial, portrait and commercial photography — made slowly, printed carefully, and built to outlast the scroll.',
  content,
}

if (existing.docs[0]) {
  await payload.update({ collection: 'pages', id: existing.docs[0].id, data })
  console.log('Updated existing about page:', existing.docs[0].id)
} else {
  const created = await payload.create({ collection: 'pages', data })
  console.log('Created about page:', created.id)
}
