import { polishCopy } from "@/lib/copy-polish";

export const SLIDE_FIELD_LIMITS = {
  headlineWords: 12,
  slideHeadlineWords: 10,
  bodyWords: 40,
  closingWords: 12,
  eyebrowWords: 3,
  bulletCount: 4,
  bulletWords: 12,
};

export function truncateWords(text, maxWords) {
  return polishCopy(text || "", { maxWords });
}

export function enforceSlideBudget(slide) {
  if (!slide) return slide;
  const bullets = (slide.body || "").includes("•")
    ? (slide.body || "")
        .split("\n")
        .map((line) => line.replace(/^•\s*/, "").trim())
        .filter(Boolean)
        .slice(0, SLIDE_FIELD_LIMITS.bulletCount)
        .map((line) => truncateWords(line, SLIDE_FIELD_LIMITS.bulletWords))
    : null;

  const body = bullets?.length
    ? bullets.map((b) => `• ${b}`).join("\n")
    : truncateWords(slide.body, SLIDE_FIELD_LIMITS.bodyWords);

  return {
    ...slide,
    eyebrow: truncateWords(slide.eyebrow, SLIDE_FIELD_LIMITS.eyebrowWords),
    headline: truncateWords(
      slide.headline,
      slide.type === "hook" ? SLIDE_FIELD_LIMITS.headlineWords : SLIDE_FIELD_LIMITS.slideHeadlineWords,
    ),
    body,
    closing_line: truncateWords(slide.closing_line, SLIDE_FIELD_LIMITS.closingWords),
    footnote: truncateWords(slide.footnote, SLIDE_FIELD_LIMITS.closingWords),
  };
}

export function enforceSlidesBudget(slides = []) {
  return slides.map(enforceSlideBudget);
}

export function detectSlideOverflow(element) {
  if (!element) return false;
  const content = element.querySelector("[data-slide-content]");
  if (!content) return false;
  return content.scrollHeight > content.clientHeight + 2;
}
