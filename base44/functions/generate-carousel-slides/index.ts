import { createClientFromRequest } from "npm:@base44/sdk";
import { CAROUSEL_CONTENT_PROMPT, CAROUSEL_JSON_SCHEMA } from "./prompt.ts";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json(
        {
          success: false,
          error:
            "Sign in to Base44 to use AI generation. Skill-engine slides still work without login.",
        },
        { status: 401 },
      );
    }

    const { blogText, title, file_urls, referenceUrls } = await req.json();
    if (!blogText || typeof blogText !== "string" || blogText.trim().length < 50) {
      return Response.json(
        { success: false, error: "Blog text must be at least 50 characters" },
        { status: 400 },
      );
    }

    const refBlock = referenceUrls?.length
      ? `\nReference Figma frames:\n${referenceUrls.join("\n")}`
      : "";

    const prompt = `${CAROUSEL_CONTENT_PROMPT}

CRITICAL: Do NOT copy blog paragraphs into slides. Extract thesis and rewrite for LinkedIn carousel.

Blog title: ${title || "Untitled"}
Blog content:
${blogText.slice(0, 12000)}
${refBlock}

Generate the full carousel package JSON now.`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: CAROUSEL_JSON_SCHEMA,
      ...(file_urls?.length ? { file_urls } : {}),
    });

    const slides = (result.slides || []).map((slide: Record<string, unknown>, i: number) => ({
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

    return Response.json({
      success: true,
      title: result.title || title || "Untitled Carousel",
      slides,
      linkedin_caption: result.linkedin_caption || "",
      hashtags: result.hashtags || [],
      design_theme: result.design_theme || "editorial",
      visual_archetype: result.visual_archetype || "editorial_memo",
      figma_make_prompt: result.figma_make_prompt || "",
      in_app_design_prompt: result.in_app_design_prompt || "",
      carousel_strategy: result.carousel_strategy || null,
      cta_sentence: result.cta_sentence || "",
      cta_button: result.cta_button || "",
    });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate carousel slides",
        success: false,
      },
      { status: 500 },
    );
  }
});
