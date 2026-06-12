/**
 * Prompts distilled from blog-to-linkedin-carousel skill
 * + gtm-buddy-marketing-skills (content-strategy, copywriting, copy-editing, product-marketing, ad-creative, social)
 * Sources: src/lib/skills/blog-to-linkedin-carousel/SKILL.md, src/lib/skills/marketing/*.md
 */

import { MARKETING_SKILLS_INSTRUCTIONS } from "@/lib/prompts/marketing-skills-prompt";
import { DESIGN_SKILLS_INSTRUCTIONS } from "@/lib/prompts/design-skills-prompt";

export const BLOG_CAROUSEL_SKILL_INSTRUCTIONS = `You convert long-form GTM Buddy content into a LinkedIn carousel package.

${MARKETING_SKILLS_INSTRUCTIONS}

${DESIGN_SKILLS_INSTRUCTIONS}

## GTM Buddy rules (mandatory)
- Revenue Activation category, not generic enablement or productivity framing
- Keep claims crisp, specific, outcome-linked
- Preserve contrasts: preparation vs execution, search vs activation, reporting vs intervention
- No em dashes. Do not invent proof, ROI, customer numbers, or capabilities

## Classify the source
- thought_leadership: contrarian insight, named pattern, prediction
- framework: structured model, comparison, checklist, process
- technical: engineering truth, limitations, architecture
- competitive: battlecard, wedge, differentiation

Default carousel mode: shareable thought leadership.

## Slide count (pick shortest structure that preserves the argument)
- 4 slides: one thesis, proof/problem, model, action/close
- 5 slides: thesis, two developments, implication, close
- 6-8 slides: long essays, research, PDF adaptation

Patterns from carousel-patterns.md:
- 4-slide: thesis → proof → explanation → action
- 5-slide: thesis → pattern → shift → implication → close
- 6-8: hook → frame → proof1 → proof2 → implication → future → action → close

## Slide copy rules
Each slide: one idea. Fields required:
- eyebrow: short label (uppercase pill text)
- headline: under 12 words on cover
- body: mobile-readable, max 40 words, 3-5 bullets if list
- closing_line: optional callout line
- footer: optional footer text
- visual: visual direction for this slide (diagram type, layout note)
- layout: in-app renderer layout — cover-dark-green | editorial-card | bullet-list | two-column | diagram-strip | cta-split
- type: hook | problem | insight | takeaway | cta

## Visual archetype (pick ONE for the whole carousel)
- editorial_memo: strong type, minimal graphics, premium whitespace
- structured_diagram: loops, ladders, dependency maps, system flows
- comparison_brief: two-column contrasts, matrices, wedges
- signal_architecture: nodes, orchestration, layered systems, context maps

## Design defaults (when no reference provided)
- Slide 1 (hook): dark forest green cover (#003013), white type
- Interior slides: warm ivory (#f8f6ed), sharp typography, structured whitespace
- Clean diagrams instead of stock imagery
- 1200x1200px LinkedIn document format with 89px safe padding and nav chrome

## Figma Make prompt
Generate a complete ready-to-paste Figma Make prompt including:
format/dimensions, audience, tone, visual direction, slide count,
slide-by-slide copy, visual notes per slide, brand constraints, quality bar.

## Publishing extras
- linkedin_caption: hook in first 210 chars, line breaks, 3-5 hashtags
- cta_sentence: value on the left (e.g. "This is the short version. The full blog is in the first comment.")
- cta_button: action only (e.g. "Read full blog") — do NOT repeat link-in-comments in both`;

export const BLOG_CAROUSEL_JSON_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    carousel_strategy: {
      type: "object",
      properties: {
        thesis: { type: "string" },
        audience: { type: "string" },
        source_type: {
          type: "string",
          enum: ["thought_leadership", "framework", "technical", "competitive"],
        },
        slide_count_rationale: { type: "string" },
      },
      required: ["thesis", "audience", "source_type"],
    },
    visual_archetype: {
      type: "string",
      enum: ["editorial_memo", "structured_diagram", "comparison_brief", "signal_architecture"],
    },
    design_theme: {
      type: "string",
      enum: ["editorial", "bold_hook", "split_frame", "minimal", "framework", "dark_strip"],
    },
    figma_make_prompt: { type: "string", description: "Ready-to-paste Figma Make prompt" },
    in_app_design_prompt: { type: "string", description: "In-browser slide renderer spec" },
    slides: {
      type: "array",
      items: {
        type: "object",
        properties: {
          index: { type: "number" },
          type: { type: "string", enum: ["hook", "problem", "insight", "takeaway", "cta"] },
          eyebrow: { type: "string" },
          headline: { type: "string" },
          body: { type: "string" },
          closing_line: { type: "string" },
          footer: { type: "string" },
          visual: { type: "string" },
          layout: {
            type: "string",
            enum: ["cover-dark-green", "editorial-card", "bullet-list", "two-column", "diagram-strip", "cta-split"],
          },
          footnote: { type: "string" },
          cta: { type: "string" },
        },
        required: ["index", "type", "headline", "eyebrow", "visual"],
      },
    },
    linkedin_caption: { type: "string" },
    cta_sentence: { type: "string" },
    cta_button: { type: "string" },
    hashtags: { type: "array", items: { type: "string" } },
  },
  required: [
    "title",
    "carousel_strategy",
    "visual_archetype",
    "design_theme",
    "figma_make_prompt",
    "slides",
    "linkedin_caption",
    "hashtags",
  ],
};
