import { postgresAdapter } from '@payloadcms/db-postgres'
import { s3Storage } from '@payloadcms/storage-s3'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import type { Plugin } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Sections } from './collections/Sections'
import { Pages } from './collections/Pages'
import { Blog } from './collections/Blog'
import { Submissions } from './collections/Submissions'
import { Settings } from './globals/Settings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const publicBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, '')

// Only enable Cloudflare R2 (S3) storage when credentials are present.
// Without them, Payload falls back to local disk storage so local dev/build works.
const storagePlugins: Plugin[] = process.env.S3_BUCKET
  ? [
      s3Storage({
        // Upload directly from the browser to R2 via a presigned URL. This
        // bypasses Vercel's 4.5MB serverless request-body limit, which otherwise
        // breaks uploads of normal-sized photos. Requires CORS (PUT) on the
        // bucket allowing the site origin — see README.
        clientUploads: true,
        collections: {
          media: {
            prefix: 'media',
            // Serve images straight from the R2 public domain (zero egress).
            generateFileURL: ({ filename, prefix }) => {
              const key = prefix ? `${prefix}/${filename}` : filename
              return publicBase ? `${publicBase}/${key}` : `/${key}`
            },
          },
        },
        bucket: process.env.S3_BUCKET as string,
        config: {
          endpoint: process.env.S3_ENDPOINT,
          region: 'auto',
          forcePathStyle: true,
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
          },
        },
      }),
    ]
  : []

// Same-origin only in production; allow localhost during development.
const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || ''
const allowedOrigins = [serverURL, 'http://localhost:3000'].filter(Boolean)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  serverURL: serverURL || undefined,
  collections: [Users, Media, Sections, Pages, Blog, Submissions],
  globals: [Settings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  // Cap uploads at 10 MB.
  upload: {
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  },
  // Restrict CORS/CSRF to the site's own domain (plus localhost for dev).
  cors: allowedOrigins,
  csrf: allowedOrigins,
  // The frontend uses the local API, not GraphQL — disable it entirely.
  graphQL: {
    disable: true,
  },
  plugins: [...storagePlugins],
})
