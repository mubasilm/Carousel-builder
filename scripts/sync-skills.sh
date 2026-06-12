#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MARKETING="${MARKETING_SKILLS:-$ROOT/../gtm-buddy-marketing-skills}"
DESIGN="${DESIGN_ENGG:-$ROOT/../gtm-buddy-design-engg}"

BLOG_CAROUSEL="${BLOG_CAROUSEL_SKILL:-$ROOT/src/lib/skills/blog-to-linkedin-carousel}"

mkdir -p "$ROOT/src/lib/skills/marketing" "$ROOT/src/lib/skills/design" "$ROOT/src/lib/skills/blog-to-linkedin-carousel"

if [[ -d "$MARKETING" ]]; then
  cp "$MARKETING/skills/social/SKILL.md" "$ROOT/src/lib/skills/marketing/social-skill.md"
  cp "$MARKETING/skills/social/references/post-templates.md" "$ROOT/src/lib/skills/marketing/post-templates.md"
  cp "$MARKETING/skills/social/references/platforms.md" "$ROOT/src/lib/skills/marketing/platforms.md"
  cp "$MARKETING/.agents/content-governance.md" "$ROOT/src/lib/skills/marketing/content-governance.md"
  echo "Synced marketing skills"
else
  echo "Skip marketing: $MARKETING not found"
fi

if [[ -d "$DESIGN" ]]; then
  cp "$DESIGN/DESIGN.md" "$ROOT/src/lib/skills/design/DESIGN.md"
  cp "$DESIGN/.agents/design-system.md" "$ROOT/src/lib/skills/design/design-system.md"
  echo "Synced design-engg"
else
  echo "Skip design: $DESIGN not found"
fi

if [[ -f "$BLOG_CAROUSEL/SKILL.md" ]]; then
  echo "blog-to-linkedin-carousel skill present"
elif [[ -f "${BLOG_CAROUSEL_SKILL_ZIP:-}" ]]; then
  unzip -o "$BLOG_CAROUSEL_SKILL_ZIP" -d "$ROOT/src/lib/skills/blog-to-linkedin-carousel"
  echo "Synced blog-to-linkedin-carousel from zip"
else
  echo "Skip blog carousel: vendored copy in src/lib/skills/blog-to-linkedin-carousel"
fi

echo "Done. Redeploy: npx base44 functions deploy && npx base44 agents push"
