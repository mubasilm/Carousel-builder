#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MARKETING="${MARKETING_SKILLS:-$ROOT/../gtm-buddy-marketing-skills}"
DESIGN="${DESIGN_ENGG:-$ROOT/../gtm-buddy-design-engg}"

BLOG_CAROUSEL="${BLOG_CAROUSEL_SKILL:-$ROOT/src/lib/skills/blog-to-linkedin-carousel}"
DEST="$ROOT/src/lib/skills/marketing"

mkdir -p "$DEST" "$ROOT/src/lib/skills/design" "$ROOT/src/lib/skills/blog-to-linkedin-carousel"

sync_skill() {
  local src_dir="$1"
  local dest_name="$2"
  if [[ -f "$MARKETING/skills/$src_dir/SKILL.md" ]]; then
    cp "$MARKETING/skills/$src_dir/SKILL.md" "$DEST/$dest_name"
    echo "  synced $dest_name"
  else
    echo "  skip $dest_name (not found)"
  fi
}

if [[ -d "$MARKETING" ]]; then
  echo "Syncing marketing skills from $MARKETING"
  sync_skill "social" "social-skill.md"
  sync_skill "content-strategy" "content-strategy-skill.md"
  sync_skill "copywriting" "copywriting-skill.md"
  sync_skill "copy-editing" "copy-editing-skill.md"
  sync_skill "product-marketing" "product-marketing-skill.md"
  sync_skill "ad-creative" "ad-creative-skill.md"

  if [[ -f "$MARKETING/skills/social/references/post-templates.md" ]]; then
    cp "$MARKETING/skills/social/references/post-templates.md" "$DEST/post-templates.md"
  fi
  if [[ -f "$MARKETING/skills/social/references/platforms.md" ]]; then
    cp "$MARKETING/skills/social/references/platforms.md" "$DEST/platforms.md"
  fi
  if [[ -f "$MARKETING/.agents/content-governance.md" ]]; then
    cp "$MARKETING/.agents/content-governance.md" "$DEST/content-governance.md"
  fi
  if [[ -f "$MARKETING/.agents/product-marketing-context.md" ]]; then
    cp "$MARKETING/.agents/product-marketing-context.md" "$DEST/product-marketing-context.md"
  fi
  echo "Synced marketing skills"
else
  echo "Skip marketing: $MARKETING not found"
  echo "Clone: git clone git@github.com:GTM-Buddy-Marketing/gtm-buddy-marketing-skills.git ../gtm-buddy-marketing-skills"
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
