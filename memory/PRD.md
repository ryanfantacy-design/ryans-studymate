# Studi — Daily Study Tracker (PRD)

## Original Problem Statement
"create a simple daily study tracker" — full-stack app + later, a free single-HTML version. Features: subjects + daily times, daily goal & progress bar, streak counter, weekly chart, notes per session, full history, Pomodoro timer, schedule clock with alarms (custom music upload), journal entries, mock test score tracking, share-my-streak PNG export, JSON/CSV export and editable JSON import. Duration values like "7 hr" rendered in BLACK text. Playful UI (not too dark).

## Architecture
- **Full-stack version** (preview URL):
  - Backend: FastAPI (`/app/backend/server.py`) + MongoDB (Motor). All routes prefixed `/api`. UUIDs as ids.
  - Frontend: React 19 + Tailwind, single `App.js` shell, 9 views.
- **Standalone HTML version** (free, deployable anywhere):
  - `/app/frontend/public/studi.html` (also served at `<preview>/studi.html`)
  - `/app/standalone/index.html` (clean download path) + `/app/standalone/README.md`
  - Vanilla JS + localStorage (key `studi.v1`); Tailwind Play CDN, Chart.js CDN, html2canvas CDN, Google Fonts.

## User Personas
- Student / self-learner who logs daily study sessions, tracks streaks, runs Pomodoros, schedules study blocks with alarms, journals their reflections, tracks mock-test progress, and shares streaks on social — wants to use this entirely free.

## Core Requirements
- Subjects CRUD with daily target.
- Sessions (subject, duration, notes, date) + history view with date filter + delete.
- Daily goal progress bar, streak counter (current/longest/active).
- Weekly bar chart.
- Pomodoro work/break with circular timer; auto-logs work session.
- Schedule clock + alarms ringing at start AND end times; user-uploaded audio.
- Journal: per-day entry with mood (great/good/okay/meh/bad) + notes.
- Mock Tests: log name/subject/date/score/max → auto %, stats overview, line-chart trend.
- Share streak card (branded PNG export).
- Export JSON / CSV; Import JSON (replace).
- Duration values rendered as **black text on bright accent chips**.
- Playful neo-brutalist theme (cream bg, white cards w/ thick black borders + offset shadows).

## What's Implemented
**Apr 25, 2026 — Iteration 1** ✅ Subjects/Sessions/Stats/Pomodoro/Schedule/Records/Settings + dark playful theme. 100% tested.

**Apr 25, 2026 — Iteration 2** ✅ Journal + Mock Tests + Share-Streak PNG export + full theme overhaul to cream/playful neo-brutal. Backend `/api/journal` + `/api/mocks` + extended export/import. 15/15 backend pytest, 100% frontend.

**Apr 25, 2026 — Iteration 3** ✅ Single-file standalone HTML build at `/app/frontend/public/studi.html` (and `/app/standalone/index.html`):
- Vanilla JS + localStorage (key `studi.v1`). Defaults: empty subjects/sessions/journal/mocks; settings = 240/25/5.
- Charts via Chart.js CDN; PNG share via html2canvas; Tailwind via Play CDN; fonts via Google Fonts.
- Verified loading at preview URL — clean render, theme intact, no JS errors (only harmless Tailwind-CDN production warning).
- README at `/app/standalone/README.md` with deploy guide (GitHub Pages / Netlify Drop / Vercel / etc.).

## Backlog / Future
- **P1**: Split full-stack `App.js` (~1220 lines) into per-view component files.
- **P1**: Validate `/api/import` payload shape on full-stack backend.
- **P1**: Standalone alarm trigger uses minute-string match; add last-trigger guard for background-throttled tabs.
- **P2**: Per-subject stacked weekly bar chart.
- **P2**: Calendar heatmap of study days.
- **P2**: Multi-user / auth for full-stack version.
- **P2**: Mobile sidebar drawer polish.
- **P2**: Journal prompts and mood-based study insights.
- **P2**: Mock-test topic tags + per-subject breakdown.
- **P2**: Optional AI Study Coach (Emergent LLM key) for the full-stack version.

## Next Tasks
- Awaiting user feedback after iteration 3 review.
