/** GTM Buddy carousel design themes — vendored from design-engg, varied layouts per carousel */

export const DESIGN_THEMES = {
  editorial: {
    id: "editorial",
    label: "Editorial Warm",
    description: "Classic ivory canvas with pastel insight blocks",
    pageBg: "#f8f6ed",
    accent: "#18a957",
    headerStyle: "pill",
    bodyStyle: "pastel-card",
    headlineAlign: "left",
    showAccentBar: false,
  },
  bold_hook: {
    id: "bold_hook",
    label: "Bold Hook",
    description: "Oversized hook typography with green band accents",
    pageBg: "#fbfaf4",
    accent: "#064f2a",
    headerStyle: "band",
    bodyStyle: "open",
    headlineAlign: "left",
    showAccentBar: true,
  },
  split_frame: {
    id: "split_frame",
    label: "Split Frame",
    description: "Left accent rail with framed content panel",
    pageBg: "#fcfbf6",
    accent: "#08703c",
    headerStyle: "rail",
    bodyStyle: "framed",
    headlineAlign: "left",
    showAccentBar: true,
  },
  minimal: {
    id: "minimal",
    label: "Minimal Clean",
    description: "More whitespace, no pastel fills, typography-led",
    pageBg: "#ffffff",
    accent: "#18a957",
    headerStyle: "minimal",
    bodyStyle: "plain",
    headlineAlign: "center",
    showAccentBar: false,
  },
  framework: {
    id: "framework",
    label: "Framework Steps",
    description: "Numbered workflow rows with rotating pastel sequence",
    pageBg: "#f8f6ed",
    accent: "#18a957",
    headerStyle: "step",
    bodyStyle: "workflow-row",
    headlineAlign: "left",
    showAccentBar: false,
  },
  dark_strip: {
    id: "dark_strip",
    label: "Dark Strip",
    description: "Green-950 top strip with editorial body (announcement-bar motif)",
    pageBg: "#f8f6ed",
    accent: "#003013",
    headerStyle: "dark-strip",
    bodyStyle: "surface-card",
    headlineAlign: "left",
    showAccentBar: false,
  },
};

export const PASTEL_SEQUENCE = [
  "#edeaff",
  "#fbefef",
  "#e4faff",
  "#fff9e4",
  "#effeee",
];

export const THEME_IDS = Object.keys(DESIGN_THEMES);

export function pickThemeForContent(blogText = "", title = "") {
  const seed = `${title}${blogText.slice(0, 500)}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % THEME_IDS.length;
  return THEME_IDS[index];
}

export function getTheme(themeId) {
  return DESIGN_THEMES[themeId] || DESIGN_THEMES.editorial;
}

export function getSlidePastel(theme, slideIndex) {
  return PASTEL_SEQUENCE[slideIndex % PASTEL_SEQUENCE.length];
}
