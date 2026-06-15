# Photographer Portfolio: Build Plan and Claude Code Prompts

An editorial, gallery-first photography site with a self-serve CMS, styled in the Mistral visual language (see DESIGN.md).

## Final stack

- Next.js (App Router) with Payload CMS 3.x in one repo
- Database: Neon Postgres (free tier)
- Image storage: Cloudflare R2 via Payload's S3-compatible adapter (zero egress, 10 GB free)
- Contact form: saved to the CMS and forwarded to email via FormSubmit, through a server route
- Host: Vercel (use Pro at 20 USD/mo if this is a commercial/business site)
- Styling: Tailwind, following DESIGN.md (Mistral look: cream + sunset orange, PP Editorial Old over Inter)

## CMS structure (simple naming)

Collections:
- media: file, alt
- sections: title, slug, cover, intro, photos, featured (checkbox), order (number)
- pages: title, slug, content
- blog: title, slug, cover, body, date, status (draft or published)
- submissions: name, email, message, date (contact form entries)
- users: built-in admin login

Global:
- settings: title, nav (array of label + href), social (array of label + url)

The carousel is driven by sections where featured is true, ordered by order. The photographer creates a section, ticks featured, and it appears on the home page linking to its own gallery. No code needed.

Frontend routes:
- `/` home carousel of featured section covers
- `/sections/[slug]` gallery grid with lightbox
- `/[slug]` dynamic pages (About)
- `/blog` and `/blog/[slug]`
- `/contact` form that stores in the CMS and emails

---

## Phase 0: Accounts and local setup (do this first, manually)

Create these and collect the keys before running any prompt:

1. Neon: create a project, copy the pooled connection string. This is `DATABASE_URI`.
2. Cloudflare R2: create a bucket. Create an R2 API token (Access Key ID + Secret). Note the S3 endpoint `https://<accountid>.r2.cloudflarestorage.com`. Enable public access on the bucket (r2.dev URL or a custom domain) so images serve directly.
3. Vercel account + an empty GitHub repo.
4. FormSubmit: have the photographer's email ready. No signup needed.
5. Local tools: Node 20+ and pnpm (`npm i -g pnpm`).

Environment variables you will use:

```
DATABASE_URI=postgres://...        # Neon pooled string
PAYLOAD_SECRET=                    # long random string
S3_BUCKET=                         # R2 bucket name
S3_ENDPOINT=https://<accountid>.r2.cloudflarestorage.com
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
NEXT_PUBLIC_R2_PUBLIC_URL=         # public r2.dev or custom domain base URL
CONTACT_ALIAS=                     # FormSubmit alias, server-only (set in Phase 6)
```

Note: the contact alias is intentionally not a NEXT_PUBLIC var, so the email target is never exposed to the browser.

---

## Phase 1: Scaffold the project

> Create a new Payload CMS 3 project using the blank template with the Postgres adapter and pnpm. Run `pnpx create-payload-app@latest -t blank --db postgres` into a folder named `photo-portfolio`. After it scaffolds, install Tailwind CSS and configure it for the Next.js App Router. Add `yet-another-react-lightbox` for galleries. Confirm the dev server runs and the /admin panel loads with a first user signup screen. Do not build any custom UI yet. Report the folder structure of `src` when done.

---

## Phase 2: Wire up Neon and Cloudflare R2

> Configure the project for production storage. 1) In `payload.config.ts`, ensure the postgres adapter reads its connection string from `process.env.DATABASE_URI`. 2) Install `@payloadcms/storage-s3` and add the s3Storage plugin pointed at Cloudflare R2 for the media collection, using these env vars: `S3_BUCKET`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`. Set `region: 'auto'` and `forcePathStyle: true` since this is R2. 3) Configure the media collection so served image URLs use `NEXT_PUBLIC_R2_PUBLIC_URL` as the base for public delivery. Create a `.env.example` listing every variable. Verify by uploading a test image in /admin and confirming it lands in the R2 bucket and renders from the public URL.

---

## Phase 3: Content model

> Define the content model in Payload using simple lowercase collection slugs. Create:
> - media: upload-enabled, with a required `alt` text field. Restrict uploads to image mime types only and cap file size at 10 MB. Generate image sizes named thumb, card, and full.
> - sections: `title` (text, required), `slug` (text, unique, auto-generated from title), `cover` (relationship to media, required), `intro` (textarea), `photos` (array of relationships to media), `featured` (checkbox, default false), `order` (number).
> - pages: `title`, `slug` (unique), `content` (rich text).
> - blog: `title`, `slug` (unique), `cover` (relationship to media), `body` (rich text), `date` (date), `status` (select: draft, published; default draft).
> - submissions: `name` (text), `email` (text), `message` (textarea), `date` (date, defaults to now). This stores contact form entries.
> Add slug auto-generation hooks where slugs are used. Add the `settings` global with `title`, `nav` (array of label + href), and `social` (array of label + url). Run a migration so the Neon schema is created.

---

## Phase 4: Access control

> Set access control so the public can read published content but cannot write anything.
> - media, sections, pages: read is public; create, update, delete require an authenticated user.
> - blog: read is public only when `status` is published, otherwise admin-only; write requires auth.
> - submissions: create, read, update, delete are all admin-only. The contact route will write to this collection server-side using the Payload local API, so no public write access is needed or granted.
> - users stays auth-protected.
> Confirm an unauthenticated REST request can read published content, cannot write anything, and cannot read or create submissions directly.

---

## Phase 5: Frontend pages

> Build the public frontend with the Next.js App Router, fetching data via Payload's local API (not HTTP). Pages:
> - `/` Home: fetch sections where `featured` is true, sorted by `order` ascending. Render a full-bleed carousel of their covers. Each slide links to `/sections/[slug]`. Use a minimal custom carousel (keyboard + swipe), no heavy library.
> - `/sections/[slug]`: fetch the section, show `intro` and a responsive grid of `photos`. Clicking a photo opens a lightbox using `yet-another-react-lightbox`.
> - `/[slug]`: fetch a matching page and render its rich text. Handle 404 cleanly.
> - `/blog`: list published blog entries, newest first, with cover and title. `/blog/[slug]`: render a single published entry.
> - Shared layout: a thin top nav (site title plus links to blog, about, contact) pulled from the `settings` global, and a minimal footer.
> Use Next.js Image with the R2 public domain in `next.config.js` remotePatterns. Add on-demand revalidation so new CMS content appears without a redeploy.

---

## Phase 6: Contact form, stored in CMS and emailed

> Build the contact feature so submissions are both saved in the CMS and emailed, without exposing the email address to the browser.
> 1) Page `/contact` is a client component with name, email, and message fields, plus a hidden honeypot field. On submit it POSTs JSON to an internal route `/api/contact` and shows inline success and error states. It does not call FormSubmit directly.
> 2) Create a Next.js route handler at `/api/contact` (server-side). It must: validate inputs (required fields, valid email, length caps, reject if the honeypot is filled), save a record to the `submissions` collection via the Payload local API, then forward the message to FormSubmit by POSTing server-side to `https://formsubmit.co/ajax/<CONTACT_ALIAS>` using the server-only `CONTACT_ALIAS` env var. Return a clean JSON result.
> Keep the FormSubmit alias and all email config server-side only.

After this builds, activate FormSubmit once: trigger one live submission, click the confirmation email FormSubmit sends to the photographer, then copy the random alias string it returns into `CONTACT_ALIAS`. Using the alias rather than the raw email keeps the address private.

---

## Phase 7: Security hardening

> Harden the app. Apply all of the following:
> - Auth: ensure `PAYLOAD_SECRET` is a long random value. Set Payload auth `maxLoginAttempts` and `lockTime` to throttle brute force. Do not allow public self-registration; only the seeded owner account exists. Keep auth cookies httpOnly, secure, and sameSite.
> - Submissions safety: confirm public REST cannot create submissions; only the `/api/contact` server route writes them via local API. Server-side validate and sanitize all contact inputs (trim, length limits, strip HTML, validate email). Add basic rate limiting to `/api/contact` keyed by IP to slow spam.
> - Uploads: media accepts image mime types only, with the size cap from Phase 3.
> - Headers: in `next.config.js`, add security headers: Content-Security-Policy (allow self, the R2 public domain, and the admin panel needs), X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Strict-Transport-Security, and a restrictive Permissions-Policy.
> - Payload API surface: restrict CORS and CSRF to the site's own production domain. Disable the GraphQL playground in production. If GraphQL is unused, disable it.
> - Secrets: confirm no secret is exposed via a NEXT_PUBLIC_ variable.
> - Dependencies: run an audit and update vulnerable packages.
> Report what was changed in each area.

---

## Phase 8: Styling per DESIGN.md (Mistral look)

> Style the site strictly following DESIGN.md in the repo root. Set up the cream and sunset-orange palette as Tailwind theme tokens (primary, sunshine, cream, ink, and the rest), and load the fonts: PP Editorial Old for display (or Fraunces from Google Fonts if PP Editorial Old is not licensed) and Inter for UI. Apply the components as specified: orange primary CTAs, cream contact panel and feature cards, 8px buttons and 12px cards, editorial near-serif headlines over Inter body. Build the two brand signatures exactly: the full-bleed hero carousel with an editorial title overlay, and the sunset-stripe-band at the foot of every page above the footer. Keep the system flat with depth only on the lightbox and framed images. Ensure full responsiveness per the breakpoints in DESIGN.md. Keep the admin panel default.

---

## Phase 9: Deploy to Vercel

> Prepare for Vercel deployment. Push the repo to GitHub, import it into Vercel, and add every variable from `.env.example` in the Vercel project settings (as encrypted env vars). Add the R2 public domain to `next.config.js` image remotePatterns. Ensure the postgres migration runs on first deploy. After deploy, verify: /admin login works, an uploaded image stores in R2 and renders, a featured section shows in the home carousel, a contact submission saves in the CMS and arrives by email, and security headers are present. Note: if this is a commercial site, the Vercel Hobby plan is non-commercial only, so use Vercel Pro.

---

## Phase 10: Handoff doc for the photographer

> Write a short, non-technical guide (one page, markdown) explaining how to: log in at /admin, create a new gallery section and upload photos, mark a section to appear in the home carousel and set its order, edit the About page, publish a blog entry, and view contact submissions. Keep language simple and app-friendly.

---

## Notes

- Image weight matters: have the photographer export web-sized images (long edge ~2000px) to stay comfortably inside R2's 10 GB free storage.
- R2 has no egress fees, so gallery traffic will not generate surprise storage bills. Vercel bandwidth still applies for anything served through the app, so prefer direct R2 public URLs for images.
- Contact submissions are stored in the `submissions` collection and also emailed, so the photographer has a record even if an email is missed.
