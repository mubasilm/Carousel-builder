import { BLOG_CAROUSEL_JSON_SCHEMA } from "@/lib/prompts/blog-carousel-skill-prompt";

export async function generateViaLocalLlm({ blogText, title, referenceUrls = [] }) {
  const res = await fetch("/api/generate-carousel", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ blogText, title, referenceUrls }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Local LLM failed (${res.status})`);
  }

  if (!data.slides?.length) {
    throw new Error("LLM returned no slides");
  }

  return { ...data, _source: data._source || "local-llm" };
}

export function getLocalLlmSchema() {
  return BLOG_CAROUSEL_JSON_SCHEMA;
}
