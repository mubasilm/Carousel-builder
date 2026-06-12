import { useEffect, useState } from "react";
import CarouselSlide from "./CarouselSlide";

const SLIDE_FIELDS = [
  { key: "eyebrow", label: "Eyebrow", rows: 1 },
  { key: "headline", label: "Headline", rows: 2 },
  { key: "body", label: "Body", rows: 5 },
  { key: "closing_line", label: "Closing line", rows: 2 },
  { key: "visual", label: "Visual direction", rows: 3 },
];

function PreviewChrome({
  slides,
  current,
  setCurrent,
  themeId,
  visualArchetype,
  logoPlacement,
  ctaSentence,
  ctaButton,
  centered = false,
}) {
  const total = slides.length;
  const slide = slides[current];

  const go = (delta) => {
    setCurrent((prev) => Math.max(0, Math.min(total - 1, prev + delta)));
  };

  return (
    <div className={`space-y-4 ${centered ? "mx-auto max-w-2xl" : ""}`}>
      <div className={`overflow-hidden rounded-xl border border-border shadow-soft ${centered ? "" : "mx-auto max-w-xl lg:mx-0"}`}>
        <CarouselSlide
          slide={slide}
          slideIndex={current + 1}
          totalSlides={total}
          themeId={themeId}
          visualArchetype={visualArchetype}
          logoPlacement={logoPlacement}
          ctaSentence={ctaSentence}
          ctaButton={ctaButton}
        />
      </div>

      <div className={`flex items-center justify-center gap-3 ${centered ? "" : "lg:justify-start"}`}>
        <button type="button" className="btn-secondary" onClick={() => go(-1)} disabled={current === 0}>
          Previous
        </button>
        <span className="text-sm text-muted">
          Slide {current + 1} of {total}
        </span>
        <button type="button" className="btn-secondary" onClick={() => go(1)} disabled={current === total - 1}>
          Next
        </button>
      </div>

      <div className={`flex justify-center gap-1.5 ${centered ? "" : "lg:justify-start"}`}>
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            className="h-2 rounded-full transition-all"
            style={{
              width: i === current ? 24 : 8,
              background: i === current ? "var(--green-accent)" : "var(--border-strong)",
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function CarouselPreview({
  slides,
  setSlides,
  themeId = "editorial",
  visualArchetype = "editorial_memo",
  logoPlacement = "bottom_left",
  ctaSentence = "",
  ctaButton = "",
  readOnly = false,
  initialSlide = 0,
  centered = false,
}) {
  const [current, setCurrent] = useState(initialSlide);
  const total = slides.length;

  useEffect(() => {
    setCurrent(Math.min(initialSlide, Math.max(0, total - 1)));
  }, [initialSlide, total]);

  if (!total) {
    return (
      <div className="card-panel text-center text-muted">
        No slides to preview yet. Generate or add slides in the review step.
      </div>
    );
  }

  const slide = slides[current];

  const updateSlide = (field, value) => {
    if (!setSlides || readOnly) return;
    setSlides(slides.map((s, i) => (i === current ? { ...s, [field]: value } : s)));
  };

  const chrome = (
    <PreviewChrome
      slides={slides}
      current={current}
      setCurrent={setCurrent}
      themeId={themeId}
      visualArchetype={visualArchetype}
      logoPlacement={logoPlacement}
      ctaSentence={ctaSentence}
      ctaButton={ctaButton}
      centered={centered || readOnly}
    />
  );

  if (readOnly) {
    return chrome;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-6 lg:grid-cols-2">
        {chrome}

        <div className="card-panel space-y-4">
          <div>
            <h3 className="font-semibold text-text">Edit slide copy</h3>
            <p className="mt-1 text-sm text-muted">Changes update the preview and export instantly.</p>
          </div>

          {SLIDE_FIELDS.map(({ key, label, rows }) => (
            <div key={key}>
              <label className="mb-1 block text-xs font-medium text-muted">{label}</label>
              {rows > 2 ? (
                <textarea
                  className="input-field min-h-[80px] resize-y text-sm"
                  rows={rows}
                  value={slide[key] || ""}
                  onChange={(e) => updateSlide(key, e.target.value)}
                />
              ) : (
                <input
                  className="input-field text-sm"
                  value={slide[key] || ""}
                  onChange={(e) => updateSlide(key, e.target.value)}
                />
              )}
            </div>
          ))}

          {slide.type === "cta" && (
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">CTA button</label>
              <input
                className="input-field text-sm"
                value={slide.cta || ""}
                onChange={(e) => updateSlide("cta", e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
