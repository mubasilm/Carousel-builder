import { normalizeSlides } from "@/lib/carousel-schema";
import {
  archetypeToTheme,
  buildExternalDesignPrompt,
  buildInAppDesignPrompt,
  inferArchetype,
} from "@/lib/design-prompt";
import { synthesizeCarouselFromBlog } from "@/lib/skill-content-engine";

export function generateCarouselLocally({ blogText, title, referenceUrls = [] }) {
  const synthesized = synthesizeCarouselFromBlog({ blogText, title });
  const visualArchetype = inferArchetype(blogText);
  const designTheme = archetypeToTheme(visualArchetype);
  const slides = normalizeSlides(synthesized.slides);

  const promptBase = {
    title: synthesized.title,
    slides,
    visualArchetype,
    carouselStrategy: synthesized.carousel_strategy,
    referenceUrls,
    themeId: designTheme,
    ctaSentence: synthesized.cta_sentence,
    ctaButton: synthesized.cta_button,
  };

  return {
    success: true,
    title: synthesized.title,
    slides,
    linkedin_caption: synthesized.linkedin_caption,
    hashtags: synthesized.hashtags,
    design_theme: designTheme,
    visual_archetype: visualArchetype,
    carousel_strategy: synthesized.carousel_strategy,
    cta_sentence: synthesized.cta_sentence,
    cta_button: synthesized.cta_button,
    figma_make_prompt: buildExternalDesignPrompt({ ...promptBase, target: "figma" }),
    external_design_prompt: buildExternalDesignPrompt({ ...promptBase, target: "claude" }),
    in_app_design_prompt: buildInAppDesignPrompt(promptBase),
    _source: "local-skill",
  };
}
