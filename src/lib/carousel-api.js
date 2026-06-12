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

function isApiError(error) {
  const status = error?.status || error?.response?.status;
  const msg = String(error?.message || "");
  return status === 404 || status === 401 || status === 403 || status === 500 || msg.includes("404") || msg.includes("Network");
}

function isRecoverableAiError(error) {
  const msg = String(error?.message || error?.data?.error || "");
  return (
    isApiError(error) ||
    msg.includes("503") ||
    msg.includes("No LLM API key") ||
    msg.includes("Local LLM failed") ||
    msg.includes("Function returned") ||
    msg.includes("no slides")
  );
}

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
    _source: result._source || "llm",
  };
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

  if (!result?.success) {
    throw new Error(result?.error || "Function returned unsuccessful response");
  }
  if (!result?.slides?.length) {
    throw new Error("Function returned no slides");
  }

  return packageResult({ ...result, _source: "function" }, blogText, title, referenceUrls);
}

export async function fetchBlogContent(url) {
  const { isReady } = getSetupStatus();
  if (!isReady) {
    throw new Error("Blog URL fetch requires Base44. Paste the blog content instead.");
  }
  try {
    return await base44.functions.invoke("fetch-blog-content", { url });
  } catch (error) {
    if (isApiError(error)) {
      throw new Error("Blog fetch failed. Paste the content directly, or deploy: npx base44 functions deploy");
    }
    throw error;
  }
}

export async function generateCarouselSlides({ blogText, title, referenceUrls = [] }) {
  const cleanText = (blogText || "").trim();
  if (cleanText.length < 100) {
    throw new Error("Please provide at least 100 characters of blog content for carousel generation.");
  }

  const { isReady, isHosted } = getSetupStatus();
  let aiError = null;

  if (isReady) {
    try {
      return await generateViaBase44Function({ blogText: cleanText, title, referenceUrls });
    } catch (error) {
      aiError = error;
      if (!isRecoverableAiError(error)) throw error;
    }

    try {
      return await generateViaLlm({ blogText: cleanText, title, referenceUrls });
    } catch (error) {
      aiError = error;
      if (!isRecoverableAiError(error)) throw error;
    }
  }

  if (canUseLocalLlm()) {
    try {
      const llmResult = await generateViaLocalLlm({ blogText: cleanText, title, referenceUrls });
      return packageResult(llmResult, cleanText, title, referenceUrls);
    } catch (error) {
      aiError = error;
      if (!isRecoverableAiError(error)) throw error;
    }
  }

  const local = generateCarouselLocally({ blogText: cleanText, title, referenceUrls });
  const packaged = packageResult({ ...local, _source: "local-skill" }, cleanText, title, referenceUrls);

  if (!packaged.slides.length) {
    throw new Error("Carousel generation failed. No slides were produced.");
  }

  if (aiError && isReady) {
    packaged._fallbackReason =
      `Base44 AI unavailable (${aiError.message || "unknown error"}). Showing skill-engine draft — deploy functions with: npx base44 functions deploy`;
  } else if (aiError && !isHosted) {
    packaged._fallbackReason =
      "No AI configured. Add ANTHROPIC_API_KEY to .env.local and restart dev server, or connect Base44 for InvokeLLM.";
  }

  return packaged;
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
  } catch (error) {
    if (isApiError(error)) {
      const key = "carousel_project_draft";
      const saved = { ...payload, id: projectId || "local-draft", _localOnly: true };
      localStorage.setItem(key, JSON.stringify(saved));
      return saved;
    }
    throw error;
  }
}
