import { getTheme } from "@/lib/design-themes";
import { resolveSlideLayout } from "@/lib/slide-layout";
import { IN_APP_RENDERER_SPEC } from "@/lib/prompts/design-skills-prompt";
import { SLIDE_PAD_PERCENT, SLIDE_SIZE } from "@/lib/slide-constants";

export const ARCHETYPE_LABELS = {
  editorial_memo: "Editorial memo — strong type, minimal graphics, premium whitespace",
  structured_diagram: "Structured diagram — loops, ladders, dependency maps, system flows",
  comparison_brief: "Comparison brief — two-column contrasts, matrices, wedges",
  signal_architecture: "Signal / architecture — nodes, orchestration, layered systems",
};

export const LAYOUT_LABELS = {
  "cover-dark-green": "Dark hook cover",
  "editorial-card": "Editorial card",
  "bullet-list": "Bullet list",
  "two-column": "Two-column contrast",
  "diagram-strip": "Diagram strip",
  "cta-split": "CTA split footer",
};

const VALID_LAYOUTS = Object.keys(LAYOUT_LABELS);

const ARCHETYPE_TO_THEME = {
  editorial_memo: "editorial",
  structured_diagram: "framework",
  comparison_brief: "split_frame",
  signal_architecture: "dark_strip",
};

export function archetypeToTheme(archetype) {
  return ARCHETYPE_TO_THEME[archetype] || "editorial";
}

export function inferArchetype(blogText = "") {
  const t = blogText.toLowerCase();
  if (/vs\.|versus|compare|comparison|wedge|battlecard/.test(t)) return "comparison_brief";
  if (/architecture|orchestrat|signal|pipeline|system|agent/.test(t)) return "signal_architecture";
  if (/framework|step|model|checklist|process|ladder/.test(t)) return "structured_diagram";
  return "editorial_memo";
}

/** Assign renderer layout keys to each slide (consumed by CarouselSlide via resolveSlideLayout). */
export function assignSlideLayouts(slides = [], visualArchetype = "editorial_memo") {
  return slides.map((slide) => {
    const layout = VALID_LAYOUTS.includes(slide.layout)
      ? slide.layout
      : resolveSlideLayout(slide, visualArchetype);
    return { ...slide, layout };
  });
}

/**
 * External design prompt for Figma Make or Claude — full creative brief.
 */
export function buildExternalDesignPrompt({
  title,
  slides,
  visualArchetype = "editorial_memo",
  carouselStrategy = {},
  referenceUrls = [],
  themeId = "editorial",
  ctaSentence = "",
  ctaButton = "",
  target = "figma",
}) {
  const theme = getTheme(themeId);
  const refNote = referenceUrls.filter(Boolean).length
    ? `\nDesign inspiration (layout mood, not pixel copy):\n${referenceUrls.filter(Boolean).map((u) => `- ${u}`).join("\n")}`
    : "";

  const slideBlocks = slides
    .map((s, i) => {
      return `Slide ${i + 1} (${s.type || "slide"})
Eyebrow: ${s.eyebrow || s.type || ""}
Headline: ${s.headline || ""}
Body: ${s.body || ""}
Closing line: ${s.closing_line || ""}
Footer: ${s.footer || ""}
Visual: ${s.visual || "Clean editorial layout with structured whitespace"}`;
    })
    .join("\n\n");

  const executor =
    target === "claude"
      ? "You are Claude generating production-ready LinkedIn carousel slide designs."
      : "Create this carousel in Figma Make.";

  return `${executor}

FORMAT
- ${SLIDE_SIZE} x ${SLIDE_SIZE} px per slide
- ${slides.length} slides total
- LinkedIn document / carousel post format

AUDIENCE
${carouselStrategy.audience || "B2B revenue leaders, GTM operators, enablement leaders"}

TONE
Educational, confident, editorial. Revenue Activation framing. No hype, no generic SaaS gradients.

VISUAL DIRECTION
Primary archetype: ${ARCHETYPE_LABELS[visualArchetype] || ARCHETYPE_LABELS.editorial_memo}
- Slide 1 (cover): dark forest green background (#003013), white typography, bold hook
- Interior slides: warm ivory (#f8f6ed) or ${theme.pageBg}, sharp Geist/Inter typography
- Accent green: #18a957 for eyebrows and highlights only
- Structured whitespace, clean diagrams instead of stock photos
- Subtle GTM Buddy branding bottom-left${refNote}

THESIS
${carouselStrategy.thesis || title}

SLIDE COPY
${slideBlocks}

CTA PAIR (final slide)
Value: ${ctaSentence || "This is the short version. The full blog is in the first comment."}
Button: ${ctaButton || "Read full blog"}

BRAND CONSTRAINTS
- Never pure white page backgrounds; use warm ivory
- No purple-primary branding, dark hero bands, or neon gradients
- Green is accent only, not a decorative wash
- CTA green: #00692B on final slide if needed

QUALITY BAR
- Mobile-readable: short lines, high scanability
- One visual job per slide
- Cover headline under 12 words
- Export-ready for LinkedIn PDF upload

${target === "claude" ? `OUTPUT: Describe each slide layout precisely, then produce final ${SLIDE_SIZE}x${SLIDE_SIZE} designs or HTML/CSS per slide.` : "OUTPUT: Generate all slides in Figma with the above copy and visual system."}`;
}

/** @deprecated use buildExternalDesignPrompt */
export function buildFigmaMakePrompt(opts) {
  return buildExternalDesignPrompt({ ...opts, target: "figma" });
}

/**
 * In-app design brief — drives the built-in slide renderer (layout, colors, diagram notes).
 */
export function buildInAppDesignPrompt({
  title,
  slides,
  visualArchetype = "editorial_memo",
  carouselStrategy = {},
  themeId = "editorial",
  ctaSentence = "",
  ctaButton = "",
}) {
  const theme = getTheme(themeId);
  const slidesWithLayouts = assignSlideLayouts(slides, visualArchetype);
  const slideSpecs = slidesWithLayouts
    .map((s, i) => {
      const layout = s.layout || resolveSlideLayout(s, visualArchetype);

      return `Slide ${i + 1} [${s.type}]
layout: ${layout}
eyebrow: ${s.eyebrow || ""}
headline: ${s.headline || ""}
body_style: ${theme.bodyStyle}
header_style: ${theme.headerStyle}
visual_note: ${s.visual || ""}
accent: ${theme.accent}
page_bg: ${i === 0 && s.type === "hook" ? "#003013" : theme.pageBg}`;
    })
    .join("\n\n");

  return `IN-APP CAROUSEL RENDER SPEC
${IN_APP_RENDERER_SPEC}
Theme: ${theme.label} (${themeId})
Archetype: ${ARCHETYPE_LABELS[visualArchetype]}
Thesis: ${carouselStrategy.thesis || title}
CTA: "${ctaSentence}" / [${ctaButton}]

GLOBAL
- Font: Geist / Inter stack
- Cover: #003013 bg, white type, light logo
- Interior: ${theme.pageBg}, dark logo
- Accent: ${theme.accent}
- ${SLIDE_SIZE}x${SLIDE_SIZE}, padding ${SLIDE_PAD_PERCENT}, nav chrome on every slide

SLIDES
${slideSpecs}`;
}
