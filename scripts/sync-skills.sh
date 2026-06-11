#!/usr/bin/env bash
# Sync vendored skill content from local clones of the GTM Buddy skill repos.
# Run after cloning:
#   git clone git@github.com:GTM-Buddy-Marketing/gtm-buddy-marketing-skills.git ../gtm-buddy-marketing-skills
#   git clone git@github.com:GTM-Buddy-Marketing/gtm-buddy-design-engg.git ../gtm-buddy-design-engg

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MARKETING_SKILLS="${MARKETING_SKILLS:-$ROOT/../gtm-buddy-marketing-skills}"
DESIGN_ENGG="${DESIGN_ENGG:-$ROOT/../gtm-buddy-design-engg}"

if [[ -d "$MARKETING_SKILLS" ]]; then
  echo "Syncing marketing skills..."
  find "$MARKETING_SKILLS" -name "*.md" -path "*carousel*" -o -name "*.md" -path "*linkedin*" 2>/dev/null | head -5 | while read -r f; do
    cp "$f" "$ROOT/src/lib/prompts/" 2>/dev/null || true
  done
  if [[ -f "$MARKETING_SKILLS/skills/linkedin-content/SKILL.md" ]]; then
    cp "$MARKETING_SKILLS/skills/linkedin-content/SKILL.md" "$ROOT/src/lib/prompts/linkedin-content-skill.md"
  fi
else
  echo "Warning: marketing skills repo not found at $MARKETING_SKILLS"
fi

if [[ -d "$DESIGN_ENGG" ]]; then
  echo "Syncing design tokens..."
  if [[ -f "$DESIGN_ENGG/design.md" ]]; then
    cp "$DESIGN_ENGG/design.md" "$ROOT/src/lib/design-tokens/design.md"
  fi
else
  echo "Warning: design-engg repo not found at $DESIGN_ENGG"
fi

echo "Done. Redeploy agents with: npx base44 agents push"
