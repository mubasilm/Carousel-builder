import { LOGO_PLACEMENT_LABELS, LOGO_PLACEMENTS } from "@/lib/slide-constants";

export default function LogoPlacementPicker({ value, onChange }) {
  return (
    <div className="card-panel space-y-3">
      <h3 className="font-semibold text-text">Logo placement</h3>
      <p className="text-sm text-muted">GTM Buddy logo on every slide — light variant on dark hook, dark variant on ivory slides.</p>
      <div className="grid gap-2 sm:grid-cols-3">
        {LOGO_PLACEMENTS.map((id) => (
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
            {LOGO_PLACEMENT_LABELS[id]}
          </button>
        ))}
      </div>
    </div>
  );
}
