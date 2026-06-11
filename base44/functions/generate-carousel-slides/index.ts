import { createClientFromRequest } from "npm:@base44/sdk";
import { CAROUSEL_CONTENT_PROMPT, CAROUSEL_JSON_SCHEMA } from "./prompt.ts";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: "Authentication required" }, { status: 401 });
    }

    const { blogText, title, file_urls } = await req.json();
    if (!blogText || typeof blogText !== "string" || blogText.trim().length < 100) {
      return Response.json(
        { error: "Blog text must be at least 100 characters" },
        { status: 400 },
      );
    }

    const prompt = `${CAROUSEL_CONTENT_PROMPT}

Blog title: ${title || "Untitled"}
Blog content:
${blogText.slice(0, 12000)}

Generate the carousel JSON now.`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: CAROUSEL_JSON_SCHEMA,
      ...(file_urls?.length ? { file_urls } : {}),
    });

    const slides = (result.slides || []).map((slide: Record<string, unknown>, i: number) => ({
      index: slide.index ?? i + 1,
      type: slide.type || "insight",
      headline: slide.headline || "",
      body: slide.body || "",
      footnote: slide.footnote || "",
      cta: slide.cta || "",
    }));

    return Response.json({
      success: true,
      title: result.title || title || "Untitled Carousel",
      slides,
      linkedin_caption: result.linkedin_caption || "",
      hashtags: result.hashtags || [],
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
