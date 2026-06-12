export const SLIDE_TYPES = ["hook", "problem", "insight", "takeaway", "cta"];

export const VISUAL_ARCHETYPES = [
  "editorial_memo",
  "structured_diagram",
  "comparison_brief",
  "signal_architecture",
];

export const EMPTY_PROJECT = {
  title: "",
  source_type: "paste",
  source_url: "",
  source_text: "",
  slides: [],
  linkedin_caption: "",
  hashtags: [],
  status: "draft",
  reference_urls: [],
  design_theme: "editorial",
  visual_archetype: "editorial_memo",
  figma_make_prompt: "",
  external_design_prompt: "",
  in_app_design_prompt: "",
  carousel_strategy: null,
  cta_sentence: "",
  cta_button: "",
};

export function createEmptySlide(index, type = "insight") {
  return {
    index,
    type,
    eyebrow: "",
    headline: "",
    body: "",
    closing_line: "",
    footer: "",
    visual: "",
    footnote: "",
    cta: "",
  };
}

export function normalizeSlides(slides = []) {
  return slides.map((slide, i) => ({
    index: slide.index ?? i + 1,
    type: slide.type || "insight",
    eyebrow: slide.eyebrow || "",
    headline: slide.headline || "",
    body: slide.body || "",
    closing_line: slide.closing_line || "",
    footer: slide.footer || "",
    visual: slide.visual || "",
    footnote: slide.footnote || slide.closing_line || "",
    cta: slide.cta || "",
  }));
}
