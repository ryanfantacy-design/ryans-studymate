# Studi — Daily Study Tracker (PRD)

## Original Problem Statement
"create a simple daily study tracker" — full-stack app + a free **single-file PWA** that runs on GitHub Pages (or any static host) for zero cost. Features: subjects + daily times, daily goal & progress bar, streak counter, weekly chart, notes per session, full history, Pomodoro, schedule clock with custom-music alarms, journal entries, mock test score tracking, share-streak PNG export, JSON/CSV export/import. Duration values must render in BLACK text. Playful UI (not too dark).

## Architecture
- **Full-stack version** (preview URL):
  - FastAPI (`/app/backend/server.py`) + MongoDB; React 19 + Tailwind frontend (`/app/frontend/src/App.js`).
- **Standalone single-file PWA** (free, deployable anywhere):
  - **`/app/standalone/index.html`** — canonical file users put on GitHub
  - `/app/standalone/README.md` — deploy guide with GitHub Pages steps
  - `/app/frontend/public/studi.html` — same content, served by preview for live testing
  - Vanilla JS + `localStorage` (key `studi.v1`); CDN: Tailwind Play, Chart.js, html2canvas, Google Fonts
  - **PWA**: inline manifest (Blob URL), apple-touch-icon, theme-color, "⬇ Install Studi" FAB on Android/Desktop, iOS Safari hint banner ("Add to Home Screen"). Runs in `display:standalone` once installed.

## User Personas
- Student / self-learner who wants a free, install-on-phone study tracker — no signup, no servers — that they can host on GitHub Pages and use as a daily PWA.

## Core Requirements
Same as previous iterations + **single-file installable PWA**.

## What's Implemented
**Iter 1 (Apr 25, 2026)** ✅ Full-stack subjects/sessions/stats/pomodoro/schedule/records/settings + dark playful theme. 100% tested.

**Iter 2 (Apr 25, 2026)** ✅ Journal + Mock Tests + Share-Streak PNG export + theme overhaul to cream/playful neo-brutal. Backend `/api/journal` + `/api/mocks` + extended export/import. 15/15 backend pytest, 100% frontend.

**Iter 3 (Apr 25, 2026)** ✅ Single-file standalone HTML at `/app/frontend/public/studi.html` and `/app/standalone/index.html`. Vanilla JS + localStorage. All features parity.

**Iter 4 (Apr 25, 2026)** ✅ Standalone is now a real **single-file PWA**:
- Inline web manifest registered at runtime via Blob URL (no separate `manifest.json` needed).
- `theme-color`, `apple-mobile-web-app-capable`, `apple-touch-icon` set.
- "⬇ Install Studi" FAB shows when `beforeinstallprompt` fires (Android/Desktop Chrome).
- iOS Safari one-time hint banner ("Tap Share → Add to Home Screen") with `localStorage` dismiss flag.
- Updated README with GitHub Pages steps.
- Verified: file loads cleanly, no JS errors, manifest link gets injected (`blob:` href).

## Backlog / Future
- **P1**: Optional service-worker (separate file) for **full offline precaching** of CDN assets — accept that this would make it 2 files instead of 1.
- **P1**: Per-subject stacked weekly bar; calendar heatmap of study days.
- **P2**: Topic tags on mock tests; journal prompts; mood-based study insights.
- **P2**: Export streak card directly into Web Share API (native share sheet on mobile).

## Next Tasks
- Awaiting user feedback after PWA iteration.
