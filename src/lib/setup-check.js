import { appParams } from "@/lib/app-params";

export function getSetupStatus() {
  const missing = [];

  if (!appParams.appId) {
    missing.push("VITE_BASE44_APP_ID");
  }
  if (!appParams.appBaseUrl) {
    missing.push("VITE_BASE44_APP_BASE_URL");
  }

  return {
    isReady: missing.length === 0,
    missing,
    appId: appParams.appId,
    appBaseUrl: appParams.appBaseUrl,
    localLlmHint: "ANTHROPIC_API_KEY or OPENAI_API_KEY in .env.local (dev server only)",
  };
}

export function getGenerationModeLabel(source) {
  const labels = {
    local: "Heuristic (add API key for AI)",
    "local-skill": "Skill engine",
    "local-llm": "Local AI",
    "local-anthropic": "Claude (local)",
    "local-openai": "OpenAI (local)",
    function: "Base44 function",
    llm: "Base44 LLM",
  };
  return labels[source] || source;
}

export function getSetupErrorMessage(missing) {
  return `Missing Base44 config: ${missing.join(", ")}. Create .env.local from .env.example with values from your Base44 app dashboard, then restart the dev server.`;
}
