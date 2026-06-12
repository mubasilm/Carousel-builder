import { SLIDE_TYPES } from "@/lib/carousel-schema";

export default function StepReview({
  slides,
  setSlides,
  linkedinCaption,
  setLinkedinCaption,
  hashtags,
  setHashtags,
  onRegenerateSlide,
  regeneratingIndex,
}) {
  const updateSlide = (index, field, value) => {
    setSlides(
      slides.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    );
  };

  const addSlide = () => {
    setSlides([
      ...slides,
      {
        index: slides.length + 1,
        type: "insight",
        eyebrow: "",
        headline: "",
        body: "",
        closing_line: "",
        footer: "",
        visual: "",
        footnote: "",
        cta: "",
      },
    ]);
  };

  const removeSlide = (index) => {
    setSlides(
      slides
        .filter((_, i) => i !== index)
        .map((s, i) => ({ ...s, index: i + 1 })),
    );
  };

  if (!slides.length) {
    return (
      <div className="card-panel text-center">
        <h2 className="text-xl font-bold text-text">No slides yet</h2>
        <p className="mt-2 text-sm text-muted">
          Go back to Input, paste at least 50 characters of blog content, and click Generate carousel.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card-panel">
        <h2 className="text-xl font-bold text-text">Review slide copy</h2>
        <p className="mt-2 text-sm text-muted">Edit headlines and body text before previewing the design.</p>
      </div>

      {slides.map((slide, i) => (
        <div key={slide.index ?? i} className="card-panel space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-green-800">
              Slide {i + 1}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn-secondary text-xs"
                onClick={() => onRegenerateSlide?.(i)}
                disabled={regeneratingIndex === i}
              >
                {regeneratingIndex === i ? "Regenerating..." : "Regenerate"}
              </button>
              {slides.length > 1 && (
                <button type="button" className="btn-secondary text-xs" onClick={() => removeSlide(i)}>
                  Remove
                </button>
              )}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">Type</label>
              <select
                className="input-field"
                value={slide.type}
                onChange={(e) => updateSlide(i, "type", e.target.value)}
              >
                {SLIDE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">Eyebrow</label>
              <input
                className="input-field"
                value={slide.eyebrow || ""}
                onChange={(e) => updateSlide(i, "eyebrow", e.target.value)}
                placeholder="Short label above headline"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Headline</label>
            <input
              className="input-field"
              value={slide.headline}
              onChange={(e) => updateSlide(i, "headline", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Body</label>
            <textarea
              className="input-field min-h-[80px] resize-y"
              value={slide.body}
              onChange={(e) => updateSlide(i, "body", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Closing line</label>
            <input
              className="input-field"
              value={slide.closing_line || ""}
              onChange={(e) => updateSlide(i, "closing_line", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Visual direction</label>
            <textarea
              className="input-field min-h-[60px] resize-y text-sm"
              value={slide.visual || ""}
              onChange={(e) => updateSlide(i, "visual", e.target.value)}
              placeholder="Layout / diagram hint for Figma Make"
            />
          </div>

          {slide.type === "cta" && (
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">CTA button text</label>
              <input
                className="input-field"
                value={slide.cta}
                onChange={(e) => updateSlide(i, "cta", e.target.value)}
              />
            </div>
          )}
        </div>
      ))}

      <button type="button" className="btn-secondary" onClick={addSlide}>
        Add slide
      </button>

      <div className="card-panel space-y-3">
        <h3 className="font-semibold text-text">LinkedIn caption</h3>
        <textarea
          className="input-field min-h-[160px] resize-y"
          value={linkedinCaption}
          onChange={(e) => setLinkedinCaption(e.target.value)}
        />
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Hashtags (comma-separated)</label>
          <input
            className="input-field"
            value={hashtags.join(", ")}
            onChange={(e) =>
              setHashtags(
                e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean),
              )
            }
          />
        </div>
      </div>
    </div>
  );
}
