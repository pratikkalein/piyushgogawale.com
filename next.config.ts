import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

// Derive the R2 public image host from the env var, if present.
const r2Url = process.env.NEXT_PUBLIC_R2_PUBLIC_URL
let r2Host: string | undefined
try {
  if (r2Url) r2Host = new URL(r2Url).hostname
} catch {
  r2Host = undefined
}

const imgSrc = ["'self'", 'data:', 'blob:', r2Host ? `https://${r2Host}` : '']
  .filter(Boolean)
  .join(' ')

// CSP permissive enough for the Payload admin (inline styles, eval, blob workers)
// while restricting the public surface.
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' 'unsafe-eval'`,
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
  `img-src ${imgSrc}`,
  `font-src 'self' data: https://fonts.gstatic.com`,
  `connect-src 'self'`,
  `media-src 'self' ${r2Host ? `https://${r2Host}` : ''}`.trim(),
  `frame-ancestors 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
]

const nextConfig: NextConfig = {
  images: {
    localPatterns: [{ pathname: '/api/media/file/**' }],
    remotePatterns: r2Host ? [{ protocol: 'https', hostname: r2Host }] : [],
  },
  // Load sharp from node_modules at runtime (not bundled)...
  serverExternalPackages: ['sharp'],
  // ...and force the linux-x64 (glibc) sharp binary + libvips .so into the
  // serverless function. Next's tracing misses these because they're dlopen'd,
  // causing "libvips-cpp.so: cannot open shared object file" on Vercel.
  outputFileTracingIncludes: {
    '/**': [
      './node_modules/@img/sharp-linux-x64/**',
      './node_modules/@img/sharp-libvips-linux-x64/**',
    ],
  },
  // Keep functions under Vercel's 250MB unzipped limit: drop build-only tooling
  // and sharp binaries for platforms the Vercel runtime (linux-x64 glibc) never
  // uses. None of these are needed at request time.
  outputFileTracingExcludes: {
    '/**': [
      'node_modules/typescript/**',
      'node_modules/drizzle-kit/**',
      'node_modules/esbuild/**',
      'node_modules/@esbuild/**',
      'node_modules/monaco-editor/**',
      'node_modules/@img/sharp-darwin*/**',
      'node_modules/@img/sharp-libvips-darwin*/**',
      'node_modules/@img/sharp-win32*/**',
      'node_modules/@img/sharp-linuxmusl*/**',
      'node_modules/@img/sharp-libvips-linuxmusl*/**',
      'node_modules/@img/sharp-linux-arm64*/**',
      'node_modules/@img/sharp-libvips-linux-arm64*/**',
    ],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
