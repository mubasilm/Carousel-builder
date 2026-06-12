export function mapAiError(raw = "") {
  const text = String(raw || "").trim();
  if (!text) return null;

  const lower = text.toLowerCase();

  if (lower.includes("404") || lower.includes("not found") || lower.includes("function returned")) {
    return {
      friendly:
        "AI upgrade unavailable — the backend function may not be deployed. Your draft slides are still ready to edit.",
      action: "Run: npx base44 functions deploy",
      technical: text,
    };
  }

  if (lower.includes("timed out") || lower.includes("timeout")) {
    return {
      friendly: "AI took too long — kept your draft slides. Try again or continue editing.",
      action: null,
      technical: text,
    };
  }

  if (lower.includes("401") || lower.includes("authentication") || lower.includes("sign in")) {
    return {
      friendly: "Sign in to Base44 for AI upgrades. Draft slides work without login.",
      action: null,
      technical: text,
    };
  }

  if (lower.includes("invokeLLM") && lower.includes("failed")) {
    return {
      friendly: "Base44 AI could not upgrade copy right now. Your skill-engine slides are still available.",
      action: "Check AI is enabled in your Base44 dashboard.",
      technical: text,
    };
  }

  return {
    friendly: "AI upgrade did not complete. Your draft slides are still ready.",
    action: null,
    technical: text,
  };
}

export function formatAiErrorForUser(raw = "") {
  const mapped = mapAiError(raw);
  if (!mapped) return "";
  return mapped.action ? `${mapped.friendly} ${mapped.action}` : mapped.friendly;
}

export function formatAiErrorChain(raw = "") {
  return raw
    .split(";")
    .map((part) => formatAiErrorForUser(part.trim()))
    .filter(Boolean)
    .join(" ");
}
