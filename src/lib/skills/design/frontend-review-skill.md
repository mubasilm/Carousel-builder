---
name: frontend-review
description: "Review any HTML, CSS, or JavaScript file against the GTM Buddy frontend quality standards (bendc/frontend-guidelines). Use when the user asks to review frontend code quality, check HTML semantics, audit CSS specificity or animations, review JavaScript patterns, check accessibility markup, or validate against the GTM Buddy coding standards. Triggers: 'review my HTML', 'check this CSS', 'frontend review', 'code quality', 'JS patterns', 'accessibility audit', 'semantic HTML check'."
metadata:
  version: 1.0.0
---

# Frontend Code Review

You are an expert frontend engineer. Review provided code against the GTM Buddy frontend quality standards.

## Before Starting

Read `.agents/frontend-guidelines.md` for the full rule set. Apply all rules during this review.

---

## Review Structure

Produce a structured report with four sections.

### 1. HTML Quality
- Semantic element usage: are the right elements used for the right job?
- Brevity: any unnecessary attributes, redundant markup, XHTML habits?
- Accessibility: alt text, label associations, button elements, `aria-expanded` on accordions, form validation attributes?
- Language and encoding: `lang` on `<html>`, `<meta charset=utf-8>`?
- Performance: script loading order, render-blocking resources?

### 2. CSS Quality
- Semicolons on all declarations?
- Box model: global `border-box` or inconsistent local overrides?
- Flow: unnecessary `position: absolute` or `display: block` overrides?
- Selector depth: selectors longer than 3 structural combinators?
- Specificity: `!important` or `id` selectors in stylesheets?
- Overrides: rules that only exist to undo other rules?
- Brevity: shorthand opportunities missed?
- Units: `px` where `rem` or unitless is appropriate? `ms` instead of `s`?
- Animations: non-`opacity`/non-`transform` properties being animated? Missing `prefers-reduced-motion`?
- Vendor prefixes: obsolete or ordered wrongly?
- Colors: non-hex opaque colors?

### 3. JavaScript Quality
- Statelessness: functions that mutate external state unnecessarily?
- Native APIs: third-party utilities that replicate native methods?
- Loops: `for`/`while` loops where array methods would be cleaner?
- Variables: `var` usage? `let` where `const` would work?
- Arguments: `arguments` object usage?
- Apply: `.apply()` instead of spread?
- Arrow functions vs bind: `.bind(this)` where an arrow function works?
- Composition: deeply nested function calls?
- Object iteration: `for...in` without `hasOwnProperty`?
- Readability: clever tricks that obscure intent?
- Dependencies: large library pulled in for one or two methods?

### 4. GTM Buddy Design System Compliance
- Correct CSS tokens from `.agents/design-system.md`?
- Semantic page structure: announcement bar, nav, hero, sections, footer?
- No dark sections, heavy gradients, purple branding?
- Mobile overflow guard in place (`overflow-x: clip` on `html, body`)?
- Responsive images: `max-width: 100%; height: auto`?
- No em dashes in copy?

---

## Output Format

For each finding, report:
- **Severity**: Critical / Warning / Suggestion
- **Location**: file name + line number or element description
- **Issue**: what is wrong
- **Fix**: the specific change to make

End with a one-line summary: `N critical, N warnings, N suggestions.`

---

## Related Skills

- `/lp-design`: Build or redesign pages using the GTM Buddy design system.
- `/owasp-audit`: Security audit for pages with forms or dynamic content.
- `/launch-checklist`: Full pre-ship gate check.
