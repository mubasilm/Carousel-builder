import { useState } from "react";
import { ARCHETYPE_LABELS } from "@/lib/design-prompt";

export default function FigmaMakePromptPanel({
  figmaMakePrompt,
  visualArchetype,
  carouselStrategy,
  onRegenerate,
  loading,
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(figmaMakePrompt || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!figmaMakePrompt) return null;

  return (
    <div className="card-panel space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-text">Figma Make design prompt</h3>
          <p className="mt-1 text-sm text-muted">
            From blog-to-linkedin-carousel skill. Paste into Figma Make for AI layout generation.
          </p>
        </div>
        <div className="flex gap-2">
          {onRegenerate && (
            <button type="button" className="btn-secondary text-sm" onClick={onRegenerate} disabled={loading}>
              {loading ? "Regenerating..." : "Refresh prompt"}
            </button>
          )}
          <button type="button" className="btn-primary text-sm" onClick={copy}>
            {copied ? "Copied!" : "Copy prompt"}
          </button>
        </div>
      </div>

      {visualArchetype && (
        <p className="text-sm text-text-soft">
          Visual archetype: <strong>{ARCHETYPE_LABELS[visualArchetype] || visualArchetype}</strong>
        </p>
      )}

      {carouselStrategy?.thesis && (
        <p className="text-sm text-muted">
          Thesis: {carouselStrategy.thesis}
        </p>
      )}

      <pre className="max-h-96 overflow-auto rounded-lg border border-border bg-page-soft p-4 text-xs leading-relaxed text-text-soft whitespace-pre-wrap">
        {figmaMakePrompt}
      </pre>
    </div>
  );
}
