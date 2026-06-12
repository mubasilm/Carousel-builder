/** Full blog-to-linkedin-carousel skill — keep in sync with src/lib/prompts/blog-carousel-skill-prompt.js */

export const CAROUSEL_CONTENT_PROMPT = `You convert long-form GTM Buddy content into a LinkedIn carousel package.

## GTM Buddy rules (mandatory)
- Revenue Activation category, not generic enablement or productivity framing
- Keep claims crisp, specific, outcome-linked
- Preserve contrasts: preparation vs execution, search vs activation, reporting vs intervention
- No em dashes. Do not invent proof, ROI, customer numbers, or capabilities

## Classify the source
- thought_leadership | framework | technical | competitive
Default: shareable thought leadership.

## Slide count
- 4 slides: thesis, proof/problem, model, action/close
- 5 slides: thesis, two developments, implication, close
- 6-8 slides: long essays, PDF adaptation

## Slide copy (DO NOT copy blog paragraphs — rewrite for carousel)
Each slide: eyebrow, headline (cover under 12 words), body (max 40 words or 3-5 bullets), closing_line, footer, visual, type

## Visual archetype (pick ONE)
editorial_memo | structured_diagram | comparison_brief | signal_architecture

## Design defaults
- Hook cover: #003013 dark green, white type
- Interior: #f8f6ed ivory, 1080x1080

## Outputs required
- figma_make_prompt: ready for Figma Make
- in_app_design_prompt: layout spec for in-browser renderer
- cta_sentence + cta_button (CTA pair pattern)`;

export const CAROUSEL_JSON_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    carousel_strategy: {
      type: "object",
      properties: {
        thesis: { type: "string" },
        audience: { type: "string" },
        source_type: { type: "string" },
        slide_count_rationale: { type: "string" },
      },
    },
    visual_archetype: {
      type: "string",
      enum: ["editorial_memo", "structured_diagram", "comparison_brief", "signal_architecture"],
    },
    design_theme: {
      type: "string",
      enum: ["editorial", "bold_hook", "split_frame", "minimal", "framework", "dark_strip"],
    },
    figma_make_prompt: { type: "string" },
    in_app_design_prompt: { type: "string" },
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
    "slides",
    "linkedin_caption",
    "hashtags",
    "figma_make_prompt",
    "in_app_design_prompt",
    "visual_archetype",
    "design_theme",
  ],
};
