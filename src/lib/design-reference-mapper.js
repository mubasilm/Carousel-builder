import { pickThemeForContent } from "@/lib/design-themes";

const ARCHETYPE_HINTS = [
  { pattern: /figma|dribbble|behance|pinterest|linkedin.*carousel|carousel/i, archetype: "editorial_memo", theme: "editorial" },
  { pattern: /comparison|versus|vs|split|two.?column/i, archetype: "comparison_brief", theme: "split_frame" },
  { pattern: /diagram|flow|framework|step|process|workflow/i, archetype: "structured_diagram", theme: "framework" },
  { pattern: /minimal|clean|whitespace|typography/i, archetype: "editorial_memo", theme: "minimal" },
  { pattern: /dark|announcement|strip|bold/i, archetype: "signal_architecture", theme: "dark_strip" },
  { pattern: /hook|cover|hero|bold/i, archetype: "editorial_memo", theme: "bold_hook" },
];

export function mapDesignReferences({ referenceUrls = [], blogText = "", title = "" }) {
  const combined = `${referenceUrls.join(" ")} ${blogText.slice(0, 300)} ${title}`.toLowerCase();
  let archetype = null;
  let theme = null;
  const matched = [];

  for (const hint of ARCHETYPE_HINTS) {
    if (hint.pattern.test(combined)) {
      archetype = hint.archetype;
      theme = hint.theme;
      matched.push(hint.pattern.source);
      break;
    }
  }

  if (!theme && (blogText || title)) {
    theme = pickThemeForContent(blogText, title);
  }

  return {
    visualArchetype: archetype,
    designTheme: theme,
    inspirationNote: referenceUrls.filter(Boolean).length
      ? `Visual direction inspired by ${referenceUrls.filter(Boolean).length} reference link(s) — layout mood, not a pixel copy.`
      : "",
    matchedPatterns: matched,
  };
}
