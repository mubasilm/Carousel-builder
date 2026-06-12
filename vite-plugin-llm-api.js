import { loadEnv } from "vite";
import { readFileSync } from "fs";
import { resolve } from "path";

function readBody(req) {
  return new Promise((resolveBody, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolveBody(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function getLlmKeys(env) {
  const anthropicKey = env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;
  const openaiKey = env.OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  const model = env.ANTHROPIC_MODEL || process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";
  return { anthropicKey, openaiKey, model };
}

function loadSkillInstructions() {
  try {
    const skillPath = resolve(process.cwd(), "src/lib/prompts/blog-carousel-skill-prompt.js");
    const mod = readFileSync(skillPath, "utf8");
    const match = mod.match(/export const BLOG_CAROUSEL_SKILL_INSTRUCTIONS = `([\s\S]*?)`;/);
    return match?.[1] || "";
  } catch {
    return "";
  }
}

function parseJsonFromText(text) {
  const cleaned = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error(`LLM did not return valid JSON. Preview: ${cleaned.slice(0, 200)}`);
  }
}

async function callAnthropic({ apiKey, model, prompt }) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 8192,
      system:
        "You are a GTM Buddy carousel strategist using the blog-to-linkedin-carousel skill. Return ONLY valid JSON. No markdown fences, no commentary.",
      messages: [
        {
          role: "user",
          content: `${prompt}\n\nRespond with a single JSON object only.`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API ${res.status}: ${err.slice(0, 400)}`);
  }

  const data = await res.json();
  const text = data.content?.find((b) => b.type === "text")?.text || "";
  return parseJsonFromText(text);
}

async function callOpenAI({ apiKey, prompt }) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a GTM Buddy carousel strategist using the blog-to-linkedin-carousel skill. Return only valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API ${res.status}: ${err.slice(0, 400)}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || "{}";
  return parseJsonFromText(text);
}

function buildCarouselPrompt({ skill, blogText, title, referenceUrls }) {
  const refBlock = referenceUrls.length
    ? `\nReference Figma frames:\n${referenceUrls.join("\n")}`
    : "";

  return `${skill}

CRITICAL: Do NOT copy blog paragraphs into slides. Extract the thesis, rewrite for LinkedIn carousel format.
Each slide = one idea. Headlines under 12 words. Body max 40 words or 3-5 bullets.

Blog title: ${title || "Untitled"}
Blog content:
${(blogText || "").slice(0, 14000)}
${refBlock}

Return JSON with keys: title, carousel_strategy, visual_archetype, design_theme, figma_make_prompt, in_app_design_prompt, slides, linkedin_caption, cta_sentence, cta_button, hashtags.

slides[] fields: index, type, eyebrow, headline, body, closing_line, footer, visual, cta`;
}

export function llmApiPlugin() {
  return {
    name: "llm-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const env = loadEnv(server.config.mode, process.cwd(), "");
        const { anthropicKey, openaiKey, model } = getLlmKeys(env);

        if (req.url === "/api/llm-status" && req.method === "GET") {
          res.statusCode = 200;
          res.setHeader("content-type", "application/json");
          res.end(
            JSON.stringify({
              available: Boolean(anthropicKey || openaiKey),
              provider: anthropicKey ? "anthropic" : openaiKey ? "openai" : null,
              model: anthropicKey ? model : openaiKey ? "gpt-4o" : null,
            }),
          );
          return;
        }

        if (req.url !== "/api/generate-carousel" || req.method !== "POST") {
          return next();
        }

        if (!anthropicKey && !openaiKey) {
          res.statusCode = 503;
          res.setHeader("content-type", "application/json");
          res.end(
            JSON.stringify({
              error:
                "No LLM API key. Create .env.local with ANTHROPIC_API_KEY=sk-ant-... then restart npm run dev",
            }),
          );
          return;
        }

        try {
          const raw = await readBody(req);
          const { blogText, title, referenceUrls = [] } = JSON.parse(raw);
          const skill = loadSkillInstructions();
          const prompt = buildCarouselPrompt({ skill, blogText, title, referenceUrls });

          const result = anthropicKey
            ? await callAnthropic({ apiKey: anthropicKey, model, prompt })
            : await callOpenAI({ apiKey: openaiKey, prompt });

          res.statusCode = 200;
          res.setHeader("content-type", "application/json");
          res.end(
            JSON.stringify({
              success: true,
              ...result,
              _source: anthropicKey ? "local-anthropic" : "local-openai",
            }),
          );
        } catch (err) {
          res.statusCode = 500;
          res.setHeader("content-type", "application/json");
          res.end(JSON.stringify({ error: err.message || "LLM generation failed" }));
        }
      });
    },
  };
}
