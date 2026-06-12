#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MARKETING="${MARKETING_SKILLS:-$ROOT/../gtm-buddy-marketing-skills}"
DESIGN="${DESIGN_ENGG:-/tmp/gtm-buddy-design-engg}"
BLOG_CAROUSEL="${BLOG_CAROUSEL_SKILL:-$ROOT/src/lib/skills/blog-to-linkedin-carousel}"
BLOG_ZIP="${BLOG_CAROUSEL_SKILL_ZIP:-/Users/mubasil/Documents/Playground/blog-to-linkedin-carousel-skill.zip}"
DEST="$ROOT/src/lib/skills/marketing"
DESIGN_DEST="$ROOT/src/lib/skills/design"

mkdir -p "$DEST" "$DESIGN_DEST" "$ROOT/src/lib/skills/blog-to-linkedin-carousel"

sync_marketing_skill() {
  local src_dir="$1"
  local dest_name="$2"
  if [[ -f "$MARKETING/skills/$src_dir/SKILL.md" ]]; then
    cp "$MARKETING/skills/$src_dir/SKILL.md" "$DEST/$dest_name"
    echo "  synced $dest_name"
  else
    echo "  skip $dest_name (not found)"
  fi
}

sync_design_skill() {
  local src_dir="$1"
  local dest_name="$2"
  if [[ -f "$DESIGN/skills/$src_dir/SKILL.md" ]]; then
    cp "$DESIGN/skills/$src_dir/SKILL.md" "$DESIGN_DEST/$dest_name"
    echo "  synced design/$dest_name"
  else
    echo "  skip design/$dest_name (not found)"
  fi
}

if [[ -d "$MARKETING" ]]; then
  echo "Syncing marketing skills from $MARKETING"
  sync_marketing_skill "social" "social-skill.md"
  sync_marketing_skill "content-strategy" "content-strategy-skill.md"
  sync_marketing_skill "copywriting" "copywriting-skill.md"
  sync_marketing_skill "copy-editing" "copy-editing-skill.md"
  sync_marketing_skill "product-marketing" "product-marketing-skill.md"
  sync_marketing_skill "ad-creative" "ad-creative-skill.md"
  [[ -f "$MARKETING/skills/social/references/post-templates.md" ]] && cp "$MARKETING/skills/social/references/post-templates.md" "$DEST/post-templates.md"
  [[ -f "$MARKETING/skills/social/references/platforms.md" ]] && cp "$MARKETING/skills/social/references/platforms.md" "$DEST/platforms.md"
  [[ -f "$MARKETING/.agents/content-governance.md" ]] && cp "$MARKETING/.agents/content-governance.md" "$DEST/content-governance.md"
  [[ -f "$MARKETING/.agents/product-marketing-context.md" ]] && cp "$MARKETING/.agents/product-marketing-context.md" "$DEST/product-marketing-context.md"
  echo "Synced marketing skills"
else
  echo "Skip marketing: $MARKETING not found"
fi

if [[ -d "$DESIGN" ]]; then
  echo "Syncing design-engg from $DESIGN"
  cp "$DESIGN/DESIGN.md" "$DESIGN_DEST/DESIGN.md"
  [[ -f "$DESIGN/.agents/design-system.md" ]] && cp "$DESIGN/.agents/design-system.md" "$DESIGN_DEST/design-system.md"
  [[ -f "$DESIGN/.agents/frontend-guidelines.md" ]] && cp "$DESIGN/.agents/frontend-guidelines.md" "$DESIGN_DEST/frontend-guidelines.md"
  sync_design_skill "lp-design" "lp-design-skill.md"
  sync_design_skill "figma-qa" "figma-qa-skill.md"
  sync_design_skill "frontend-review" "frontend-review-skill.md"
  sync_design_skill "cro" "cro-skill.md"
  sync_design_skill "qa" "qa-skill.md"
  sync_design_skill "launch-checklist" "launch-checklist-skill.md"
  echo "Synced design-engg"
else
  echo "Skip design: $DESIGN not found (clone gtm-buddy-design-engg to /tmp or set DESIGN_ENGG)"
fi

if [[ -f "$BLOG_ZIP" ]]; then
  unzip -o "$BLOG_ZIP" -d "$ROOT/src/lib/skills/blog-to-linkedin-carousel"
  echo "Synced blog-to-linkedin-carousel from $BLOG_ZIP"
elif [[ -f "$BLOG_CAROUSEL/SKILL.md" ]]; then
  echo "blog-to-linkedin-carousel skill present"
else
  echo "Skip blog carousel zip"
fi

echo "Done. Redeploy: npx base44 functions deploy && npx base44 agents push && npx base44 deploy --yes"
