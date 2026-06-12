import { useState } from "react";
import { ARCHETYPE_LABELS } from "@/lib/design-prompt";

const TABS = [
  { id: "external-figma", label: "Figma Make" },
  { id: "external-claude", label: "Claude / external" },
  { id: "in-app", label: "In-app renderer" },
];

export default function DesignOutputsPanel({
  figmaMakePrompt,
  externalDesignPrompt,
  inAppDesignPrompt,
  visualArchetype,
  carouselStrategy,
}) {
  const [tab, setTab] = useState("external-figma");
  const [copied, setCopied] = useState(false);

  const prompts = {
    "external-figma": figmaMakePrompt,
    "external-claude": externalDesignPrompt,
    "in-app": inAppDesignPrompt,
  };

  const activePrompt = prompts[tab];
  if (!activePrompt && !figmaMakePrompt) return null;

  const copy = async () => {
    await navigator.clipboard.writeText(activePrompt || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const descriptions = {
    "external-figma": "Paste into Figma Make to generate polished slide designs outside this tool.",
    "external-claude": "Paste into Claude (or another AI design agent) to execute the full visual design.",
    "in-app": "Spec that drives the built-in carousel preview and PDF export in this tool.",
  };

  return (
    <div className="card-panel space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-text">Design outputs</h3>
          <p className="mt-1 text-sm text-muted">{descriptions[tab]}</p>
        </div>
        <button type="button" className="btn-primary text-sm" onClick={copy}>
          {copied ? "Copied!" : "Copy prompt"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className="rounded-full px-3 py-1 text-xs font-medium transition"
            style={{
              background: tab === t.id ? "var(--green-soft)" : "transparent",
              color: tab === t.id ? "var(--green-800)" : "var(--muted)",
              border: `1px solid ${tab === t.id ? "var(--green-accent)" : "var(--border)"}`,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {visualArchetype && (
        <p className="text-sm text-text-soft">
          Visual archetype: <strong>{ARCHETYPE_LABELS[visualArchetype] || visualArchetype}</strong>
        </p>
      )}

      {carouselStrategy?.thesis && (
        <p className="text-sm text-muted">Thesis: {carouselStrategy.thesis}</p>
      )}

      <pre className="max-h-96 overflow-auto rounded-lg border border-border bg-page-soft p-4 text-xs leading-relaxed text-text-soft whitespace-pre-wrap">
        {activePrompt || "No prompt generated yet."}
      </pre>
    </div>
  );
}
