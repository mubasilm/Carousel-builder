import { ARCHETYPE_LABELS } from "@/lib/design-prompt";
import { DESIGN_THEMES, THEME_IDS } from "@/lib/design-themes";

export default function DesignThemePicker({ themeId, onChange, onShuffle, visualArchetype }) {
  return (
    <div className="card-panel space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-text">Design style</h3>
          <p className="mt-1 text-sm text-muted">
            Layout themes from GTM Buddy design-engg. The skill also picks a visual archetype for Figma Make.
          </p>
          {visualArchetype && (
            <p className="mt-1 text-xs text-text-soft">
              Suggested archetype: {ARCHETYPE_LABELS[visualArchetype] || visualArchetype}
            </p>
          )}
        </div>
        <button type="button" className="btn-secondary" onClick={onShuffle}>
          Shuffle design
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {THEME_IDS.map((id) => {
          const theme = DESIGN_THEMES[id];
          const selected = themeId === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className="rounded-xl border p-4 text-left transition"
              style={{
                borderColor: selected ? "var(--green-accent)" : "var(--border)",
                background: selected ? "var(--green-soft)" : theme.pageBg,
                boxShadow: selected ? "var(--shadow-card)" : "none",
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ background: theme.accent }}
                />
                <span className="text-sm font-semibold text-text">{theme.label}</span>
              </div>
              <p className="mt-1 text-xs text-muted">{theme.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
