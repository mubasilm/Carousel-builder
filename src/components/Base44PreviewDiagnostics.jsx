import { useState } from "react";
import { APP_BUILD } from "@/lib/build-info";
import { formatAiErrorForUser } from "@/lib/ai-error-messages";
import { getGenerationModeLabel } from "@/lib/setup-check";

export default function Base44PreviewDiagnostics({
  appId,
  generationSource,
  lastAiError,
}) {
  const [showTechnical, setShowTechnical] = useState(false);
  const friendlyError = formatAiErrorForUser(lastAiError);

  return (
    <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50/80 px-4 py-3 text-xs text-amber-950">
      <p className="font-semibold uppercase tracking-wide">Base44 preview diagnostics</p>
      <dl className="mt-2 grid gap-1 sm:grid-cols-2">
        <div>
          <dt className="text-amber-800">Build stamp</dt>
          <dd className="font-mono">{APP_BUILD}</dd>
        </div>
        <div>
          <dt className="text-amber-800">App ID</dt>
          <dd className="font-mono break-all">{appId || "not detected"}</dd>
        </div>
        <div>
          <dt className="text-amber-800">Last generation source</dt>
          <dd>{generationSource ? getGenerationModeLabel(generationSource) : "none yet"}</dd>
        </div>
        <div>
          <dt className="text-amber-800">Last AI status</dt>
          <dd className="break-words">{friendlyError || "none"}</dd>
        </div>
      </dl>
      {lastAiError && (
        <button
          type="button"
          className="mt-2 text-xs font-medium text-amber-900 underline"
          onClick={() => setShowTechnical((v) => !v)}
        >
          {showTechnical ? "Hide technical details" : "Show technical details"}
        </button>
      )}
      {showTechnical && lastAiError && (
        <p className="mt-2 rounded bg-white/70 p-2 font-mono text-[10px] text-amber-950">{lastAiError}</p>
      )}
    </div>
  );
}
