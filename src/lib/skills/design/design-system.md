# GTM Buddy Design System

*Source of truth for all GTM Buddy web page design decisions.*
*Always read this file before making any UI or layout decision.*

---

## Design Principles

- Stay light, warm, and editorial. No dark sections, black hero bands, or SaaS-gradient drama.
- Use green as the brand intelligence accent, not as a loud decorative wash.
- Treat each page like an educational article with product proof, not a landing page packed with unrelated modules.
- Keep the composition calm: large margins, low-contrast surfaces, soft borders, high-density only inside tables or product screenshots.
- Reuse the same page skeleton. New pages should feel like siblings, not one-off campaigns.
- Use pastel blocks to organize product workflows and frameworks, never as random decoration.

---

## Core CSS Tokens

```css
:root {
  --font-heading: "Geist", "Inter", system-ui, sans-serif;
  --font-body: "Inter", system-ui, sans-serif;
  --font-mono: "DM Mono", ui-monospace, monospace;

  --page-bg: #f8f6ed;
  --page-bg-soft: #fbfaf4;
  --surface: #ffffff;
  --surface-warm: #fcfbf6;
  --surface-muted: #faf9f2;
  --border: #e8e3d8;
  --border-strong: #d9d4ca;

  --text: #111411;
  --text-soft: #30342f;
  --muted: #666b62;
  --muted-light: #8b9088;

  --green-950: #003013;
  --green-900: #06391e;
  --green-800: #064f2a;
  --green-700: #08703c;
  --green-accent: #18a957;
  --green-soft: #effeee;
  --green-band: #e3efdc;

  --cta-blue: #246edc;
  --cta-blue-hover: #1d5fc2;

  --pastel-lavender: #edeaff;
  --pastel-blush: #fbefef;
  --pastel-aqua: #e4faff;
  --pastel-butter: #fff9e4;
  --pastel-mint: #effeee;

  --shadow-soft: 0 18px 50px rgba(38, 45, 35, 0.08);
  --shadow-card: 0 8px 28px rgba(38, 45, 35, 0.06);

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --radius-xl: 24px;

  --design-canvas: 1700px;
  --container: 1296px;
  --gutter: 32px;
  --grid-columns: 12;
  --grid-gap: 24px;
  --grid-column: calc((var(--container) - (11 * var(--grid-gap))) / 12);
}
```

---

## Typography

- Hero H1: `56-64px`, weight `700`, line-height `0.96-1.04`, letter-spacing `-0.045em`
- Section H2: `36-44px`, weight `700`, line-height `1.05`, letter-spacing `-0.035em`
- Card H3: `22-28px`, weight `700`, line-height `1.15`, letter-spacing `-0.025em`
- Body large: `18px`, weight `400-500`, line-height `1.55`
- Body default: `16px`, weight `400`, line-height `1.55`
- Support/small: `14px`, line-height `1.45`, color `var(--muted)`
- Eyebrow: `12px`, weight `700`, uppercase, letter-spacing `0.08em`, green text on pale green pill
- Footer manifesto: `64-84px`, weight `750`, line-height `0.95`, letter-spacing `-0.055em`

Responsive type (use `clamp`):
```css
.hero-title    { font-size: clamp(42px, 3.75vw, 64px); }
.section-title { font-size: clamp(30px, 2.6vw, 44px); }
.footer-manifesto { font-size: clamp(44px, 5vw, 84px); }
```

---

## Grid System

Design canvas: `1700px`. Content container: `1296px`. Always build responsively — `1700px` is a reference, not a required viewport.

```css
.page-shell { background: var(--page-bg); color: var(--text); min-height: 100vh; }
.container  { width: min(var(--container), calc(100vw - (var(--gutter) * 2))); margin-inline: auto; }
.grid-12    { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: var(--grid-gap); }
```

Desktop column spans: hero title `span 6`, hero copy `8 / span 5`, three-card frameworks each `span 4`, workflow text `span 5`, workflow screenshot `span 7`.

Breakpoints:
- `>= 1360px`: 12 columns, full container
- `1024-1359px`: 12 columns, gutter `28px`, gap `20px`
- `768-1023px`: 6 columns, stack hero and workflow rows
- `< 768px`: 4 columns, `20px` gutter, `16px` gap, full-width cards
- `< 480px`: single column, reduce section padding to `56-72px`

---

## Page Skeleton

Every page in this family follows this structure:

1. Announcement bar
2. Main nav
3. Hero intro
4. Scenic explainer card
5. Primary education/product module
6. Comparison, framework, or shift module
7. Secondary scenic argument card
8. FAQ accordion
9. Split closing CTA
10. GTM Buddy footer with oversized manifesto line

---

## Components

### Announcement Bar
- Full-width dark green strip: `var(--green-950)`, height `20-24px`, centered white `11-12px` text.

### Main Nav
- Height `56-64px`, background `var(--page-bg-soft)`. Logo left, links center-left, `Sign in` + green `Book a demo` button right.

### Hero Intro
- Two-column editorial: left title ~52%, right copy ~36-40%, gap `96-140px`.
- Eyebrow pill above H1. H1 black/charcoal, keyword highlight in GTM green.
- Do not center-align on desktop. No screenshots in hero.

### Scenic Explainer Card
- Full-container card, rounded `16-20px`, scenic landscape background.
- Inner white editorial panel centered, `78-86%` width, `14-18px` radius.
- Lower tinted band (pale green or warm beige) for the strongest takeaway.
- Do not replace with a flat gradient box.

### Workflow Module (Pastel Rows)
- Outer card: `var(--surface)`, border `1px solid var(--border)`, radius `18-24px`, padding `48-64px`.
- Rows: pastel background in order lavender, blush, aqua, butter, mint. Two-column: text left, screenshot right. Row radius `14-18px`, padding `28-40px`, gap `20-28px`.

### Comparison Table
- Three columns: Dimension / Old Model / GTM Buddy Model. Header: neutral gray / charcoal / deep green. Right column: pale green fill, green check icons.
- Wrap in horizontal scroll on mobile.

### Framework Cards
- Three cards across desktop, pastel background, illustration top, text below. Radius `14-18px`, padding `28-36px`.

### FAQ Accordion
- Centered, max-width `720-820px`. White items, border `1px solid var(--border)`, radius `8-10px`. `3-6` items. `<button aria-expanded>` markup.

### Closing CTA
- Two-column: left headline + sentence, right vertical stack of 3 buttons.
- Primary: `var(--cta-blue)`, white text. Secondary/tertiary: ivory fill, `var(--border-strong)`.
- Button width desktop `300-340px`, height `40-46px`, radius `6-8px`.

### Footer
- Logo + brand descriptor left, multi-column links right.
- Bottom oversized manifesto line: `Unlock Revenue Capacity Now.`
- Background: warm ivory. Keep same as page background.

---

## Visual Motifs (Use)

Thin dark green announcement bar, pale green eyebrow pills, big scenic explainer cards, white cards on warm ivory, pastel workflow blocks, green comparison columns, product screenshot panels with pale blue chrome, final blue CTA button, giant footer manifesto.

## Visual Motifs (Avoid)

Purple-primary branding, dark mode sections, full-width blue CTA bands, heavy drop shadows, neon gradients, generic SaaS dashboard cards without pastel/editorial wrapper.

---

## Mobile Overflow Guard

```css
html, body { overflow-x: clip; }
img, video, svg { max-width: 100%; height: auto; }
.table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
```

---

## Accessibility Baseline

- Use real `<table>` for comparison tables.
- Use `<button aria-expanded>` for accordions.
- Meaningful `alt` on all images, especially product screenshots.
- `prefers-reduced-motion` for any reveal animation.
- Text readable at `320px` viewport width.
- No content touching viewport edge on mobile.

---

## Page Recipes

### Concept Definition Page
Hero `What is [Concept]?` → scenic definition card → workflow module `How [Concept] Works` → comparison table → secondary scenic card → FAQ → closing CTA → footer.

### Comparison Page
Direct comparison hero → scenic old vs new card → structural difference table → shift/problem card stack → secondary scenic card → FAQ → closing CTA → footer.

### Future/Trend Page
Trend headline hero → scenic shift card → three-card framework → secondary scenic card → FAQ → closing CTA → footer.

### Product Capability Page
Capability hero + outcome subhead → scenic definition card → workflow module (4 steps) → secondary scenic business impact card → FAQ → closing CTA → footer.

---

## Content Rules

- Lead with the category or business problem, then connect to GTM Buddy.
- Use concrete section titles: `How [Capability] Works`, `The Core Structural Difference`.
- Keep paragraphs short and declarative.
- Name the old way clearly before presenting GTM Buddy's way.
- Put the strongest summary in the tinted lower band of scenic cards.
- FAQs handle buying objections, not leftover feature copy.
- No em dashes in any copy. Comma, colon, or full stop instead.
