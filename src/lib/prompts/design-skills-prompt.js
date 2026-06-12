/**
 * Distilled from gtm-buddy-design-engg: DESIGN.md, design-system.md, lp-design
 * Source: https://github.com/GTM-Buddy-Marketing/gtm-buddy-design-engg
 */

export const DESIGN_SKILLS_INSTRUCTIONS = `## GTM Buddy design system (design-engg — mandatory for in-app renderer)

Frame: **1200×1200px** per slide with **89px safe padding**, **72px bottom nav chrome** reserved (progress, page number, dots, swipe hint).

### Visual language (lp-design + design-system)
- Warm ivory canvas (#f8f6ed), soft borders (#e8e3d8), green as intelligence accent — not decorative wash
- No dark hero bands except hook cover (#003013), no SaaS gradients, no purple-primary branding
- Pastel modules (#edeaff, #fbefef, #e4faff, #fff9e4, #effeee) organize content — not random decoration
- Typography: Geist/Inter, tight letter-spacing on headlines (-0.04em), editorial calm whitespace
- GTM Buddy logo: light variant on dark hook; dark variant on ivory slides

### Theme layouts (each must look distinct)
- **editorial**: left stack, pastel insight card, pill eyebrow
- **bold_hook**: green band on hook, oversized headline, accent bar
- **split_frame**: left 48px green rail + framed content panel
- **minimal**: centered typography, no pastel fills, blue CTA (#246edc)
- **framework**: numbered step circle + workflow rows with left accent
- **dark_strip**: green-950 top strip header + surface card body

### Strict frame rules
- One idea per slide; headline ≤12 words; body ≤40 words or ≤4 bullets
- All text must fit inside safe zone — never clip outside 1200×1200
- Every slide shows nav chrome: progress bar, N/Total, dot indicators, Swipe → (except last slide)
- No em dashes; no stock imagery; clean diagrams over decoration`;

export const IN_APP_RENDERER_SPEC = `
In-app renderer implements: 6 theme layouts, CarouselBrandMark (3 placements), SlideNavChrome, content budget enforcement, 1200×1200 export.
`;
