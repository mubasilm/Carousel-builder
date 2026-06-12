import { useEffect, useMemo, useState } from "react";
import GenerationStatus from "@/components/GenerationStatus";
import Base44PreviewDiagnostics from "@/components/Base44PreviewDiagnostics";
import { recommendSlideCount } from "@/lib/skill-content-engine";

export default function StepInput({
  sourceType,
  setSourceType,
  sourceUrl,
  setSourceUrl,
  sourceText,
  setSourceText,
  referenceUrls,
  setReferenceUrls,
  targetSlideCount,
  setTargetSlideCount,
  onGenerate,
  loading,
  error,
  showDiagnostics = false,
  appId = "",
  generationSource = "",
  lastAiError = "",
}) {
  const recommended = useMemo(() => {
    const text = sourceType === "paste" ? sourceText : "";
    return text.trim().length >= 50 ? recommendSlideCount(text) : 5;
  }, [sourceText, sourceType]);

  useEffect(() => {
    if (!targetSlideCount) {
      setTargetSlideCount(recommended);
    }
  }, [recommended, setTargetSlideCount, targetSlideCount]);

  const addReference = () => {
    setReferenceUrls([...referenceUrls, ""]);
  };

  const updateReference = (index, value) => {
    const next = [...referenceUrls];
    next[index] = value;
    setReferenceUrls(next);
  };

  const removeReference = (index) => {
    setReferenceUrls(referenceUrls.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <GenerationStatus />

      {showDiagnostics && (
        <Base44PreviewDiagnostics
          appId={appId}
          generationSource={generationSource}
          lastAiError={lastAiError}
        />
      )}

      <div className="card-panel">
        <h2 className="text-xl font-bold text-text">Blog input</h2>
        <p className="mt-2 text-sm text-muted">
          Paste blog content (50+ characters), choose slide count, then click Generate carousel.
        </p>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            className={sourceType === "url" ? "btn-primary" : "btn-secondary"}
            onClick={() => setSourceType("url")}
          >
            Blog URL
          </button>
          <button
            type="button"
            className={sourceType === "paste" ? "btn-primary" : "btn-secondary"}
            onClick={() => setSourceType("paste")}
          >
            Paste content
          </button>
        </div>

        {sourceType === "url" ? (
          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium text-text-soft">Blog URL</label>
            <input
              type="url"
              className="input-field"
              placeholder="https://gtmbuddy.ai/blog/..."
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
            />
          </div>
        ) : (
          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium text-text-soft">Blog content</label>
            <textarea
              className="input-field min-h-[240px] resize-y"
              placeholder="Paste the full blog article here..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
            />
          </div>
        )}

        <div className="mt-6">
          <label className="mb-1.5 block text-sm font-medium text-text-soft">
            Number of slides
            <span className="ml-2 text-xs font-normal text-muted">Recommended: {recommended}</span>
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="range"
              min={4}
              max={8}
              value={targetSlideCount || recommended}
              onChange={(e) => setTargetSlideCount(Number(e.target.value))}
              className="w-full max-w-xs"
            />
            <span className="rounded-full bg-green-soft px-3 py-1 text-sm font-semibold text-green-800">
              {targetSlideCount || recommended} slides
            </span>
            <button
              type="button"
              className="btn-secondary text-sm"
              onClick={() => setTargetSlideCount(recommended)}
            >
              Use recommended
            </button>
          </div>
          <p className="mt-1 text-xs text-muted">Minimum 4 slides. We suggest {recommended} based on blog length.</p>
        </div>
      </div>

      <div className="card-panel">
        <h3 className="text-base font-semibold text-text">Design inspiration (optional)</h3>
        <p className="mt-1 text-sm text-muted-light">
          Add Figma, LinkedIn carousel, Pinterest, or Dribbble links for visual direction inspiration — layout mood, not a pixel copy.
        </p>

        <div className="mt-4 space-y-2">
          {referenceUrls.map((url, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="url"
                className="input-field"
                placeholder="https://www.figma.com/design/... or LinkedIn carousel URL"
                value={url}
                onChange={(e) => updateReference(i, e.target.value)}
              />
              <button type="button" className="btn-secondary shrink-0" onClick={() => removeReference(i)}>
                Remove
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="btn-secondary mt-3" onClick={addReference}>
          Add inspiration link
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <button type="button" className="btn-primary" onClick={onGenerate} disabled={loading}>
        {loading ? "Generating slides..." : "Generate carousel"}
      </button>
    </div>
  );
}
