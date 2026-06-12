---
name: figma-qa
description: "Compare a Figma design file against the GTM Buddy design system (DESIGN.md) and optionally a live or staging URL. Use when the user provides a figma.com URL, asks to review a design handoff, check if Figma matches the brand system, compare a Webflow implementation against its Figma source, or validate a designer's work before the Webflow dev starts building. Automatically triggered when any figma.com URL is mentioned in this workspace. Requires Figma MCP. Produces a token diff table with ready-to-use CSS variable corrections and handoff notes for the developer."
metadata:
  version: 1.0.0
allowed-tools: Read
---

# GTM Buddy Figma QA

Catches design drift before it reaches Webflow. Run this at handoff, not after the page is built.

---

## Before Starting

Read these files automatically:
- `DESIGN.md` — normative token values (YAML frontmatter is the source of truth)
- `.agents/design-system.md` — component specs, pastel sequence, visual rules
- `.agents/content-governance.md` — copy rules for any text layers in Figma

---

## Input

| Input | Behavior |
|-------|---------|
| Figma URL only | Mode 1: Figma vs DESIGN.md |
| Figma URL + staging/live URL | Mode 2: Figma vs DESIGN.md vs rendered page |

If Figma MCP is not authenticated, instruct: "Run `/figma-qa` to trigger auth, or authenticate Figma MCP in Claude Code settings → MCP → Figma."

---

## Mode 1: Figma vs DESIGN.md

### Step 1: Read the Figma file

Use Figma MCP to read the file:
- Extract all styles: color styles, text styles, effect styles
- Extract all local variables / variable collections if present
- Identify major frames (by name — look for names matching page skeleton sections: Hero, Nav, Scenic Card, Workflow, FAQ, Footer, etc.)
- Extract component instances and their overrides

### Step 2: Token comparison

Compare each extracted Figma value against the corresponding token in `DESIGN.md` YAML frontmatter.

Build a diff table:

| Property | Figma value | DESIGN.md token | DESIGN.md value | Status |
|----------|-------------|-----------------|-----------------|--------|
| Page background | `#f8f8f8` | `colors.page-bg` | `#f8f6ed` | ❌ Wrong |
| Brand green | `#1db954` | `colors.green-accent` | `#18a957` | ❌ Wrong |
| CTA button | `#2468dc` | `colors.cta-blue` | `#246edc` | ❌ Wrong |
| H1 font | Inter | `typography.h1.fontFamily` | Geist | ❌ Wrong |
| ... | | | | |

Flag any value that:
- Does not match a DESIGN.md token exactly
- Uses pure white (`#ffffff`) as a page/section background
- Uses purple as a primary color
- Uses a dark background on any full-width section
- Uses a non-approved font

### Step 3: Component and structure checks

Check the Figma frames against the required page skeleton from `design-system.md`:

| Section | Present in Figma | Notes |
|---------|-----------------|-------|
| Announcement bar | ✓ / ✗ | |
| Main nav | ✓ / ✗ | |
| Hero (two-column) | ✓ / ✗ | |
| Scenic explainer card | ✓ / ✗ | Must have landscape bg + inner white panel |
| Workflow module (pastel rows) | ✓ / ✗ | Check pastel sequence order |
| Comparison or framework module | ✓ / ✗ | |
| Secondary scenic card | ✓ / ✗ | |
| FAQ accordion | ✓ / ✗ | |
| Split closing CTA | ✓ / ✗ | Left headline + right 3-button stack |
| Footer with manifesto | ✓ / ✗ | Must include "Unlock Revenue Capacity Now." |

**Pastel sequence check:** In any workflow module, verify the row background colors appear in this exact order: Lavender (`#edeaff`) → Blush (`#fbefef`) → Aqua (`#e4faff`) → Butter (`#fff9e4`) → Mint (`#effeee`). Flag if out of order or if a color is skipped.

### Step 4: Copy layer checks

For all text layers in the Figma file:
- Flag em dashes `—` → [FAIL] — show the layer name and suggest rewrite
- Flag "sales enablement platform", "AI productivity tool", "digital sales room" → [FAIL]
- Flag lorem ipsum or placeholder text → [FAIL]
- Flag CTAs that don't use canonical URLs from `product-marketing-context.md` → [WARN]
- Flag generic CTA copy ("Learn More", "Submit", "Click Here") → [WARN]

---

## Mode 2: Figma vs DESIGN.md vs Live Page

Run Mode 1 first, then add this step.

### Step 5: Playwright crawl

Use Playwright MCP to crawl the provided URL (same sequence as `/qa` DOM extractions).

Build a three-column diff:

| Property | Figma spec | DESIGN.md token | Rendered value | Status |
|----------|-----------|-----------------|----------------|--------|
| Page background | `#f8f8f8` | `#f8f6ed` | `rgb(248,246,237)` | ❌ Figma wrong; page correct |
| H1 font | Inter | Geist | Geist | ⚠️ Figma wrong; page correct |
| CTA color | `#246edc` | `#246edc` | `rgb(36,110,220)` | ✅ All match |
| Footer manifesto | Present | Required | Missing | ❌ Missing from live page |

Status key:
- ✅ All three match
- ⚠️ Figma deviates from DESIGN.md but page is correct (update Figma, not the page)
- ❌ Page deviates from DESIGN.md (developer must fix)
- ❌ Figma and page both deviate (fix both)

---

## Report Format

```markdown
# Figma QA Report — [Figma file name]
[Mode 1 / Mode 2]  |  Audited: [YYYY-MM-DD]
Status: ❌ [N] issues | ✅ Clean

---

## Token Diff

| Property | Figma | DESIGN.md | [Live page] | Status |
|----------|-------|-----------|-------------|--------|
| ...      |       |           |             |        |

---

## ❌ Issues to Fix Before Webflow Build

### 1. [Issue]
**What's wrong:** [One sentence]
**In Figma:** [Layer/frame name]
**Correct value:** [Exact CSS variable or hex]
**CSS fix for developer:**
```css
/* Replace this */
background-color: #f8f8f8;
/* With this */
background-color: var(--page-bg); /* #f8f6ed */
```

---

## ⚠️ Figma Deviations (page is already correct — update Figma to match)

[List tokens where Figma is wrong but the live page is already using the right value]

---

## ✅ Passed

[Brief list of what matches across Figma, DESIGN.md, and live page]

---

## Handoff Notes for Developer

Summary of CSS variables to use, in order of priority:

| Element | CSS variable | Value |
|---------|-------------|-------|
| Page background | `var(--page-bg)` | `#f8f6ed` |
| Brand green | `var(--green-accent)` | `#18a957` |
| CTA button | `var(--cta-blue)` | `#246edc` |
| ... | | |

Copy issues found in Figma text layers:
[List with ready-to-paste rewrites in GTM Buddy voice]

---

## Next steps

1. Fix Figma token issues above before the Webflow build begins
2. Share corrected Figma file with developer
3. After build: run `/qa [staging-url]` to verify implementation
4. When all clear: run `/launch-checklist`
```

---

## Skill Chaining

- After Figma issues are fixed and build is complete → `/qa [staging-url]`
- If copy rewrites needed → `/copywriting`
- After QA passes → `/launch-checklist`
