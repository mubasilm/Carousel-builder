import { useEffect, useState } from "react";
import { fetchLocalLlmStatus } from "@/lib/llm-status";
import { getSetupStatus } from "@/lib/setup-check";

export default function GenerationStatus() {
  const { isReady: base44Ready, isHosted } = getSetupStatus();
  const [llm, setLlm] = useState({ available: false, loading: !isHosted });

  useEffect(() => {
    if (isHosted) return;
    fetchLocalLlmStatus().then((status) => setLlm({ ...status, loading: false }));
  }, [isHosted]);

  const modes = [];
  if (base44Ready) {
    modes.push({
      label: isHosted ? "Base44 AI (hosted)" : "Base44 AI",
      active: true,
      detail:
        "Marketing skills stack (content-strategy, copywriting, copy-editing, product-marketing, ad-creative, social) → function → InvokeLLM → skill engine",
    });
  }
  if (llm.available) {
    modes.push({
      label: llm.provider === "anthropic" ? `Claude (${llm.model})` : "OpenAI",
      active: !base44Ready,
      detail: "Local dev API key",
    });
  }
  if (!base44Ready && !llm.available) {
    modes.push({
      label: "Skill engine only",
      active: true,
      detail:
        "Marketing-skills heuristics (copywriting, ad-creative, social hooks) — add Base44 or ANTHROPIC_API_KEY for full AI",
    });
  }

  return (
    <div className="rounded-lg border border-border bg-page-soft p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-muted">Generation mode</p>
      <ul className="mt-2 space-y-2">
        {modes.map((m) => (
          <li key={m.label} className="flex items-start gap-2 text-sm">
            <span
              className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
              style={{ background: m.active ? "var(--green-accent)" : "var(--border-strong)" }}
            />
            <span>
              <strong className="text-text">{m.label}</strong>
              {m.active && <span className="ml-1 text-green-800">(active)</span>}
              <br />
              <span className="text-xs text-muted">{m.detail}</span>
            </span>
          </li>
        ))}
      </ul>
      {!isHosted && !llm.loading && !llm.available && !base44Ready && (
        <pre className="mt-3 overflow-x-auto rounded bg-white p-2 text-xs text-text-soft">
{`ANTHROPIC_API_KEY=sk-ant-...  # in .env.local, then npm run dev`}
        </pre>
      )}
    </div>
  );
}
