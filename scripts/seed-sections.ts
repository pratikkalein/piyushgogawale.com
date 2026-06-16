/**
 * One-off dev seed: create sample gallery sections (Watches, Cars, Products)
 * so the dynamic sidebar nav, carousel and grid can be previewed locally.
 * Run with: pnpm payload run ./scripts/seed-sections.ts
 * Safe to re-run; it skips sections whose slug already exists. Not for prod.
 */
import { mkdtempSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import sharp from 'sharp'
import { getPayload } from 'payload'
import config from '@payload-config'

// Hard safety guard: never touch a remote/production DB.
const uri = process.env.DATABASE_URI ?? ''
console.log('seed target DATABASE_URI host:', uri.replace(/\/\/[^@]*@/, '//****@'))
if (!/127\.0\.0\.1|localhost/.test(uri)) {
  throw new Error('Refusing to seed: DATABASE_URI is not localhost. Aborting before any write.')
}
// Storage guard: when S3_BUCKET is set, uploads go to the (production) R2
// bucket. Media seeds must write to local disk, so refuse unless S3 is unset.
// Run with:  S3_BUCKET= pnpm payload run ./scripts/seed-sections.ts
if (process.env.S3_BUCKET) {
  throw new Error('Refusing to seed media: S3_BUCKET is set (uploads would hit R2). Re-run with S3_BUCKET= to use local disk.')
}

const dir = mkdtempSync(join(tmpdir(), 'pp-seed-'))

/** Monochrome placeholder panel with a label, rendered to a JPEG on disk. */
const makeImage = async (label: string, sub: string, lum: number) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="2000">
    <rect width="1600" height="2000" fill="rgb(${lum},${lum},${lum})"/>
    <text x="50%" y="48%" text-anchor="middle" fill="#ffffff"
      font-family="Georgia, serif" font-size="150" font-weight="700">${label}</text>
    <text x="50%" y="55%" text-anchor="middle" fill="#ffffff" opacity="0.6"
      font-family="Arial, sans-serif" font-size="34" letter-spacing="10">${sub.toUpperCase()}</text>
  </svg>`
  const file = join(dir, `${label}-${sub}.jpg`.replace(/\s+/g, '-').toLowerCase())
  await sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toFile(file)
  return file
}

const sectionsToSeed = [
  {
    title: 'Watches',
    intro: 'Studio macro work — dials, movements and the light that lives on polished steel.',
    featured: true,
    order: 1,
    lum: 26,
  },
  {
    title: 'Cars',
    intro: 'Form in motion. Bodywork, reflections and the quiet drama of machined surfaces.',
    featured: true,
    order: 2,
    lum: 38,
  },
  {
    title: 'Products',
    intro: 'Commercial still life — considered objects, framed with editorial restraint.',
    featured: false,
    order: 3,
    lum: 50,
  },
]

const payload = await getPayload({ config })

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

for (const s of sectionsToSeed) {
  const slug = slugify(s.title)
  const existing = await payload.find({
    collection: 'sections',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  if (existing.docs[0]) {
    console.log(`Skipping existing section: ${s.title}`)
    continue
  }

  const coverFile = await makeImage(s.title, 'Cover', s.lum)
  const cover = await payload.create({
    collection: 'media',
    data: { alt: `${s.title} — cover` },
    filePath: coverFile,
  })

  const photos = []
  for (let i = 1; i <= 5; i++) {
    const file = await makeImage(s.title, `Frame ${i}`, s.lum + i * 6)
    const media = await payload.create({
      collection: 'media',
      data: { alt: `${s.title} — frame ${i}` },
      filePath: file,
    })
    photos.push({ image: media.id })
  }

  const created = await payload.create({
    collection: 'sections',
    data: {
      title: s.title,
      slug,
      cover: cover.id,
      intro: s.intro,
      photos,
      featured: s.featured,
      order: s.order,
    },
  })
  console.log(`Created section "${s.title}" (id ${created.id}) with ${photos.length} photos`)
}

console.log('Done seeding sections. Temp images in', dir)
