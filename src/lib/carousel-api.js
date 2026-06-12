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
import { getSetupStatus } from "@/lib/setup-check";

function isApiError(error) {
  const status = error?.status || error?.response?.status;
  const msg = String(error?.message || "");
  return status === 404 || status === 401 || status === 403 || msg.includes("404") || msg.includes("Network");
}

function isLlmUnavailable(error) {
  const msg = String(error?.message || "");
  return msg.includes("503") || msg.includes("No LLM API key");
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

  return packageResult({ ...result, _source: "llm" }, blogText, title, referenceUrls);
}

export async function fetchBlogContent(url) {
  const { isReady } = getSetupStatus();
  if (!isReady) {
    throw new Error("Blog URL fetch requires Base44. Paste the blog content instead, or configure .env.local.");
  }
  try {
    return await base44.functions.invoke("fetch-blog-content", { url });
  } catch (error) {
    if (isApiError(error)) {
      throw new Error(
        "Blog fetch failed. Paste the content directly, or deploy functions: npx base44 functions deploy",
      );
    }
    throw error;
  }
}

export async function generateCarouselSlides({ blogText, title, referenceUrls = [] }) {
  const { isReady } = getSetupStatus();

  if (isReady) {
    try {
      const result = await base44.functions.invoke("generate-carousel-slides", {
        blogText,
        title,
        referenceUrls,
      });
      if (result.success) {
        return packageResult({ ...result, _source: "function" }, blogText, title, referenceUrls);
      }
    } catch (error) {
      if (!isApiError(error)) throw error;
      try {
        return await generateViaLlm({ blogText, title, referenceUrls });
      } catch (llmError) {
        if (!isApiError(llmError)) throw llmError;
      }
    }
  }

  try {
    const llmResult = await generateViaLocalLlm({ blogText, title, referenceUrls });
    return packageResult(llmResult, blogText, title, referenceUrls);
  } catch (localLlmError) {
    if (!isLlmUnavailable(localLlmError)) throw localLlmError;
  }

  const local = generateCarouselLocally({ blogText, title, referenceUrls });
  return {
    ...packageResult(local, blogText, title, referenceUrls),
    _fallbackReason:
      "No AI configured. Add ANTHROPIC_API_KEY to .env.local and restart dev server, or deploy to Base44 for InvokeLLM.",
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
