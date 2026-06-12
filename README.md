# Blog Carousel Studio

GTM Buddy internal Base44 app that turns blog content into branded LinkedIn carousel posts with PDF and PNG export.

## Features

- Paste a blog URL or full article text
- AI-generated carousel slide copy (6–10 slides)
- Editable review step with per-slide regenerate
- GTM Buddy branded 1080×1080 slide preview
- PDF download (one slide per page) and PNG ZIP export
- Project persistence via `CarouselProject` entity
- Phase 2 stubs for Figma reference URLs

## Local development (Claude / AI)

Carousel copy requires **either** a local Claude key **or** Base44. Without either, only a heuristic skill engine runs (not full AI).

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```bash
# Option A — Claude on local dev (recommended)
ANTHROPIC_API_KEY=sk-ant-api03-...
# optional: ANTHROPIC_MODEL=claude-sonnet-4-20250514

# Option B — Base44 cloud AI (also set for local proxy)
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=https://your-app-name.base44.app
```

```bash
npm run dev
# Open http://localhost:5173 — Input step shows "Generation mode"
# Badge should say "Claude (local)" after generate when Option A is set
```

Get an Anthropic key: https://console.anthropic.com/settings/keys

## Base44 deployment (publish for team)

1. Create a new app in the [Base44 dashboard](https://base44.com) and connect this GitHub repo (`Carousel-builder`).
2. Copy **App ID** and **App URL** into `.env.local` (see above).
3. Deploy backend + frontend:

```bash
npx base44 login
npx base44 link          # link CLI to your Base44 app
npx base44 entities push
npx base44 functions deploy
npx base44 agents push
npm run build
npx base44 deploy
```

4. In Base44 dashboard: set **internal auth** (invite-only or `@gtmbuddy.ai` domain).
5. On Base44, `generate-carousel-slides` uses **Base44 InvokeLLM** (platform AI — no Anthropic key needed in production).

Generation order: Base44 function → Base44 LLM fallback → local Claude (dev only) → skill engine heuristic.

Configure internal access in the Base44 dashboard (invite-only or email domain allowlist for `@gtmbuddy.ai`).

## Skill sync

When you have local clones of the skill repos:

```bash
chmod +x scripts/sync-skills.sh
./scripts/sync-skills.sh
npx base44 agents push
```

## Architecture

- **Entity**: `CarouselProject` — stores drafts and exports
- **Functions**: `fetch-blog-content`, `generate-carousel-slides`
- **Agent**: `carousel_content_agent` — orchestrates blog → carousel workflow
- **Frontend**: 4-step wizard (Input → Review → Preview → Export)
