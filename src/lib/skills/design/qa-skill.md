---
name: qa
description: "Run a full automated QA audit on a GTM Buddy web page. Use when the user provides any URL (staging, live, Base44 preview, or Webflow), asks to QA or validate a page, check if something is ready to ship, or run a pre-launch audit. Automatically triggered when any http/https URL is mentioned in this workspace. Produces a structured FAIL/WARN/PASS report with ready-to-paste fixes in GTM Buddy voice. After the report: fix all blockers, then run /launch-checklist for Gate 3 sign-off."
metadata:
  version: 1.0.0
allowed-tools: Bash, Read, WebFetch
---

# GTM Buddy QA

Automated Gate-2 audit. Drop a URL. Get a pass/fail report with ready-to-paste fixes.

---

## Before Starting

Read these files automatically. Do not ask the user to restate their rules.

- `DESIGN.md` — normative design tokens (colors, typography, components)
- `.agents/design-system.md` — component specs, page skeleton, visual rules
- `.agents/content-governance.md` — copy rules, em dash rule, ontology guardrails
- `.agents/seo-guardrails.md` — SEO floor, schema matrix, pre-publish checklist
- `.agents/product-marketing-context.md` — canonical URLs, vocabulary, category framing

---

## Input Modes

| Input | Behavior |
|-------|---------|
| `http/https URL` | Use Playwright MCP to crawl the live page (primary path) |
| File path | Use Read for static analysis of HTML/CSS/JS |
| Webflow MCP available | Supplement Playwright data with CMS/collection structure |

If no input is provided, ask: "What's the URL or file path to audit?"

If Playwright MCP cannot complete a multi-step flow (dynamic SPA, multi-page form, complex Webflow interaction), escalate to `/webwright` before marking the check manual-only.

---

## Playwright Crawl Sequence

Run these steps in order against the provided URL.

### Step 1: Load and capture

```
browser_navigate(url)
browser_console_messages()      → log all errors and warnings
browser_network_requests()      → identify 404s and failed loads
browser_snapshot()              → get full DOM for inspection
```

### Step 2: DOM extractions via browser_evaluate

Run each of these as separate evaluate calls and store results:

```javascript
// SEO elements
document.title
document.title.length
document.querySelector('meta[name="description"]')?.content
document.querySelector('meta[name="description"]')?.content?.length
document.querySelector('link[rel="canonical"]')?.href
document.querySelector('meta[name="robots"]')?.content   // check for "noindex"
document.querySelectorAll('h1').length                    // must be exactly 1
document.querySelector('h1')?.textContent?.trim()

// Open Graph
[...document.querySelectorAll('meta[property^="og:"]')]
  .map(m => ({ property: m.getAttribute('property'), content: m.content }))

// Schema
[...document.querySelectorAll('script[type="application/ld+json"]')]
  .map(s => s.textContent)

// Copy governance
document.body.innerHTML.includes('—')   // em dash — [FAIL if true]
!!document.body.innerHTML.match(
  /sales enablement platform|AI productivity tool|digital sales room/gi
)                                        // framing collapse — [FAIL if true]
!!document.body.innerHTML.match(
  /lorem ipsum|placeholder text|coming soon\.\.\./gi
)                                        // placeholder copy — [FAIL if true]

// Design system
getComputedStyle(document.body).backgroundColor   // must resolve to rgb(248, 246, 237) = #f8f6ed
document.querySelector('footer')?.textContent?.includes('Unlock Revenue Capacity Now.')

// Horizontal scroll
document.documentElement.scrollWidth > window.innerWidth  // [FAIL if true]

// Accessibility
[...document.querySelectorAll('img')]
  .map(img => ({ src: img.src, alt: img.getAttribute('alt'), hasAlt: img.hasAttribute('alt') }))

[...document.querySelectorAll('[role="button"], .accordion-trigger, [data-accordion]')]
  .map(el => ({ tag: el.tagName, hasAriaExpanded: el.hasAttribute('aria-expanded') }))

// Check for <div> or <span> used as buttons (accessibility violation)
[...document.querySelectorAll('[onclick]:not(button):not(a)')]
  .map(el => ({ tag: el.tagName, text: el.textContent?.trim().substring(0, 50) }))

// Analytics
!!document.querySelector('script[src*="gtag"], script[src*="analytics"], script[src*="ga.js"]')

// CTA links — extract all primary CTA hrefs
[...document.querySelectorAll('a[class*="cta"], a[class*="btn"], .cta-section a, .hero a')]
  .map(a => a.href)
```

### Step 3: Viewport screenshots

```
browser_resize({ width: 390, height: 844 })
browser_evaluate: document.documentElement.scrollWidth > window.innerWidth  → log result
browser_take_screenshot()   → label: "mobile 390px"

browser_resize({ width: 768, height: 1024 })
browser_take_screenshot()   → label: "tablet 768px"

browser_resize({ width: 1024, height: 768 })
browser_take_screenshot()   → label: "laptop 1024px"

browser_resize({ width: 1440, height: 900 })
browser_take_screenshot()   → label: "desktop 1440px"
```

Review each screenshot for:
- Layout breaks, content hidden, text clipping
- Hero stacking order on mobile (eyebrow → H1 → support copy)
- Pastel workflow rows stacking correctly
- Footer manifesto line visible

### Step 4: Functionality checks

```
// Click primary CTA
browser_click(primaryCtaSelector)
→ Verify the destination URL is in the canonical list from product-marketing-context.md
→ browser_navigate back to page

// Form submission (if form present)
browser_fill_form(formSelector, testData)
browser_click(submitSelector)
→ Verify a confirmation message or redirect fires
→ [FAIL] if form submits silently or returns an error
```

---

## Copy Governance Checks

For all text content extracted from the page, apply `.agents/content-governance.md` rules:

### [FAIL] triggers — rewrite required

| Finding | Rule | Action |
|---------|------|--------|
| Em dash `—` anywhere in copy | content-governance.md §Style | Locate the exact sentence, rewrite without em dash (use comma, colon, or full stop) |
| "sales enablement platform" / "AI productivity tool" / "digital sales room" as primary category | content-governance.md §2 | Rewrite using Revenue Activation vocabulary |
| "lorem ipsum" / placeholder / draft text | Gate-2 [FAIL] | Flag exact location + message |
| Missing footer manifesto line | design-system.md | Show exact footer HTML to add |

### [WARN] triggers

| Finding | Rule | Action |
|---------|------|--------|
| CTA URL not in canonical list from product-marketing-context.md | product-marketing-context.md §Key URLs | Show correct canonical URL |
| Weak or generic CTA copy ("Learn More", "Click Here", "Submit") | content-governance.md §CTA | Suggest specific active CTA copy |
| H2s not phrased as questions on definitional pages | seo-guardrails.md §AEO | Suggest question-form rewrites |
| Missing FAQ section on pages >1000 words | content-governance.md §AEO | Flag and suggest minimum 3 Q&A pairs |

### Copy rewrite rules

All rewritten copy must:
- Use Revenue Activation vocabulary, not generic enablement language
- Never use em dashes
- Be direct and punchy, not bureaucratic
- Reference GTM Buddy as the Revenue Activation Engine, not a platform or tool
- Pass `.agents/content-governance.md` before inclusion in the report

---

## SEO Checks (Gate-2 floor from seo-guardrails.md)

| Check | Pass condition | Status if fail |
|-------|---------------|----------------|
| Title tag present | `document.title` not empty | [FAIL] |
| Title length | 50–60 characters | [FAIL] if over 70, [WARN] if 61–70 |
| Title keyword-first | Primary keyword in first 50 chars | [WARN] |
| H1 count | Exactly 1 | [FAIL] if 0 or >1 |
| H1 length | Under 70 chars | [WARN] |
| Meta description present | Not empty | [FAIL] |
| Meta description length | Under 160 chars | [FAIL] if over 160 |
| Canonical tag | Present and self-referencing | [WARN] if missing |
| Noindex check | Not set to noindex | [FAIL] if noindex on non-gated page |
| OG tags | og:title, og:description, og:image all present | [WARN] if any missing |
| Schema | At least one `application/ld+json` block | [WARN] if missing |

---

## Accessibility Checks (WCAG 2.1 AA)

| Check | Pass condition | Status if fail |
|-------|---------------|----------------|
| Image alt text | All `<img>` have non-empty, non-filename alt | [FAIL] |
| Accordion markup | Accordion triggers use `<button aria-expanded>` | [FAIL] |
| Interactive elements | No `<div>` or `<span>` with onclick used as buttons | [FAIL] |
| Form labels | All inputs have associated `<label>` | [FAIL] |
| Comparison tables | Use real `<table>` with `<th>` headers | [WARN] |

---

## Design System Checks (from DESIGN.md + design-system.md)

| Check | Pass condition | Status if fail |
|-------|---------------|----------------|
| Page background | Computed background-color = `rgb(248, 246, 237)` (#f8f6ed) | [WARN] |
| Footer manifesto | Footer contains "Unlock Revenue Capacity Now." | [FAIL] |
| No dark sections | No section with dark/black background | [WARN] |
| Horizontal scroll | `scrollWidth <= innerWidth` at all viewports | [FAIL] |
| Console errors | Zero errors in browser console | [WARN] |
| Broken images | All `<img>` src resolve (no 404s in network requests) | [FAIL] |
| Analytics tag | GA or GTM script tag present | [WARN] |

---

## What Cannot Be Automated

Note these explicitly at the bottom of every report. The user must run them manually before Gate 3.

| Check | How to run |
|-------|-----------|
| Lighthouse mobile score >80 | `npx lighthouse [URL] --view` or Chrome DevTools Lighthouse tab |
| Lighthouse desktop score >90 | Same command, add `--preset=desktop` |
| LCP <2.5s, CLS <0.1, INP <200ms | https://pagespeed.web.dev |
| GA4 pageview event firing | Open GA4 → Admin → DebugView with page open in browser |
| GA4 CTA click events | Same DebugView, click primary CTA, verify event appears |
| UTM parameter passthrough | Requires live campaign traffic with UTM params |
| Cross-browser rendering | Chrome, Firefox, Safari, Edge — manual spot check |

---

## Report Format

Produce this exact format. Do not summarize or abbreviate.

```markdown
# QA Report — [URL]
Audited: [YYYY-MM-DD HH:MM]
Status: ❌ FAIL ([N] blockers, [N] warnings) | ✅ PASS | ⚠️ WARN ([N] warnings)

---

## ❌ Blockers — Fix before shipping

### 1. [Short issue name]
**Category:** Copy | SEO | Design | Accessibility | Functionality
**What's wrong:** [One sentence. Specific location if applicable.]
**Ready-to-paste fix:**
```[html/css/text]
[Exact code or copy to paste. If copy, written in GTM Buddy voice.]
```

### 2. ...

---

## ⚠️ Warnings — Fix before Gate 3

### 1. [Short issue name]
**Category:** ...
**What's wrong:** ...
**Suggested fix:**
[Specific suggestion. Not a rewrite of working content — just what to change.]

---

## ✅ Passed

**SEO:** Title tag ✓ | H1 ✓ | Meta description ✓ | Canonical ✓
**Copy:** No em dashes ✓ | No category framing drift ✓ | No placeholder text ✓
**Design:** Page background ✓ | Footer manifesto ✓ | No horizontal scroll ✓
**Accessibility:** Image alt text ✓ | Accordion markup ✓
**Functionality:** Primary CTA links correctly ✓

---

## 📋 Manual checks needed

Run these before Gate 3:

- [ ] Lighthouse mobile >80: `npx lighthouse [URL] --view`
- [ ] Lighthouse desktop >90: `npx lighthouse [URL] --preset=desktop --view`
- [ ] LCP <2.5s, CLS <0.1: https://pagespeed.web.dev/analysis?url=[URL]
- [ ] GA4 pageview firing: GA4 DebugView with page open
- [ ] GA4 CTA click events firing: click primary CTA in DebugView
- [ ] Cross-browser: Chrome, Firefox, Safari, Edge

---

## Next steps

1. Fix all ❌ blockers above — copy and code are ready to paste into Webflow
2. Complete the manual checks
3. Run `/launch-checklist` for full Gate 3 sign-off before going live
```

---

## Skill Chaining

After this report:
- If copy rewrites are needed → `/copywriting` for full content pass
- If SEO issues are deep → `/seo-audit` for comprehensive diagnosis
- If accessibility issues are structural → `/frontend-review` for full bendc-standard review
- If security concerns found → `/owasp-audit` and `/dependency-audit`
- When all blockers are resolved → `/launch-checklist`

---

## Regression mode (Passmark) — optional

Use when the user asks for **repeatable regression tests**, **CI browser tests**, or **NL step suites** — not for one-shot Gate-2 audits (that stays Playwright MCP above).

1. Read `references/passmark-setup.md` for install and env vars.
2. Scaffold `tests/<page-slug>.spec.ts` with Passmark `runSteps()` covering the critical path from this QA report (CTA click, form submit, confirmation state).
3. Map QA blockers to assertions so regressions fail CI when they reappear.
4. If Playwright MCP could not complete a multi-step flow during this audit → escalate to `/webwright` instead of forcing Passmark.

Do not add Passmark to this repo's dependencies unless the user explicitly wants an in-repo test project.
