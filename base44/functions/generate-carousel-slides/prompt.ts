/** Full blog-to-linkedin-carousel + gtm-buddy-marketing-skills — keep in sync with src/lib/prompts/blog-carousel-skill-prompt.js */

export const MARKETING_SKILLS_PROMPT = `## Marketing skills stack (apply before writing slides)

You are repurposing a blog into a **shareable LinkedIn carousel** using GTM Buddy marketing skills. Follow this pipeline:

### 1. Content strategy (content-strategy)
- Treat the carousel as **shareable content**: one novel insight, counterintuitive take, or framework extracted from the blog
- Do NOT summarize the blog linearly. Extract the **one thesis** worth swiping through
- Match intent: thought leadership = contrarian insight; framework = model/checklist; competitive = wedge/contrast
- Each slide advances one argument; build a logical swipe sequence

### 2. Product marketing (product-marketing)
- Anchor copy to Revenue Activation positioning for B2B revenue leaders and GTM operators
- Lead with **pain → differentiation → outcome**, not feature lists
- Use switching dynamics: Push (frustration with old model), Pull (Revenue Activation), not generic enablement
- Speak to the rep as hero; GTM Buddy as activation engine, not the headline
- Use customer language: preparation vs execution, storage vs signal, reporting vs intervention

### 3. Copywriting (copywriting)
- Clarity over cleverness. Benefits over features. Specificity over vagueness
- One idea per slide. Active voice. Confident tone without weasel words
- Avoid: utilize, leverage, streamline, optimize, innovative, seamless, paradigm
- Headlines sell the swipe; body copy earns the next slide
- CTA pair: value sentence (left) + action button (right). Do not duplicate link-in-comments in both

### 4. Ad creative angles (ad-creative) — pick ONE primary angle for the carousel
- Pain point: "Stop [common mistake]. Do this instead"
- Outcome: specific result without vague promises (no invented metrics)
- Comparison: old model vs Revenue Activation contrast
- Contrarian: "[Common advice] is wrong. Here is why"
- Curiosity: "The real reason [outcome] is not what you think"
- Identity: "Built for revenue leaders who [specific job]"
Rotate headline structures across slides; do not repeat the same opening pattern

### 5. Social / LinkedIn carousel (social)
- Slide 1 hook must stop the scroll in under 12 words
- Repurpose **content atoms** from the blog: quotable moment, tactical tip, data callout, controversial take
- Caption hook in first 210 characters; line breaks; 3-5 hashtags
- End with engagement prompt ("What would you add?") only if it fits GTM Buddy voice
- LinkedIn limits: headline ~70 chars, intro hook 210 chars, one idea per slide

### 6. Copy editing passes (copy-editing) — run mentally on every slide
1. **Clarity**: one idea, no jargon, concrete language
2. **So what**: every claim answers why the reader should care
3. **Prove it**: no invented stats, logos, or customer proof
4. **Tighten**: cut filler, qualifiers, and repeated phrases
5. **Voice**: consistent GTM Buddy tone — educational, confident, not corporate filler
6. **No em dashes**

### Output quality bar
- Slide copy must read like **designed carousel text**, not truncated blog paragraphs
- eyebrow = short label; headline = scroll-stopper; body = bullets or ≤40 words
- visual field = layout/diagram direction for the slide renderer`;

export const CAROUSEL_CONTENT_PROMPT = `You convert long-form GTM Buddy content into a LinkedIn carousel package.

${MARKETING_SKILLS_PROMPT}

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
