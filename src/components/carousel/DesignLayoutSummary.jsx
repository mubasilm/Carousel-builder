import { assignSlideLayouts, LAYOUT_LABELS } from "@/lib/design-prompt";

export default function DesignLayoutSummary({ slides = [], visualArchetype = "editorial_memo" }) {
  const withLayouts = assignSlideLayouts(slides, visualArchetype);

  if (!withLayouts.length) return null;

  return (
    <div className="card-panel">
      <h3 className="text-sm font-semibold text-text">Renderer layouts</h3>
      <p className="mt-1 text-xs text-muted">What the in-app exporter will render per slide.</p>
      <ul className="mt-3 space-y-1.5">
        {withLayouts.map((s, i) => (
          <li key={s.index ?? i} className="flex flex-wrap items-baseline gap-x-2 text-sm text-muted">
            <span>
              Slide {i + 1} <span className="text-muted-light">({s.type})</span>
            </span>
            <span className="text-text font-medium">{LAYOUT_LABELS[s.layout] || s.layout}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
