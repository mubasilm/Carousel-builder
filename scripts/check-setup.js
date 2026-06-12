#!/usr/bin/env node
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

const root = resolve(import.meta.dirname, "..");
const envPath = resolve(root, ".env.local");

console.log("Blog Carousel Studio — setup check\n");

if (!existsSync(envPath)) {
  console.log("❌ .env.local missing");
  console.log("   Run: cp .env.example .env.local");
  console.log("   Add ANTHROPIC_API_KEY=sk-ant-... for local Claude AI\n");
} else {
  const env = readFileSync(envPath, "utf8");
  const hasAnthropic = /ANTHROPIC_API_KEY=\S+/.test(env);
  const hasOpenAI = /OPENAI_API_KEY=\S+/.test(env);
  const hasBase44 = /VITE_BASE44_APP_ID=\S+/.test(env) && /VITE_BASE44_APP_BASE_URL=\S+/.test(env);

  console.log(hasAnthropic ? "✅ ANTHROPIC_API_KEY set (Claude local)" : "⚠️  ANTHROPIC_API_KEY not set");
  console.log(hasOpenAI ? "✅ OPENAI_API_KEY set" : "○  OPENAI_API_KEY not set (optional)");
  console.log(hasBase44 ? "✅ Base44 env vars set" : "○  Base44 not configured (optional for local)");

  if (!hasAnthropic && !hasOpenAI && !hasBase44) {
    console.log("\n❌ No AI configured — generation will use heuristic skill engine only.");
  } else {
    console.log("\n✅ AI generation available after npm run dev");
  }
}
