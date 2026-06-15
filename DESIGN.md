# DESIGN.md — Photographer Portfolio (Mistral visual language)

Adapts Mistral AI's editorial sunset design system to a minimal, gallery-first photographer site. Keeps Mistral's signatures (cream + sunset palette, PP Editorial Old over Inter, sober editorial geometry, and the sunset stripe band at every page foot) and maps them onto this site's real surfaces: home carousel, gallery sections, blog, and contact. Marketing-only Mistral components (pricing tiers, code blocks, IDE mockups, app-store badges) are intentionally omitted.

## Overview

The site opens with a full-bleed photo carousel, an editorial near-serif title set over the imagery, and quiet warm-neutral chrome. Every page closes with the horizontal sunset stripe gradient just above the footer. Cream-yellow surfaces anchor the contact form and feature cards; saturated orange carries the single primary action per view. Cards use 12px corners, buttons 8px. No pill buttons. The photography carries the visual weight; the system stays flat with strategic depth from images.

**Key characteristics**
- Full-bleed photographic hero carousel with editorial title overlay
- Horizontal sunset stripe band (orange to cream) at every page bottom
- Cream-yellow surfaces for the contact form and feature cards
- PP Editorial Old for display, Inter for everything else
- 8px buttons, 12px cards, sober editorial geometry
- Saturated orange reserved for the primary CTA and active states only

## Colors

Concrete values are approximations true to Mistral's sunset palette. Token names are used everywhere else in this doc.

### Brand and accent
- primary (Mistral Orange) `#FF4F00` — primary CTA, active states, link color
- primary-deep `#E03E00` — pressed and emphasis
- sunshine-300 `#FFC56B` — light atmospheric orange-yellow
- sunshine-500 `#FF9A3D` — mid sunset orange
- sunshine-700 `#FF6F1F` — saturated mid gradient stop
- sunshine-800 `#F2530A` — deep gradient stop
- sunshine-900 `#D6400A` — deepest sunset orange
- yellow-saturated `#FFC400` — pure brand yellow in the stripe

### Cream and warm neutral
- cream `#FBF3E2` — form panels, feature cards, footer
- cream-soft `#FEFAF1` — lighter cream
- cream-deeper `#F3E6CC` — badge and tag chips
- beige-deep `#E7D9BE` — 1px border on cream

### Surface
- canvas `#FFFFFF` — page background and card surface
- surface `#FAFAF8` — quieter background
- surface-cream `#FBF3E2` — cream-tinted surface
- hairline `#E5E1D8` — 1px borders
- hairline-soft `#EFEBE2` — quieter dividers
- hairline-strong `#D8D2C5` — input borders

### Text
- ink `#1A1A17` — headlines and body
- ink-tint `#2A2A26` — hero overlay text
- charcoal `#33332E` — body emphasis
- slate `#5C5C54` — secondary text
- steel `#7A7A70` — tertiary, captions
- stone `#9A9A8E` — muted labels
- muted `#B8B8AC` — disabled, placeholders
- on-dark `#FFFFFF` — text on dark or photographic surfaces
- on-dark-muted `rgba(255,255,255,0.72)` — reduced white
- on-cream `#1A1A17` — ink on cream
- on-primary `#FFFFFF` — text on orange

### Semantic
- link `#FF4F00` — inline links (matches primary)

## Typography

### Font family
- **PP Editorial Old** (display): signature near-serif for hero titles, section openers, large numerals. Fallbacks: 'Times New Roman', Georgia, serif. If PP Editorial Old is not licensed, substitute **Fraunces** (free, Google Fonts, opsz axis) for the same editorial character. Do not substitute with Inter.
- **Inter** (UI prose): body, nav, buttons, labels, captions. Fallbacks: ui-sans-serif, system-ui, -apple-system, sans-serif.

### Hierarchy

| Token | Size | Weight | Line height | Tracking | Family | Use |
|---|---|---|---|---|---|---|
| hero-display | 84px | 400 | 1.05 | -1.5px | PP Editorial Old | Home title over carousel |
| display-lg | 64px | 400 | 1.10 | -1px | PP Editorial Old | Section openers |
| heading-1 | 52px | 400 | 1.15 | -0.5px | PP Editorial Old | Page headlines (About, Contact) |
| heading-2 | 36px | 500 | 1.20 | -0.5px | Inter | Subsection headlines |
| heading-3 | 28px | 500 | 1.25 | 0 | Inter | Card and gallery titles |
| heading-4 | 22px | 500 | 1.30 | 0 | Inter | Feature tile titles |
| heading-5 | 18px | 500 | 1.40 | 0 | Inter | Smaller card titles |
| subtitle | 18px | 400 | 1.50 | 0 | Inter | Hero subtitle, lead body |
| body-md | 16px | 400 | 1.55 | 0 | Inter | Primary body |
| body-md-medium | 16px | 500 | 1.55 | 0 | Inter | Body emphasis |
| body-sm | 14px | 400 | 1.50 | 0 | Inter | Secondary body |
| body-sm-medium | 14px | 500 | 1.50 | 0 | Inter | Button labels, active nav |
| caption | 13px | 400 | 1.40 | 0 | Inter | Helper text |
| caption-bold | 13px | 600 | 1.40 | 0 | Inter | Badge labels |
| micro | 12px | 500 | 1.40 | 0 | Inter | Footer microcopy |
| micro-uppercase | 11px | 600 | 1.40 | 1px | Inter | Section eyebrows |
| button-md | 14px | 500 | 1.30 | 0 | Inter | Buttons |

### Principles
- Editorial and sans pairing: PP Editorial Old anchors display, Inter carries the rest. The contrast is the voice.
- Generous body leading (1.55) for readability; tight hero leading (1.05) for magazine-grade display.
- Negative tracking scales with size: -1.5px at hero down to 0 on small text.

## Layout

### Spacing
Base unit 4px. Tokens: xxs 4, xs 8, sm 12, md 16, lg 20, xl 24, xxl 32, xxxl 40, section-sm 48, section 64, section-lg 96, hero 120 (px).
- Content pages use section (64px) rhythm; the home page uses section-lg (96px).
- Card padding: xl (24px) compact, xxl (32px) for feature and form panels.

### Grid and container
- Max content width 1280px with 32px gutters.
- Home: full-bleed carousel, then a section index grid below.
- Gallery section page: responsive masonry or even grid of photos.
- About: single column, ~720px measure.
- Contact: single column, cream form panel centered, ~520px max-width.
- Blog list: single or 2-column cards; post page single column ~720px.

### Whitespace
Imagery fills the frame; chrome stays quiet. Hero uses generous vertical space; the contact panel tightens to xxl (32px) padding with md (16px) field gaps.

## Elevation

Predominantly flat; depth comes from photography.

| Level | Treatment | Use |
|---|---|---|
| 0 flat | no shadow, hairline-soft border | default cards, inputs, gallery tiles |
| 1 subtle | `rgba(0,0,0,0.04) 0 1px 2px` | gently raised tiles |
| 2 card | `rgba(0,0,0,0.04) 0 4px 12px` | feature cards |
| 3 image | `rgba(0,0,0,0.08) 0 12px 24px -4px` | framed image panels |
| 4 modal | `rgba(0,0,0,0.12) 0 16px 48px -8px` | lightbox, dropdowns |

## Shapes

| Token | Value | Use |
|---|---|---|
| rounded-xs | 4px | small chips |
| rounded-sm | 6px | compact badges |
| rounded-md | 8px | buttons, inputs, search |
| rounded-lg | 12px | cards, panels, image frames (dominant) |
| rounded-xl | 16px | larger feature panels |
| rounded-full | 9999px | badges and rare pill tabs only |

Buttons are 8px, cards 12px. Mistral does not use pill buttons; rounded-full is for badges only. Full-bleed carousel imagery has no internal framing; gallery thumbnails use rounded-lg.

## Components

Hover states are not documented per the source policy; default and pressed/active only.

### Buttons
- **button-primary** — orange CTA. bg primary, text on-primary, button-md, padding `10px 20px`, rounded-md. Pressed: bg primary-deep. Disabled: bg hairline, text muted.
- **button-dark** — dark CTA on cream surfaces. bg ink, text on-dark, padding `10px 20px`, rounded-md. Used as the contact form submit.
- **button-cream** — warm secondary on cream sections. bg cream, text ink, border 1px beige-deep, rounded-md.
- **button-secondary** — outlined. transparent bg, text ink, border 1px hairline-strong, rounded-md.
- **button-link** — inline orange text link, body-sm-medium, underline on activation.

### Cards and containers
- **card-base** — bg canvas, rounded-lg, padding xl, border 1px hairline-soft.
- **card-feature** — bg canvas, rounded-lg, padding xxl, border 1px hairline-soft.
- **card-cream** — bg cream, text ink, rounded-lg, padding xxl, border 1px beige-deep. For feature callouts and the About sidebar.
- **card-photographic** — bg surface dark, padding 0, image fills, rounded-lg. For section covers and blog covers.

### Photographer-specific
- **hero-carousel** — full-bleed photographic carousel of featured section covers. Editorial title in hero-display (on-dark or ink-tint depending on image), optional subtitle in subtitle. Keyboard and swipe nav, quiet dot indicators. Each slide links to its section. The sunset gradient may tint the title scrim: `linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(214,64,10,0.35) 100%)`.
- **section-index-tile** — card on the home page below the carousel linking to a gallery section. bg canvas, rounded-lg, cover image top (card-photographic), title heading-3, intro body-sm steel, border 1px hairline-soft.
- **gallery-grid** — responsive grid of photos inside a section. Even or masonry, gap md, each item rounded-lg, flat (level 0).
- **photo-tile** — single gallery image. rounded-lg, object-fit cover, opens the lightbox on activation.
- **lightbox** — full-screen image viewer (level 4). Dark scrim `rgba(0,0,0,0.92)`, on-dark controls, caption in body-sm on-dark-muted. Uses yet-another-react-lightbox.
- **blog-card** — bg canvas, rounded-lg, padding xl, border 1px hairline-soft. Cover (card-photographic) top, title heading-4, date caption steel.

### Inputs and forms
- **text-input** — bg canvas, text ink, border 1px hairline-strong, rounded-md, padding `sm md`, height 44px. Focus: border 2px primary.
- **text-area** — bg canvas, border 1px hairline-strong, rounded-md, padding md.
- **contact-form-panel** — cream form container. bg cream, rounded-lg, padding xxl, border 1px beige-deep. Hosts inputs, text-area, submit button-dark.

### Badges
- **badge-orange** — bg primary, text on-primary, caption-bold, rounded-full, padding `4px 10px`.
- **badge-cream** — bg cream-deeper, text ink, caption-bold, rounded-full, padding `4px 10px`.

### Navigation
- **top-nav** — sticky bar. bg canvas, height ~64px, bottom border 1px hairline-soft. Left: site wordmark + links (Work, Blog, About). Right: Contact as a button-primary or button-dark. Collapses to a hamburger below 1024px.

### Signature components
- **sunset-stripe-band** — horizontal closing band above the footer on EVERY page. Multi-stop gradient: primary → sunshine-700 → sunshine-500 → yellow-saturated → cream. Padding `lg 0`, full width. The brand's most recognizable element; never drop it.
- **cta-banner-cream** — page-bottom CTA band. bg cream, text ink, rounded-lg, padding section. Headline in heading-1 (PP Editorial Old), one button below. Used above the footer on the home and about pages.
- **footer-region** — cream-tinted footer. bg cream, padding `section xxl`. Columns: navigation, social, and the site wordmark. Footer links in body-sm, text primary.

## Do's and Don'ts

### Do
- Reserve primary orange for the single primary CTA per view and active states.
- Place the sunset stripe band at the foot of every page.
- Pair PP Editorial Old (or Fraunces) with Inter; never swap either for a generic alternative.
- Apply rounded-md (8px) to buttons and rounded-lg (12px) to cards and image frames.
- Use cream surfaces for the contact panel, feature cards, and footer.
- Let full-bleed photography carry the hero; keep chrome quiet.

### Don't
- No pill-shaped buttons; geometry stays sober and editorial.
- No accent colors beyond the orange, yellow, cream sunset palette.
- Do not reduce hero leading below 1.05.
- Do not replace the editorial display face with Inter.
- Do not apply heavy shadows to flat cards; reserve elevation for the lightbox and framed images.
- Do not drop the sunset stripe band from any page.

## Responsive

| Name | Width | Key changes |
|---|---|---|
| Mobile small | < 480px | Single column. Hero title 40px. Nav to hamburger. Gallery 1 to 2 up. |
| Mobile large | 480 to 767px | Gallery 2 up. Hero 52px. |
| Tablet | 768 to 1023px | 2-column grids. Hero 64px. |
| Desktop | 1024 to 1279px | Multi-column. Hero 76px. |
| Wide | >= 1280px | Full 84px hero. |

- Touch targets: buttons and inputs render at 44px height.
- Carousel: full-bleed across all breakpoints; controls enlarge on mobile.
- Footer: multi-column to single-column accordion on mobile.
- Sunset stripe band stays full width on all breakpoints.
- Photography uses 16:9 for the hero, native ratios in galleries with consistent gaps.

## Notes and known gaps

- No dark mode palette is defined; the system is light-first.
- Transition timing not specified; use 150 to 200ms ease for focus and active transitions.
- PP Editorial Old is a licensed font. Use Fraunces (free) if a license is not in place.
- Sunset gradient stops are approximations; keep the visual rhythm consistent even if exact stops shift slightly.
