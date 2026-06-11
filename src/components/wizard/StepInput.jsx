export default function StepInput({
  sourceType,
  setSourceType,
  sourceUrl,
  setSourceUrl,
  sourceText,
  setSourceText,
  referenceUrls,
  setReferenceUrls,
  onGenerate,
  loading,
  error,
}) {
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
      <div className="card-panel">
        <h2 className="text-xl font-bold text-text">Blog input</h2>
        <p className="mt-2 text-sm text-muted">
          Paste a blog URL or the full article text. We will generate LinkedIn carousel slide copy.
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
      </div>

      <div className="card-panel">
        <h3 className="text-base font-semibold text-text">Design references (phase 2)</h3>
        <p className="mt-1 text-sm text-muted-light">
          Attach Figma frame URLs for future reference-driven design. Stored but not processed in MVP.
        </p>

        <div className="mt-4 space-y-2">
          {referenceUrls.map((url, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="url"
                className="input-field"
                placeholder="https://www.figma.com/design/..."
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
          Add reference URL
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
