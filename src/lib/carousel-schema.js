export const SLIDE_TYPES = ["hook", "problem", "insight", "takeaway", "cta"];

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
};

export function createEmptySlide(index, type = "insight") {
  return {
    index,
    type,
    headline: "",
    body: "",
    footnote: "",
    cta: "",
  };
}

export function normalizeSlides(slides = []) {
  return slides.map((slide, i) => ({
    index: slide.index ?? i + 1,
    type: slide.type || "insight",
    headline: slide.headline || "",
    body: slide.body || "",
    footnote: slide.footnote || "",
    cta: slide.cta || "",
  }));
}
