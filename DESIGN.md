---
name: Monochrome Gallery
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#4c4546'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e1dfdf'
  on-secondary-container: '#626263'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1b1b'
  on-tertiary-container: '#848484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#e4e2e2'
  secondary-fixed-dim: '#c7c6c6'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#464747'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1b1b1b'
  on-tertiary-fixed-variant: '#474747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 84px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-md-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.15em
  nav-link:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
spacing:
  sidebar-width: 240px
  gutter: 32px
  margin-desktop: 64px
  margin-mobile: 24px
  stack-xl: 128px
  stack-md: 48px
---

## Brand & Style

The design system is built for high-end photography portfolios, prioritizing the image as the sole focus. The brand personality is silent, authoritative, and sophisticated, acting as a digital white-cube gallery. 

The aesthetic is **Minimalist with a High-Contrast/Editorial edge**. By stripping away color and excessive UI decoration, the design system creates a premium atmosphere where whitespace functions as a structural element rather than empty space. The emotional response is one of calm, focus, and artistic prestige.

- **Primary Motif:** Strict monochromaticity.
- **Visual Weight:** Heavy reliance on thin lines and large-scale typography.
- **Navigation:** A persistent, minimal vertical anchor that recedes to allow content to breathe.

## Colors

This design system utilizes a binary color logic. Black is used for all primary communication, structural borders, and intent. White is the foundation, providing the expansive "gallery wall" effect.

- **Primary (#000000):** Used for typography, icons, and hairline borders.
- **Secondary (#707070):** Used for meta-data, secondary labels, and disabled states to maintain legibility without competing for attention.
- **Neutral (#FFFFFF):** The canvas. No off-whites or creams are used; the white must be clinical and pure.
- **Accent (#F5F5F5):** Reserved exclusively for subtle hover states or container backgrounds where slight separation from the canvas is required.

## Typography

Typography follows an editorial hierarchy. **Playfair Display** provides a timeless, high-contrast serif look for titles and large expressive statements. **Inter** provides a functional, utilitarian counterpoint for navigation and long-form descriptions.

- **Display Text:** Used for project titles. Tight kerning and large scale are required.
- **Label Caps:** Used for navigation items and image metadata (e.g., ISO, Lens data). Always uppercase with generous letter spacing to evoke a catalog-style feel.
- **Paragraphs:** Kept to narrow measure (max-width 60ch) to maintain readability within the vast whitespace.

## Layout & Spacing

The layout uses a **Fixed Sidebar Grid** on desktop and a **Fluid Margin Grid** on mobile. 

- **Sidebar:** A fixed 240px left column contains the brand mark and primary navigation. Content is offset by this width plus the margin.
- **Desktop Grid:** A 12-column grid with wide 32px gutters. Images should often span asymmetrical column counts (e.g., 5 columns or 7 columns) to create dynamic tension.
- **Vertical Rhythm:** Large vertical gaps (`stack-xl`) separate different projects or sections, ensuring each piece of work is viewed in isolation.
- **Mobile:** The sidebar collapses into a top-fixed bar or hidden drawer, and margins tighten to 24px to maximize screen real estate for imagery.

## Elevation & Depth

This design system is strictly **Flat with Low-Contrast Outlines**. There are no shadows. 

- **Tiers:** Depth is communicated through stacking order and hairline borders (1px) rather than light and shadow.
- **Borders:** Use `#000000` at 10% opacity for subtle divisions, or 100% opacity for strong structural framing.
- **Overlays:** When modals or image lightboxes are active, use a solid white or black backdrop (95% opacity) to completely isolate the content from the background.

## Shapes

The shape language is **Strictly Sharp (0px)**. 

Every UI element—including buttons, input fields, image containers, and hover states—must have 90-degree corners. This reinforces the architectural and clinical feel of a high-end art gallery. Circles are permitted only for specific functional icons (e.g., a play button) but should be avoided for structural containers.

## Components

### Buttons
Primary buttons are solid black rectangles with white `label-caps` text. Secondary buttons use a 1px black outline. Hover states involve a simple color inversion (Black becomes White/Outline).

### Input Fields
Minimalist underlines (1px black) instead of full boxes. Placeholders use the secondary gray color in `body-md` typography.

### Navigation (Fixed Sidebar)
Links are stacked vertically. The active state is indicated by a small horizontal line (16px width) to the left of the text or a shift to bold weight. Labels use `nav-link` tokens.

### Cards & Image Containers
Images never have shadows. They are either full-bleed within their grid columns or framed with a 1px border. Captions appear below the image in `label-caps` for metadata or `body-md` for descriptions.

### Progress & Loading
A thin (2px) black line at the very top of the viewport. No "spinners"; use linear transitions to maintain the minimalist horizontal/vertical axis of the design system.
