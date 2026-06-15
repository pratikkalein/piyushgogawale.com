# piyushgogawale.com

Editorial, gallery-first photography portfolio with a self-serve CMS, in the
Mistral visual language (see `DESIGN.md`).

**Stack:** Next.js (App Router) + Payload CMS 3 · Neon Postgres · Cloudflare R2
image storage · FormSubmit contact email · Tailwind v4 · deployed on Vercel.

---

## Local development

```bash
pnpm install
cp .env.example .env        # fill in real values (see below)
pnpm payload migrate        # create the schema in your database
pnpm dev                    # http://localhost:3000  (admin at /admin)
```

On first run, open `/admin` and create the owner account. Public
self-registration is disabled afterward.

If `S3_*` is not set, Payload falls back to local disk storage so you can develop
without Cloudflare R2.

## Environment variables

See `.env.example`. Summary:

| Variable | Purpose |
|---|---|
| `DATABASE_URI` | Neon pooled Postgres connection string |
| `PAYLOAD_SECRET` | Long random string (`openssl rand -base64 32`) |
| `NEXT_PUBLIC_SERVER_URL` | Public site URL (CORS/CSRF + absolute links) |
| `S3_BUCKET` / `S3_ENDPOINT` / `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` | Cloudflare R2 |
| `NEXT_PUBLIC_R2_PUBLIC_URL` | Public image delivery base (r2.dev or custom domain) |
| `CONTACT_ALIAS` | FormSubmit alias (server-only) — see below |

## Accounts to create (one-time, Phase 0)

1. **Neon** — create a project, copy the pooled connection string → `DATABASE_URI`.
2. **Cloudflare R2** — create a bucket; create an R2 API token (Access Key ID +
   Secret); note the S3 endpoint `https://<accountid>.r2.cloudflarestorage.com`;
   enable public access (r2.dev URL or custom domain) → `NEXT_PUBLIC_R2_PUBLIC_URL`.
3. **Vercel** + an empty GitHub repo (this one).
4. **FormSubmit** — no signup; you just need the photographer's email.

## Content model

Collections: `media`, `sections`, `pages`, `blog`, `submissions`, `users`.
Global: `settings` (title, nav, social).

The home carousel is driven by **sections** where `featured` is ticked, ordered
by `order`. Create a section, tick featured, set order — it appears on the home
page linking to its gallery. No code needed.

## Migrations

Schema changes are tracked in `src/migrations/`.

```bash
pnpm payload migrate:create <name>   # generate a migration after changing fields
pnpm payload migrate                 # apply pending migrations
```

On Vercel, the `vercel-build` script runs `payload migrate` automatically before
`next build`, so migrations apply on every deploy.

## Deploy to Vercel (Phase 9)

1. Push to GitHub and import the repo into Vercel (use **Pro** for a commercial site).
2. Add every variable from `.env.example` as encrypted env vars in Vercel.
3. Deploy. The build runs migrations, so the Neon schema is created on first deploy.
4. Verify: `/admin` login, image upload lands in R2 and renders, a featured
   section shows in the home carousel, a contact submission saves + emails, and
   security headers are present (`curl -I https://yourdomain`).

## Image uploads (client uploads + R2 CORS) — required

Vercel serverless functions reject request bodies over **4.5MB**, so normal-sized
photos can't be uploaded through the server. The S3 plugin is configured with
`clientUploads: true`, so the browser uploads **directly to R2** via a presigned
URL, bypassing that limit.

For this to work you must add a **CORS policy** to the R2 bucket allowing `PUT`
from your site. In Cloudflare → R2 → your bucket → **Settings → CORS Policy**,
add (replace origins with your real domains):

```json
[
  {
    "AllowedOrigins": [
      "https://piyushgogawale.com",
      "https://www.piyushgogawale.com",
      "http://localhost:3000"
    ],
    "AllowedMethods": ["GET", "PUT", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

Without this, uploads fail with a CORS error in the browser console. (The app's
CSP already permits the browser to connect to the R2 endpoints.)

## Activate FormSubmit (once, after deploy)

1. Set `CONTACT_ALIAS` to the photographer's raw email and deploy.
2. Submit the contact form once live.
3. FormSubmit emails a confirmation — click it.
4. Copy the **random alias** FormSubmit returns and set `CONTACT_ALIAS` to that
   alias (not the raw email) so the address stays private. Redeploy.

Submissions are always saved to the `submissions` collection too, so there is a
record even if an email is missed.

## Security notes

- Auth throttling (`maxLoginAttempts`/`lockTime`), httpOnly + secure cookies, no
  public registration.
- Public REST can read published content but cannot write; submissions are
  admin-only and written server-side via the local API.
- `/api/contact` validates, strips HTML, and rate-limits by IP.
- CSP + HSTS + X-Frame-Options + X-Content-Type-Options + Referrer-Policy +
  Permissions-Policy set in `next.config.ts`.
- CORS/CSRF restricted to the site origin; GraphQL disabled; no secrets in
  `NEXT_PUBLIC_` vars except the intentionally-public R2 URL and server URL.

See `HANDOFF.md` for the non-technical photographer guide.
