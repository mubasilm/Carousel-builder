import { base44 } from "@/api/base44Client";
import { normalizeSlides } from "@/lib/carousel-schema";
import {
  archetypeToTheme,
  buildExternalDesignPrompt,
  buildInAppDesignPrompt,
  inferArchetype,
} from "@/lib/design-prompt";
import { generateViaLocalLlm } from "@/lib/local-llm";
import { generateCarouselLocally } from "@/lib/local-generate";
import { BLOG_CAROUSEL_JSON_SCHEMA, BLOG_CAROUSEL_SKILL_INSTRUCTIONS } from "@/lib/prompts/blog-carousel-skill-prompt";
import { canUseLocalLlm, getSetupStatus } from "@/lib/setup-check";

const AI_TIMEOUT_MS = 8000;

function packageResult(result, blogText, title, referenceUrls = []) {
  const slides = normalizeSlides(result.slides || []);
  const visualArchetype = result.visual_archetype || inferArchetype(blogText);
  const designTheme = result.design_theme || archetypeToTheme(visualArchetype);
  const carouselStrategy = result.carousel_strategy || {
    thesis: result.title || title,
    audience: "B2B revenue leaders and GTM operators",
    source_type: "thought_leadership",
    slide_count_rationale: `${slides.length} slides based on source length`,
  };

  const promptOpts = {
    title: result.title || title,
    slides,
    visualArchetype,
    carouselStrategy,
    referenceUrls,
    themeId: designTheme,
    ctaSentence: result.cta_sentence || "",
    ctaButton: result.cta_button || "Read full blog",
  };

  const externalFigma =
    result.figma_make_prompt || result.external_design_prompt || buildExternalDesignPrompt({ ...promptOpts, target: "figma" });
  const externalClaude =
    result.external_design_prompt || buildExternalDesignPrompt({ ...promptOpts, target: "claude" });
  const inAppDesignPrompt = result.in_app_design_prompt || buildInAppDesignPrompt(promptOpts);

  return {
    success: true,
    title: result.title || title || "Untitled Carousel",
    slides,
    linkedin_caption: result.linkedin_caption || "",
    hashtags: result.hashtags || [],
    design_theme: designTheme,
    visual_archetype: visualArchetype,
    figma_make_prompt: externalFigma,
    external_design_prompt: externalClaude,
    in_app_design_prompt: inAppDesignPrompt,
    carousel_strategy: carouselStrategy,
    cta_sentence: result.cta_sentence || "",
    cta_button: result.cta_button || "Read full blog",
    _source: result._source || "local-skill",
    _fallbackReason: result._fallbackReason || "",
  };
}

function buildSkillDraft({ blogText, title, referenceUrls, reason = "" }) {
  const local = generateCarouselLocally({ blogText, title, referenceUrls });
  return packageResult(
    {
      ...local,
      _source: "local-skill",
      _fallbackReason: reason,
    },
    blogText,
    title,
    referenceUrls,
  );
}

function withTimeout(promise, ms, label = "AI request") {
  return Promise.race([
    promise,
    new Promise((resolve) => {
      setTimeout(() => resolve({ error: `${label} timed out after ${ms / 1000}s` }), ms);
    }),
  ]);
}

async function generateViaLlm({ blogText, title, referenceUrls }) {
  const refBlock = referenceUrls?.length
    ? `\nReference Figma frames (use as visual reference in design prompt):\n${referenceUrls.join("\n")}`
    : "";

  const prompt = `${BLOG_CAROUSEL_SKILL_INSTRUCTIONS}

IMPORTANT: Do NOT copy blog paragraphs into slides. Extract thesis, compress into carousel-native copy.

Blog title: ${title || "Untitled"}
Blog content:
${blogText.slice(0, 12000)}
${refBlock}

Generate the full carousel package JSON now. Include in_app_design_prompt for the in-browser renderer.`;

  const result = await base44.integrations.Core.InvokeLLM({
    prompt,
    response_json_schema: BLOG_CAROUSEL_JSON_SCHEMA,
  });

  if (!result?.slides?.length) {
    throw new Error("InvokeLLM returned no slides");
  }

  return packageResult({ ...result, _source: "llm" }, blogText, title, referenceUrls);
}

async function generateViaBase44Function({ blogText, title, referenceUrls }) {
  const result = await base44.functions.invoke("generate-carousel-slides", {
    blogText,
    title,
    referenceUrls,
  });

  if (!result?.success || !result?.slides?.length) {
    throw new Error(result?.error || "Function returned no slides");
  }

  return packageResult({ ...result, _source: "function" }, blogText, title, referenceUrls);
}

async function tryAiGeneration({ blogText, title, referenceUrls }) {
  const errors = [];

  const llmAttempt = await withTimeout(
    generateViaLlm({ blogText, title, referenceUrls }),
    AI_TIMEOUT_MS,
    "InvokeLLM",
  );
  if (llmAttempt?.slides?.length) return llmAttempt;
  errors.push(llmAttempt?.error || "InvokeLLM failed");

  const fnAttempt = await withTimeout(
    generateViaBase44Function({ blogText, title, referenceUrls }),
    AI_TIMEOUT_MS,
    "generate-carousel-slides",
  );
  if (fnAttempt?.slides?.length) return fnAttempt;
  errors.push(fnAttempt?.error || "Function failed");

  if (canUseLocalLlm()) {
    try {
      const llmResult = await generateViaLocalLlm({ blogText, title, referenceUrls });
      return packageResult(llmResult, blogText, title, referenceUrls);
    } catch (error) {
      errors.push(error?.message || "Local LLM failed");
    }
  }

  return { error: errors.join("; ") };
}

/** Synchronous skill-only generation — always works in browser, no network. */
export function generateCarouselSlidesSync({ blogText, title, referenceUrls = [] }) {
  const cleanText = (blogText || "").trim();
  if (cleanText.length < 50) {
    throw new Error("Please provide at least 50 characters of blog content.");
  }
  return buildSkillDraft({ blogText: cleanText, title, referenceUrls });
}

export async function fetchBlogContent(url) {
  const { isReady } = getSetupStatus();
  if (!isReady) {
    throw new Error("Blog URL fetch requires Base44. Paste the blog content instead.");
  }
  try {
    return await base44.functions.invoke("fetch-blog-content", { url });
  } catch (error) {
    throw new Error(error?.message || "Blog fetch failed. Paste the content directly.");
  }
}

export async function generateCarouselSlides({ blogText, title, referenceUrls = [] }) {
  const cleanText = (blogText || "").trim();
  if (cleanText.length < 50) {
    throw new Error("Please provide at least 50 characters of blog content for carousel generation.");
  }

  const skillDraft = buildSkillDraft({ blogText: cleanText, title, referenceUrls });
  if (!skillDraft.slides.length) {
    throw new Error("Carousel generation failed. No slides were produced.");
  }

  const { isReady, isHosted } = getSetupStatus();

  if (!isReady) {
    return {
      ...skillDraft,
      _fallbackReason: isHosted
        ? ""
        : "Using skill engine. Add ANTHROPIC_API_KEY locally or deploy on Base44 for full AI.",
    };
  }

  const aiResult = await tryAiGeneration({ blogText: cleanText, title, referenceUrls });
  if (aiResult?.slides?.length) {
    return aiResult;
  }

  return {
    ...skillDraft,
    _fallbackReason: `Using skill-engine copy (${aiResult?.error || "AI unavailable"}). Deploy: npx base44 functions deploy`,
  };
}

export async function saveCarouselProject({ projectId, payload }) {
  const { isReady } = getSetupStatus();
  if (!isReady) {
    const key = "carousel_project_draft";
    const saved = { ...payload, id: projectId || "local-draft", _localOnly: true };
    localStorage.setItem(key, JSON.stringify(saved));
    return saved;
  }

  try {
    if (projectId) {
      return await base44.entities.CarouselProject.update(projectId, payload);
    }
    return await base44.entities.CarouselProject.create(payload);
  } catch {
    const key = "carousel_project_draft";
    const saved = { ...payload, id: projectId || "local-draft", _localOnly: true };
    localStorage.setItem(key, JSON.stringify(saved));
    return saved;
  }
}
