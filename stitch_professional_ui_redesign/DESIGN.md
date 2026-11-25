---
name: Campus Exchange System
colors:
  surface: '#f9f9ff'
  surface-dim: '#d4daea'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e8eefe'
  surface-container-high: '#e3e8f9'
  surface-container-highest: '#dde2f3'
  on-surface: '#161c27'
  on-surface-variant: '#3c4a42'
  inverse-surface: '#2a303d'
  inverse-on-surface: '#ecf0ff'
  outline: '#6c7a71'
  outline-variant: '#bbcabf'
  surface-tint: '#006c49'
  primary: '#006c49'
  on-primary: '#ffffff'
  primary-container: '#26c289'
  on-primary-container: '#004930'
  inverse-primary: '#4edea3'
  secondary: '#5347cb'
  on-secondary: '#ffffff'
  secondary-container: '#6c62e5'
  on-secondary-container: '#fffbff'
  tertiary: '#5d5c76'
  on-tertiary: '#ffffff'
  tertiary-container: '#aaa8c6'
  on-tertiary-container: '#3e3d56'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#6ffbbd'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#e3dfff'
  secondary-fixed-dim: '#c5c0ff'
  on-secondary-fixed: '#130067'
  on-secondary-fixed-variant: '#3d2eb5'
  tertiary-fixed: '#e2dfff'
  tertiary-fixed-dim: '#c6c3e2'
  on-tertiary-fixed: '#1a1930'
  on-tertiary-fixed-variant: '#45445e'
  background: '#f9f9ff'
  on-background: '#161c27'
  surface-variant: '#dde2f3'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 3.5rem
    fontWeight: '700'
    lineHeight: 4rem
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 2rem
    fontWeight: '600'
    lineHeight: 2.5rem
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.01em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: 0em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.625rem
    letterSpacing: 0em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
    letterSpacing: 0em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.6875rem
    fontWeight: '600'
    lineHeight: 0.875rem
    letterSpacing: 0.06em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2rem
  margin-sm: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system targets modern university students, faculty, and academic communities. The personality is vibrant yet academically disciplined, trustworthy, and effortlessly organized. The visual language dispels the cluttered, chaotic nature of legacy classifieds and campus pinboards, replacing it with an airy, welcoming sanctuary that feels as refined as modern editorial fintech, yet casual enough for textbook trades and peer-to-peer apartment sublets.

The core aesthetic combines **Minimalism** with subtle **Tactile / Crisp Edge** layering:
- Generous breathing space and pristine white and light-tint surfaces allow listings to stand out without cognitive overload.
- Purposeful micro-accents of high-energy mint provide directional clarity and transactional momentum.
- Deep slate typography and borders ground the ethereal lavender backdrops, ensuring an uncompromising standard of peer-to-peer security and legibility.

## Colors

The color palette centers around atmospheric lightness punctuated by vivid transactional confidence:

- **Primary (`#26C289` - Fresh Mint Green):** Represents liquidity, verification, affordability, and primary action triggers. Used for primary CTA buttons, active state indicators, verified campus badges, and positive trade statuses.
- **Secondary (`#7B71F5` - Deepened Periwinkle):** Serves as the high-contrast partner to lavender, utilized for active links, category tags, interactive states, and key navigational highlights.
- **Tertiary (`#E2DFFF` - Soft Periwinkle / Lavender):** The atmospheric signature tone. Primarily applied as contextual container backgrounds, structural tinting, badge fills, and delicate separator highlights.
- **Neutral (`#1E2430` - Deep Slate):** The typographic baseline. Delivers crisp, ink-like contrast against lavender and white fields without the abrasive harshness of true pitch black.

Surface treatments leverage pure `#FFFFFF` for primary cards and canvas segments, flanked by `#F7F8FC` for global scaffolding to maintain a breezy, high-key ambient feel.

## Typography

The typographic hierarchy pairs the structured, geometric attitude of **Space Grotesk** with the fluid, open readability of **Plus Jakarta Sans**. 

- **Space Grotesk** lends headlines an architectural, modern collegiate identity, making marketplace listings and category headers feel punchy and curated.
- **Plus Jakarta Sans** optimizes rapid browsing across varied densities, handling body copy, product descriptions, pricing figures, and micro-labels with neutral, contemporary clarity.
- Headings scale down cleanly across mobile screens to eliminate accidental word wrapping in listings while preserving visual authority.

## Layout & Spacing

The layout is built upon a 12-column responsive fluid grid with generous outer margins to enforce an uncluttered, spacious reading environment:

- **Desktop (1024px+):** 12-column grid, `margin: 2rem` (scaling up to max content container of `1280px`), and `gutter: 1.5rem`.
- **Tablet (768px - 1023px):** 8-column grid with `1.25rem` gutters and `1.5rem` margins.
- **Mobile (320px - 767px):** 4-column grid with `gutter-sm: 1rem` and `margin-sm: 1rem`.

Component spacing favors breathing room: elements within cards are separated by `space-sm` and `space-md`, while section partitions demand `space-xl` to prevent dense information clusters and maintain visual balance.

## Elevation & Depth

Visual hierarchy avoids heavy drop shadows, instead using crisp, tonal layering, soft perimeter borders, and ambient light diffusion:

- **Level 0 (Base Canvas):** Light soft-wash surface (`#F7F8FC`) providing quiet contrast under cards.
- **Level 1 (Card & Content Blocks):** Pure white fill (`#FFFFFF`) framed by a low-contrast slate stroke (`rgba(30, 36, 48, 0.06)`). No hard drop shadows; separation relies entirely on tonal shift.
- **Level 2 (Dropdowns, Popovers, Active Cards):** Soft ambient diffusion: `0 8px 24px -4px rgba(123, 113, 245, 0.08)`. Tinted softly with secondary periwinkle to reinforce brand continuity.
- **Level 3 (Modals & Overlays):** Semi-opaque backdrop (`rgba(30, 36, 48, 0.4)`) paired with foreground elevation: `0 16px 36px -8px rgba(30, 36, 48, 0.12)`.

## Shapes

The interface embraces a balanced rounded profile (`roundedness: 2`). Standard controls, interactive cards, and inputs utilize `0.5rem` (`rounded-md`), while featured listing cards, search hero inputs, and floating action panels graduate to `1rem` (`rounded-lg`) and `1.5rem` (`rounded-xl`). Small interactive pills, category badges, and user avatars adopt complete pill geometry (`rounded-full`) for a friendly, approachable touch.

## Components

### Buttons
- **Primary:** Background `#26C289` (Mint), text `#FFFFFF`, font weight `600`. On hover, smooth shift to a deeper tone (`#20A876`).
- **Secondary / Ghost:** Soft lavender background (`#E2DFFF`), text `#1E2430`. On hover, background shifts to slightly deeper periwinkle tint with secondary accent text (`#7B71F5`).
- **Tertiary:** Borderless, deep slate text with subtle underline transitions on focus/hover.

### Listing Cards
- Decluttered architecture with strict vertical rhythm: full-bleed or framed media container with a 4:3 aspect ratio, followed by a padded content container (`space-md`).
- Bold price display in `Space Grotesk`, accompanied by a minimal item title and single-line campus location tag in muted slate.
- Micro-pill badge positioned top-left over the image (e.g., "Verified Student", "Textbook", "Housing") utilizing tertiary lavender fills and dark slate typography.

### Input Fields & Search Bars
- Background `#FFFFFF`, encased in a subtle border (`1px solid rgba(30, 36, 48, 0.12)`), transitioning on focus to an active border of `#7B71F5` with a soft periwinkle ambient ring (`0 0 0 3px rgba(226, 223, 255, 0.6)`).
- Search fields in hero zones feature inset mint action buttons and integrated filter pill selectors.

### Chips & Filters
- Compact height (32px), pill-shaped (`rounded-full`), padded horizontally by `space-md`.
- Unselected: White background, subtle border, muted text.
- Selected: Background `#E2DFFF`, text `#1E2430`, border-color `#7B71F5`.

### Checkboxes & Radios
- Square with soft rounding (`4px`) for checkboxes; fully circular for radios.
- Inactive: `#FFFFFF` surface with `1.5px solid rgba(30, 36, 48, 0.2)`.
- Active: Filled with `#26C289` containing a clean white icon check/dot.

### Verification Badges
- High-visibility trust element consisting of a pill container featuring a small checkmark icon, mint background tint, and `#1E2430` micro-copy to signal peer campus verification.