import { useState } from "react";
import CarouselSlide from "./CarouselSlide";

export default function CarouselPreview({ slides }) {
  const [current, setCurrent] = useState(0);
  const total = slides.length;

  if (!total) {
    return (
      <div className="card-panel text-center text-muted">
        No slides to preview yet. Generate or add slides in the review step.
      </div>
    );
  }

  const go = (delta) => {
    setCurrent((prev) => Math.max(0, Math.min(total - 1, prev + delta)));
  };

  return (
    <div className="space-y-4">
      <div className="mx-auto max-w-xl overflow-hidden rounded-xl border border-border shadow-soft">
        <CarouselSlide
          slide={slides[current]}
          slideIndex={current + 1}
          totalSlides={total}
        />
      </div>

      <div className="flex items-center justify-center gap-3">
        <button type="button" className="btn-secondary" onClick={() => go(-1)} disabled={current === 0}>
          Previous
        </button>
        <span className="text-sm text-muted">
          Slide {current + 1} of {total}
        </span>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => go(1)}
          disabled={current === total - 1}
        >
          Next
        </button>
      </div>

      <div className="flex justify-center gap-1.5">
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
