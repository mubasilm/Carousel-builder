---
name: launch-checklist
description: "Run the GTM Buddy 4-gate website launch checklist. Use when the user wants to check if a page or project is ready to ship, asks to run the launch checklist, mentions pre-launch QA, website launch, go-live readiness, page audit, or asks whether a page passes the GTM Buddy quality gates. Triggers: 'launch checklist', 'ready to ship', 'pre-launch', 'go-live check', 'QA the page', 'does this pass', 'launch audit'. A single [FAIL] blocker = the page does not ship."
metadata:
  version: 1.0.0
---

# GTM Buddy Website Launch Checklist

Interactive 4-gate launch audit. Nothing ships without PASS on all gates. A single [FAIL] blocker stops the launch.

## How to Use

Provide one of the following:
- A live or staging URL (I will fetch and analyze it).
- Local file paths (I will read and analyze statically).
- A codebase directory (I will scan relevant files).

I will run all gates in sequence and produce a pass/fail report with specific action items.

---

## Gate 1: Pre-Flight

*Run before build begins or when validating a brief.*

**Strategy**
- [ ] Clear primary conversion goal defined (demo request, sign-up, etc.).
- [ ] Target audience and traffic source identified.
- [ ] Page type determined (concept definition, comparison, trend, capability).

**SEO / AEO Plan**
- [ ] Primary keyword target identified and mapped to page.
- [ ] Title tag draft written: unique, 50-60 chars, keyword-first.
- [ ] H1 draft written: mirrors target query, under 70 chars.
- [ ] Meta description draft: unique, under 160 chars.
- [ ] AEO structure planned: 40-60 word direct opening paragraph.

**Messaging**
- [ ] Copy aligned to `.agents/product-marketing-context.md`.
- [ ] No generic sales enablement, AI productivity, or DSR framing.
- [ ] Revenue Activation ontology maintained.
- [ ] No em dashes planned.

**Design**
- [ ] Page type matches a page recipe in `.agents/design-system.md`.
- [ ] Design system tokens confirmed as the CSS foundation.
- [ ] Responsive breakpoints planned for all 5 viewports.

**Setup**
- [ ] Analytics tracking plan confirmed.
- [ ] Form destination / CRM connection confirmed (if applicable).
- [ ] URL slug confirmed and 301 redirect planned if replacing an existing page.

---

## Gate 2: In-Flight

*Run during build to validate as you go.*

**Design System Compliance**
- [ ] Warm ivory canvas (`var(--page-bg)`), not pure white or gray.
- [ ] Correct page skeleton: announcement bar, nav, hero, scenic card, modules, FAQ, CTA, footer.
- [ ] CSS tokens used from design system. No hardcoded hex values that diverge from the token set.
- [ ] No dark sections, heavy gradients, or purple-primary branding.

**Responsive**
- [ ] Validates at `1700px`, `1440px`, `1024px`, `768px`, `390px`.
- [ ] No horizontal overflow on any viewport (except intentional table scroll). **[FAIL if broken]**
- [ ] Hero copy stacks in order: eyebrow, title, support copy.
- [ ] All workflow rows stack text above screenshot on small screens.
- [ ] Comparison tables scroll horizontally inside their container.

**Typography**
- [ ] Geist for headings, Inter for body copy.
- [ ] Font sizes use `clamp()` for fluid scaling.
- [ ] Text remains readable at `320px` width.

**Copy**
- [ ] No em dashes in any copy. **[FAIL if present]**
- [ ] No category framing collapse (no generic enablement / AI productivity / DSR language). **[FAIL if present]**
- [ ] CTAs use correct canonical URLs from `.agents/product-marketing-context.md`.
- [ ] No placeholder copy on any live page. **[FAIL if present]**

**SEO Implementation**
- [ ] Title tag: present, unique, 50-60 chars, keyword-first. **[FAIL if missing]**
- [ ] H1: present, one only, under 70 chars, keyword-aligned. **[FAIL if missing or multiple]**
- [ ] Meta description: present, unique, under 160 chars. **[FAIL if missing]**
- [ ] Page is not set to `noindex` (unless intentionally gated). **[FAIL if noindex on live page]**
- [ ] At least 3 internal links pointing to this page plan confirmed.
- [ ] Open Graph tags present (og:title, og:description, og:image).

**AEO Structure**
- [ ] First paragraph is a 40-60 word direct answer to the target query.
- [ ] H2s on definitional pages are phrased as follow-up questions.
- [ ] FAQ section present with 3+ Q&A pairs.
- [ ] Schema markup planned for page type (see `/schema` skill).

**Accessibility (WCAG 2.1 AA)**
- [ ] All images have meaningful `alt` text.
- [ ] All form inputs have associated labels.
- [ ] Buttons are `<button>` elements, not `<div>` or `<span>`.
- [ ] Accordions use `<button aria-expanded>`.
- [ ] Comparison tables use real `<table>` markup.
- [ ] Color is not the sole means of communicating information.
- [ ] `prefers-reduced-motion` applied to any animated section.
- [ ] Mobile layout does not hide critical content. **[FAIL if important content hidden on mobile]**

**Performance Targets**
- [ ] Lighthouse mobile score > 80. **[FAIL if below]**
- [ ] Lighthouse desktop score > 90. **[FAIL if below]**
- [ ] LCP < 2.5s. **[FAIL if above]**
- [ ] CLS < 0.1. **[FAIL if above]**
- [ ] INP < 200ms. **[FAIL if above]**
- [ ] Scripts loaded at end of `<body>` or deferred.
- [ ] Images use `max-width: 100%; height: auto` globally.

**Functionality**
- [ ] All CTAs link to correct canonical URLs. **[FAIL if broken]**
- [ ] All forms submit successfully and trigger confirmation. **[FAIL if unconfirmed]**
- [ ] No JavaScript console errors on load.
- [ ] No broken images or 404s.

**Analytics**
- [ ] Page view tracking confirmed. **[FAIL if missing]**
- [ ] CTA click tracking confirmed.
- [ ] Form submission event confirmed (if applicable).
- [ ] UTM parameters preserved if used.

---

## Security Gate

*Run in parallel with Gate 2 and Gate 3.*

**Dependencies**
- [ ] Run `/dependency-audit` on the project.
- [ ] No known critical CVEs in direct dependencies. **[FAIL if critical CVE present]**
- [ ] No unmaintained packages with open security issues.

**OWASP Check**
- [ ] Run `/owasp-audit` if the page includes a form, API call, or dynamic user-facing content.
- [ ] All form inputs validated and sanitized server-side.
- [ ] No SQL injection, XSS, or CSRF vectors in form handlers.

**Security Headers** (required for server-deployed pages)
- [ ] `Content-Security-Policy` header present.
- [ ] `Strict-Transport-Security` (HSTS) header present.
- [ ] `X-Frame-Options: DENY` or `SAMEORIGIN` header present.
- [ ] `X-Content-Type-Options: nosniff` header present.
- [ ] `Referrer-Policy` header present.

**Secrets and Exposure**
- [ ] No API keys, credentials, or secrets in client-side JS. **[FAIL if present]**
- [ ] No sensitive data (PII, tokens) in `localStorage` or `sessionStorage`.
- [ ] No sensitive data in URL query parameters.
- [ ] `.env` files not committed or exposed.

**HTTPS**
- [ ] Site is served over HTTPS. **[FAIL if not]**
- [ ] HTTP to HTTPS redirect in place.
- [ ] No mixed-content warnings (HTTP resources on an HTTPS page).

**Prompt Injection** (if applicable)
- [ ] Run `/prompt-injection` if the page includes AI-generated content, chatbot UI, or dynamic text populated from user input or external API.

---

## Gate 3: Pre-Launch

*Run on staging before flipping live.*

- [ ] All Gate 2 items confirmed PASS on staging environment.
- [ ] Cross-browser check: Chrome, Firefox, Safari, Edge.
- [ ] Cross-device check: desktop, tablet, phone (real device or emulator).
- [ ] All Gate 2 [FAIL] blockers resolved.
- [ ] Security Gate complete: no open [FAIL] items.
- [ ] 301 redirect confirmed if replacing existing URL. **[FAIL if missing where applicable]**
- [ ] Schema markup validated in Google's Rich Results Test.
- [ ] Sitemap updated and submitted.
- [ ] Final copy review: no em dashes, no placeholder text, no category framing drift.

---

## Gate 4: Post-Launch

*Run within 24 hours of going live.*

- [ ] Live URL loads correctly.
- [ ] `noindex` is NOT present on the live page. **[FAIL if present]**
- [ ] Analytics event confirmed firing on live URL.
- [ ] Form submission confirmed on live URL. **[FAIL if broken]**
- [ ] No JavaScript console errors on live URL.
- [ ] All CTAs link to live canonical URLs.
- [ ] Page indexed or submitted for indexing.
- [ ] Performance run on live URL (Lighthouse or PageSpeed Insights).
- [ ] Schema validated on live URL.

---

## [FAIL] Blockers Summary

Any one of these = DO NOT SHIP:

| # | Blocker |
|---|---------|
| 1 | Horizontal scroll on any viewport |
| 2 | Broken CTA or form link |
| 3 | `noindex` on a live page |
| 4 | Multiple H1s or missing H1 |
| 5 | Missing title tag |
| 6 | Missing meta description |
| 7 | Mobile layout hides important content |
| 8 | Missing 301 redirect where applicable |
| 9 | Schema validation errors |
| 10 | Missing or misfiring analytics |
| 11 | Em dashes in copy |
| 12 | Category framing collapse |
| 13 | Unconfirmed form submission |
| 14 | API keys or credentials in client-side source |
| 15 | Site not served over HTTPS |
| 16 | Critical CVE in direct dependency |
| 17 | Lighthouse mobile < 80 |
| 18 | LCP > 2.5s |
| 19 | CLS > 0.1 |

---

## Output Format

Produce a report organized by gate. For each item, mark:
- `[PASS]` — confirmed OK
- `[FAIL]` — blocking issue with specific remediation step
- `[WARN]` — non-blocking but should be addressed
- `[N/A]` — not applicable to this page type

End with a ship/no-ship verdict and a prioritized list of all open items.

---

## Related Skills

- `/lp-design`: Build or redesign the page against the GTM Buddy design system.
- `/owasp-audit`: Full OWASP Top 10 security review.
- `/dependency-audit`: Package and dependency vulnerability scan.
- `/prompt-injection`: AI content injection resistance check.
- `/seo-audit`: Deep SEO analysis if multiple SEO issues are found.
- `/schema`: Add or fix structured data markup.
- `/cro`: Conversion rate optimization if the page converts poorly after launch.
- `/frontend-review`: Code quality review.
