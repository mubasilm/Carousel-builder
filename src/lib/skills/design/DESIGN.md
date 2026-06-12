---
version: alpha
name: GTM Buddy
description: Revenue Activation Engine — warm ivory editorial design system for gtmbuddy.ai
colors:
  page-bg: "#f8f6ed"
  page-bg-soft: "#fbfaf4"
  surface: "#ffffff"
  surface-warm: "#fcfbf6"
  surface-muted: "#faf9f2"
  border: "#e8e3d8"
  border-strong: "#d9d4ca"
  text: "#111411"
  text-soft: "#30342f"
  muted: "#666b62"
  muted-light: "#8b9088"
  green-950: "#003013"
  green-900: "#06391e"
  green-800: "#064f2a"
  green-700: "#08703c"
  green-accent: "#18a957"
  green-soft: "#effeee"
  green-band: "#e3efdc"
  cta-blue: "#246edc"
  cta-blue-hover: "#1d5fc2"
  pastel-lavender: "#edeaff"
  pastel-blush: "#fbefef"
  pastel-aqua: "#e4faff"
  pastel-butter: "#fff9e4"
  pastel-mint: "#effeee"
  shadow-soft: "rgba(38, 45, 35, 0.08)"
  shadow-card: "rgba(38, 45, 35, 0.06)"
typography:
  h1:
    fontFamily: Geist
    fontSize: clamp(42px, 3.75vw, 64px)
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: -0.045em
  h2:
    fontFamily: Geist
    fontSize: clamp(30px, 2.6vw, 44px)
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -0.035em
  h3:
    fontFamily: Geist
    fontSize: 25px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.025em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
  small:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.45
  eyebrow:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 700
    letterSpacing: 0.08em
  mono:
    fontFamily: DM Mono
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  manifesto:
    fontFamily: Geist
    fontSize: clamp(44px, 5vw, 84px)
    fontWeight: 750
    lineHeight: 0.95
    letterSpacing: -0.055em
rounded:
  sm: 8px
  md: 12px
  lg: 18px
  xl: 24px
spacing:
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  2xl: 64px
  3xl: 96px
components:
  announcement-bar:
    backgroundColor: "{colors.green-950}"
    color: "#ffffff"
    height: 24px
    fontSize: 11px
    fontWeight: 500
  nav:
    backgroundColor: "{colors.page-bg-soft}"
    height: 60px
    borderBottom: "1px solid {colors.border}"
  hero:
    layout: two-column
    titleSpan: "6 of 12 cols"
    copySpan: "5 of 12 cols (offset 7)"
    columnGap: 96px
    paddingBlock: 80px
  scenic-card:
    borderRadius: "{rounded.xl}"
    innerPanelWidth: "82%"
    innerPanelRadius: "{rounded.lg}"
  workflow-row:
    backgroundColor: pastel-sequence
    borderRadius: "{rounded.lg}"
    padding: 36px
    columnGap: 24px
    textSpan: "5 of 12 cols"
    screenshotSpan: "7 of 12 cols"
  comparison-table:
    headerNeutral: "#f5f4f1"
    headerGTMBuddy: "{colors.green-950}"
    columnGTMBuddy: "{colors.green-soft}"
  faq-accordion:
    maxWidth: 820px
    itemBackground: "{colors.surface}"
    itemBorder: "1px solid {colors.border}"
    itemRadius: "{rounded.sm}"
  cta-primary:
    backgroundColor: "{colors.cta-blue}"
    color: "#ffffff"
    borderRadius: 7px
    height: 42px
    minWidth: 300px
    fontWeight: 600
  cta-secondary:
    backgroundColor: "{colors.page-bg}"
    borderColor: "{colors.border-strong}"
    color: "{colors.text}"
    borderRadius: 7px
    height: 42px
    minWidth: 300px
  footer:
    backgroundColor: "{colors.page-bg}"
    manifestoText: "Unlock Revenue Capacity Now."
    manifestoFont: "{typography.manifesto}"
---

## Overview

GTM Buddy's visual identity is warm, editorial, and calm. Every page should feel like a well-designed business article with product proof embedded inside it, not a SaaS landing page layered with feature modules.

The foundation is a warm ivory canvas (`#f8f6ed`), never pure white. Brand intelligence is expressed through a single GTM green accent (`#18a957`) used for eyebrow pills, keyword highlights, and announcement details. The primary CTA is blue (`#246edc`), deliberate and isolated. Everything else stays neutral.

Pages in this system are siblings: same skeleton, same proportions, same spacing cadence. A new page should look like it belongs to the same family, not a one-off campaign.

## Colors

The palette is built around warm neutrals with two action colors.

- **Page background (`#f8f6ed`):** Warm ivory. Never deviate. Not gray, not off-white, not pure white.
- **Surface (`#ffffff`):** Card interiors, modal backgrounds, workflow row containers.
- **Text (`#111411`):** Near-black with a green undertone. All body copy and headlines.
- **Muted (`#666b62`):** Supporting text, captions, timestamps, metadata.
- **Green 950 (`#003013`):** Announcement bar and deepest green surface. Do not use for body text.
- **Green Accent (`#18a957`):** Eyebrow pills, keyword highlights in headlines, icon fills. Use sparingly, not as a wash.
- **CTA Blue (`#246edc`):** Primary call-to-action only. Do not repurpose as a section color or decorative element.
- **Pastel sequence:** Lavender → Blush → Aqua → Butter → Mint. Always in this order inside workflow modules. Do not reorder or skip.

What to avoid: purple-primary branding, dark hero sections, neon gradients, full-width blue CTA bands, heavy drop shadows.

## Typography

Two typefaces. Geist for all headings and the footer manifesto. Inter for all body text, labels, and UI copy.

The hero H1 uses tight tracking (`-0.045em`) and a line-height near or below 1.0 to achieve the compressed editorial feel. Section H2s relax slightly. Body copy stays readable at 1.55 line-height throughout.

The footer manifesto (`Unlock Revenue Capacity Now.`) is oversized by design: `clamp(44px, 5vw, 84px)`. It anchors every page's closing rhythm. Do not reduce or replace it.

All fluid sizes use `clamp()`. Never hardcode pixel values for H1 or H2.

## Layout

Design canvas reference: `1700px`. Content container: `1296px` max-width, centered, with `32px` gutters. Grid: 12 columns, `24px` column gap.

```css
.container { width: min(1296px, calc(100vw - 64px)); margin-inline: auto; }
.grid-12   { display: grid; grid-template-columns: repeat(12, 1fr); column-gap: 24px; }
```

Breakpoints:

| Viewport | Columns | Gutter | Gap |
|----------|---------|--------|-----|
| 1360px+ | 12 | 32px | 24px |
| 1024–1359px | 12 | 28px | 20px |
| 768–1023px | 6 | 24px | 16px |
| < 768px | 4 | 20px | 16px |
| < 480px | 1 | 16px | 16px |

Mobile overflow guard is non-negotiable:

```css
html, body { overflow-x: clip; }
img, video, svg { max-width: 100%; height: auto; }
```

Page skeleton (every page follows this order):

1. Announcement bar — `#003013` strip, 24px
2. Main nav — ivory background, 60px
3. Hero — two-column editorial, left H1, right support copy
4. Scenic explainer card — landscape photo background, inner white panel
5. Product/workflow module — pastel rows, text left, screenshot right
6. Comparison or framework module
7. Secondary scenic card — strongest argument
8. FAQ accordion — centered, max 820px
9. Split closing CTA — headline left, three buttons right
10. Footer — multi-column links + oversized manifesto line

## Elevation & Depth

Shadow tokens:

- `shadow-soft`: `0 18px 50px rgba(38, 45, 35, 0.08)` — scenic cards, major containers
- `shadow-card`: `0 8px 28px rgba(38, 45, 35, 0.06)` — workflow rows, FAQ items

Keep shadows subtle. The warm ivory background provides the depth separation; heavy shadows fight the palette.

## Shapes

Radius scale matches the containment hierarchy:

- `8px` (sm): FAQ items, small badges, buttons
- `12px` (md): feature cards, inner panels
- `18px` (lg): workflow rows, larger card sections
- `24px` (xl): scenic cards, hero enclosures

Do not mix non-adjacent radius values in the same visual group (for example, do not use 8px buttons inside a 24px container unless there is a deliberate visual reason).

## Components

### Announcement Bar
Full-width dark green strip. Height 24px. White 11px text centered. Links inherit white color. No close button.

### Nav
Ivory background. Logo left. Navigation links center-left. Sign in + green "Book a demo" button right. 60px tall. 1px bottom border in `#e8e3d8`. Compact: no mega-menus or dropdowns that require complex layout.

### Hero
Two-column editorial layout. No screenshots in the hero — text only. Eyebrow pill (green background, green text, uppercase, 12px) sits above the H1. H1 is black/charcoal with one keyword phrase highlighted in GTM green. Right column carries support copy and the primary CTA button. Do not center-align the hero on desktop. Gap between columns: 96–140px.

### Scenic Explainer Card
Full-container card with a landscape background image. An inner white editorial panel sits centered at 82% width. The panel has a tinted lower band (pale green or warm beige) for the single strongest takeaway sentence. Radius 20–24px on the outer card, 14–18px on the inner panel. Do not replace with a flat gradient rectangle.

### Workflow Module (Pastel Rows)
Outer card: white surface, 1px `#e8e3d8` border, 18–24px radius, 48–64px padding. Each row gets the next pastel in sequence: lavender, blush, aqua, butter, mint. Row layout: text left (5 cols), screenshot right (7 cols). Row padding 28–40px. Screenshot panels have a pale blue chrome frame. Never repeat a pastel color within the same module.

### Comparison Table
Three columns: Dimension / Old Model / GTM Buddy. GTM Buddy column: `#effeee` fill, `#003013` header, green checkmarks. Wrap in horizontal scroll on mobile. Use real `<table>` markup, not CSS grid.

### FAQ Accordion
Centered, max-width 820px. White items, 1px `#e8e3d8` border, 8px radius. 3–6 items. `<button aria-expanded="true/false">` markup. Question is the button, answer is the disclosed content.

### Closing CTA
Split two-column: left headline + one supporting sentence, right vertical stack of three buttons (primary blue, secondary ivory, tertiary ivory). Button width 300–340px, height 40–46px, 6–8px radius. No full-width blue band — keep the section on warm ivory.

### Footer
Warm ivory background (same as page). Logo + brand descriptor left, multi-column link groups right. Bottom row: oversized manifesto line `Unlock Revenue Capacity Now.` in `clamp(44px, 5vw, 84px)` Geist at weight 750. This line is mandatory on every page.

## Do's and Don'ts

**Do:**
- Use `#f8f6ed` as the page background on every page
- Apply the pastel sequence in order: lavender → blush → aqua → butter → mint
- Use `clamp()` for H1, H2, and the footer manifesto
- Include the oversized manifesto line in every footer
- Use real `<table>` elements for comparison tables
- Use `<button aria-expanded>` for all accordions
- Add meaningful `alt` text to every image, especially product screenshots
- Include `prefers-reduced-motion` for any animated reveal
- Test at 390px, 768px, 1024px, 1440px, 1700px before shipping

**Don't:**
- Use pure white (`#ffffff`) as the page canvas
- Add dark sections, black hero bands, or full-width colored CTA strips
- Use purple as a primary brand color
- Apply neon gradients or heavy drop shadows
- Put a product screenshot in the hero section
- Repeat pastel colors within the same workflow module
- Deviate from the 10-section page skeleton without explicit sign-off
- Use em dashes (—) in any copy: use a comma, colon, or full stop instead
- Place credentials or API keys in client-side source
