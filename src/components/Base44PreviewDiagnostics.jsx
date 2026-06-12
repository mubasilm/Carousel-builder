import { APP_BUILD } from "@/lib/build-info";
import { getGenerationModeLabel } from "@/lib/setup-check";

export default function Base44PreviewDiagnostics({
  appId,
  generationSource,
  lastAiError,
}) {
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
          <dt className="text-amber-800">Last AI error</dt>
          <dd className="break-words">{lastAiError || "none"}</dd>
        </div>
      </dl>
      <p className="mt-2 text-amber-900">
        If build stamp is stale or you see 4 steps, run{" "}
        <code className="rounded bg-white/70 px-1">npx base44 deploy</code> after GitHub sync.
      </p>
    </div>
  );
}
