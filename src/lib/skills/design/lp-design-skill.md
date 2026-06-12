---
name: lp-design
description: "Build, redesign, implement, review, or QA GTM Buddy marketing web pages. Use when the user asks to build a GTM Buddy landing page, marketing page, content page, Webflow page, or any frontend UI in the GTM Buddy brand style. Triggers: 'build a GTM Buddy page', 'GTM Buddy web guidelines', 'landing page', 'responsive page', '1700px grid', 'design system', 'page skeleton', 'GTM Buddy component', 'scenic card', 'pastel module', 'comparison table', 'hero', 'CTA section', 'footer manifesto'. After completing any page build, always run /launch-checklist."
metadata:
  version: 2.0.0
---

# GTM Buddy Landing Page Design

You are an expert GTM Buddy frontend engineer and designer. Your job is to build complete, responsive, secure, brand-accurate GTM Buddy marketing pages.

## Before Starting

**Read design system:**
Always read `DESIGN.md` (machine-readable tokens + rationale, google-labs-code format) and `.agents/design-system.md` (component specs, page recipes, CSS snippets) before making any UI or layout decision. `DESIGN.md` is the normative token source.

**Read frontend guidelines:**
Always read `.agents/frontend-guidelines.md` before writing any HTML, CSS, or JS. Apply all rules automatically.

**Read product marketing context:**
If `.agents/product-marketing-context.md` exists, read it before writing any copy or page content.

**Read content governance:**
If `.agents/content-governance.md` exists, apply it to all copy. No em dashes. No category framing drift.

**Read SEO guardrails:**
If `.agents/seo-guardrails.md` exists, run the SEO health check on every page.

---

## Workflow

1. Read `.agents/design-system.md`.
2. Read `.agents/frontend-guidelines.md`.
3. Identify the page type: concept definition, comparison, future/trend, or product capability.
4. Use the required page skeleton from the design system unless the request clearly asks for a smaller section.
5. Apply the `1700px` desktop grid as a design reference with a `1296px` max container.
6. Build responsively from the start. Never create fixed-width desktop-only layouts.
7. Preserve the GTM Buddy visual language: warm ivory canvas, compact header, editorial hero, scenic explainer cards, pastel modules, quiet FAQ, split CTA, oversized footer manifesto.
8. Validate at all required viewport widths before handing work back.
9. Run `/launch-checklist` after completing any page build.

---

## Guardrails

- Do not introduce dark sections, generic SaaS gradients, purple-primary branding, heavy shadows, or unrelated UI styles.
- Do not hide important content on mobile to preserve the desktop layout.
- Do not let the page create horizontal overflow except intentional table scrolling.
- Prefer reusable sections and data-driven content arrays for workflow rows, framework cards, comparison rows, FAQs, and footer columns.
- Use semantic HTML: `<header>`, `<main>`, `<section>`, `<table>`, `<footer>`.
- Tables must use real table markup for accessibility.
- Accordions must use `<button aria-expanded>`.
- Images need meaningful `alt` text.
- Add `prefers-reduced-motion` for any reveal animation.
- Keep animations subtle: fade/slide on section entry only.
- No em dashes in any copy.

---

## Security Requirements

Before shipping any page:
- Run `/dependency-audit` if the project uses npm/yarn.
- Run `/owasp-audit` if the page includes a form, dynamic content, or user-facing input.
- Confirm no API keys, credentials, or sensitive data appear in client-side source.
- Confirm security headers are present if deploying to a server (Content-Security-Policy, HSTS, X-Frame-Options, X-Content-Type-Options).

---

## Required Viewport Validation

Check at: `1700px`, `1440px`, `1024px`, `768px`, `390px`.

- No content touches the viewport edge.
- Hero copy stacks in correct order: eyebrow, title, support copy.
- Workflow rows stack text above screenshot on small screens.
- Framework cards become one column on mobile.
- Comparison tables scroll horizontally inside their container.
- FAQ items stay tappable at mobile sizes.
- Footer columns collapse into grouped lists before the large manifesto line.

---

## Design QA Checklist

- Page uses warm ivory background (`var(--page-bg)`), not pure white or gray.
- Header has both the dark green announcement strip and compact nav.
- Hero uses left H1 plus right supporting copy on desktop.
- At least one scenic explainer card appears near the top.
- Scenic card has visible image edges and an inner white panel.
- Pastel modules use the lavender, blush, aqua, butter, mint family.
- Product screenshots are real or exported from the design source.
- Comparison tables keep the gray/charcoal/green header pattern.
- FAQ is centered, compact, and visually quiet.
- Closing CTA uses the split layout with blue primary button.
- Footer includes multi-column layout and `Unlock Revenue Capacity Now.` line.
- Mobile grids stack cleanly and tables are scrollable.
- Text remains readable at `320px` width.
- No dark section, heavy gradient, or unrelated visual style introduced.

---

## Related Skills

- `/launch-checklist`: Run after every page build. Required before shipping.
- `/cro`: If the page needs conversion rate optimization.
- `/seo-audit`: If SEO issues are found during the guardrails check.
- `/copywriting`: If the page needs copy written or rewritten.
- `/schema`: If structured data markup is needed.
- `/owasp-audit`: Security audit for pages with forms or dynamic content.
- `/frontend-review`: Code quality review against frontend guidelines.
