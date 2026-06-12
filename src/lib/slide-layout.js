/** Resolve in-app slide layout from visual archetype + slide content */

export const LAYOUT_VARIANTS = {
  "cover-dark-green": { bodyStyle: "open", showDiagram: false, columns: 1 },
  "editorial-card": { bodyStyle: "pastel-card", showDiagram: false, columns: 1 },
  "bullet-list": { bodyStyle: "workflow-row", showDiagram: false, columns: 1, parseBullets: true },
  "two-column": { bodyStyle: "framed", showDiagram: false, columns: 2 },
  "diagram-strip": { bodyStyle: "workflow-row", showDiagram: true, columns: 1 },
  "cta-split": { bodyStyle: "surface-card", showDiagram: false, columns: 1, showCtaPair: true },
};

export function resolveSlideLayout(slide, visualArchetype = "editorial_memo") {
  if (slide?.layout) return slide.layout;
  if (slide?.type === "hook") return "cover-dark-green";
  if (slide?.type === "cta") return "cta-split";
  if (slide?.body?.includes("•")) return "bullet-list";
  if (visualArchetype === "comparison_brief") return "two-column";
  if (visualArchetype === "structured_diagram" || visualArchetype === "signal_architecture") {
    return "diagram-strip";
  }
  return "editorial-card";
}

export function parseBulletBody(body = "") {
  if (!body.includes("•")) return null;
  return body
    .split("\n")
    .map((line) => line.replace(/^•\s*/, "").trim())
    .filter(Boolean);
}
