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

## Local development

```bash
npm install
cp .env.example .env.local
# Set VITE_BASE44_APP_ID from your Base44 dashboard
npm run dev
```

## Base44 deployment

```bash
npx base44 login
npx base44 link          # link to your Base44 app
npx base44 entities push
npx base44 functions deploy
npx base44 agents push
npm run build
npx base44 deploy
```

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
