---
name: blog-to-linkedin-carousel
description: Convert a blog, essay, article, PDF, or thought-leadership draft into a LinkedIn carousel package aligned to GTM Buddy messaging. Use when Codex needs to: (1) extract the core thesis from long-form content, (2) compress it into 4-8 mobile-readable carousel slides, (3) write a Figma Make prompt for the carousel, (4) produce matching LinkedIn caption, CTA, and first-comment copy, or (5) adapt an existing PDF carousel into a reusable prompt/template.
---

# Blog To Linkedin Carousel

## Overview

Turn long-form GTM Buddy content into a carousel package that is faithful to the source, readable on LinkedIn, and ready for Figma Make or another AI design workflow.

Default output:
- carousel strategy
- slide-by-slide copy
- Figma Make prompt
- optional LinkedIn caption, CTA pair, and first-comment link copy

## Workflow

### 1. Load GTM Buddy context first

Before writing anything, read:
- `.agents/product-marketing-context.md`
- `.agents/content-governance.md`

Treat them as mandatory when they exist.

Apply these rules by default:
- keep GTM Buddy ontology disciplined: Revenue Activation, not generic productivity framing
- keep claims crisp, specific, and outcome-linked
- preserve category contrasts such as preparation vs execution, search vs activation, reporting vs intervention
- do not invent proof, ROI, customer numbers, or technical capabilities

### 2. Classify the source before compressing it

Decide what kind of source you are converting:
- **Thought leadership**: contrarian insight, named pattern, prediction, category argument
- **Framework**: structured model, comparison, checklist, process
- **Technical credibility**: engineering truth, limitations, architecture, scale, nuance
- **Competitive / comparison**: battlecard, wedge, differentiation, migration logic

Also decide whether the carousel is primarily:
- **shareable**: named pattern, contrarian thesis, strong save/share value
- **searchable**: educational or definitional, usually better for blog than carousel

For blog-to-carousel conversions, default to **shareable thought leadership** unless the user asks for a denser educational adaptation.

### 3. Decide the slide count and structure

Use the shortest structure that preserves the argument:
- **4 slides**: one thesis, one proof/problem, one model/explanation, one action/close
- **5 slides**: one thesis, two development slides, one implication, one action/close
- **6-8 slides**: longer essays, research pieces, or carousels that must stay close to an existing PDF

Use the matching pattern from [references/carousel-patterns.md](references/carousel-patterns.md).

### 4. Extract the argument, not the paragraphs

Before writing slides, identify:
- the main thesis
- the sharpest naming line
- the pattern or contrast doing the work
- the 2-4 supporting proofs or examples
- the practical action or takeaway

Do not mechanically summarize every paragraph.
Do not preserve blog structure when a cleaner carousel sequence exists.
Preserve the source's meaning, numbers, and caveats.

### 5. Write carousel-native slide copy

Make each slide carry one idea.

Use LinkedIn-friendly rules:
- hook-first cover slide
- short lines and high scanability
- one clear visual job per slide
- minimal jargon unless the point is explicitly technical
- no dense paragraphs

Preferred slide fields:
- `Eyebrow`
- `Headline`
- `Body`
- `Closing line` or `Callout`
- `Footer`
- `Visual`

Guidelines:
- cover headline should usually be under 12 words
- body copy should read cleanly on mobile
- if a slide contains a list, keep it to 3-5 items
- if the source includes a memorable doctrine-grade line, preserve it
- if the source includes a real technical caveat, keep it visible instead of sanding it down

### 6. Write the Figma Make prompt

Always produce a ready-to-paste Figma Make prompt after the slide copy.

The prompt should include:
- format and dimensions
- audience
- tone
- visual direction
- slide count
- slide-by-slide copy
- visual guidance per slide
- brand constraints
- quality bar

If the user provided a reference PDF, image, or prior carousel:
- tell Figma Make to use it as the visual reference
- if the user explicitly wants the PDF copy reused, state that the PDF is the source of truth for slide wording

If no reference is given, default to GTM Buddy editorial styling:
- dark forest green cover
- warm ivory interior slides
- sharp typography
- subtle branding
- structured whitespace
- clean diagrams instead of stock imagery

### 7. Add optional publishing extras

When useful, also provide:
- LinkedIn caption for the carousel post
- CTA strip copy for the final slide
- first-comment link copy
- matched CTA pair: left-side sentence plus button label

When writing CTA strips:
- do not repeat the same meaning in both the sentence and the button
- sentence should carry the value
- button should carry the action

Good pattern:
- main copy: `This is the short version. The full blog is in the first comment.`
- button: `Read full blog`

## Output Format

Use this structure unless the user asks for a narrower output:

### 1. Carousel Strategy
- thesis
- audience
- recommended slide count
- why this structure fits the source

### 2. Slide Copy
For each slide, provide:
- `Slide X`
- `Eyebrow`
- `Headline`
- `Body`
- `Closing line` or `Callout`
- `Footer`
- `Visual`

### 3. Figma Make Prompt
Return one fenced code block that is ready to paste into Figma Make.

### 4. Optional Publishing Extras
- `LinkedIn caption`
- `CTA strip`
- `First comment`

## Guardrails

- Do not invent claims, metrics, or customer proof
- Do not flatten GTM Buddy into generic enablement language
- Do not turn thought leadership into product copy unless the source already does that
- Do not over-compress technical arguments into fluffy AI language
- Do not use `link in comments` redundantly in both the CTA sentence and the button
- Do not preserve weak blog prose when the underlying argument is stronger than the wording

## When To Stay Close To The Source

Stay especially faithful when the source includes:
- named frameworks
- precise engineering limits
- competitive nuance
- softening language added for defensibility
- a doctrine-grade closing line

If the user says:
- `use the PDF copy`
- `keep exact wording`
- `stay very close to the essay`

then treat the referenced source as the copy authority and only tighten for layout.

## When To Be More Adaptive

Be more adaptive when the user says:
- `make it more visual`
- `shorten for 4 slides`
- `make it more LinkedIn-native`
- `turn this blog into a carousel`

In those cases:
- preserve the thesis
- preserve the sharpest lines
- cut repetition
- restructure for flow

## Resources

- Slide-structure and CTA patterns: [references/carousel-patterns.md](references/carousel-patterns.md)
