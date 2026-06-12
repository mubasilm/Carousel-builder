import { ARCHETYPE_LABELS } from "@/lib/design-prompt";

const ARCHETYPE_IDS = Object.keys(ARCHETYPE_LABELS);

export default function ArchetypePicker({ value, onChange }) {
  return (
    <div className="card-panel space-y-3">
      <h3 className="font-semibold text-text">Visual archetype</h3>
      <p className="text-sm text-muted">Controls slide layout patterns (diagrams, two-column, editorial). Independent from color theme.</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {ARCHETYPE_IDS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className="rounded-lg border px-3 py-2 text-left text-sm transition"
            style={{
              borderColor: value === id ? "var(--green-accent)" : "var(--border)",
              background: value === id ? "var(--green-soft)" : "var(--surface)",
            }}
          >
            <span className="font-medium text-text">{ARCHETYPE_LABELS[id]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
