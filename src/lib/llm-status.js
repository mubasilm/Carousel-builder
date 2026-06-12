let cached = null;

export async function fetchLocalLlmStatus() {
  try {
    const res = await fetch("/api/llm-status");
    if (!res.ok) return { available: false, provider: null, model: null };
    cached = await res.json();
    return cached;
  } catch {
    return { available: false, provider: null, model: null };
  }
}

export function getCachedLlmStatus() {
  return cached;
}
