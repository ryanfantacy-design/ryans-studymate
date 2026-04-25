# Studi — Daily Study Tracker (PRD)

## Original Problem Statement
"create a simple daily study tracker" — full-stack app (React + FastAPI + MongoDB) with subjects + daily times, daily goal & progress bar, streak counter, weekly chart, notes per session, full history, Pomodoro timer, schedule clock with alarms (custom music upload), JSON/CSV export and editable JSON import. User wanted duration values like "7 hr" rendered in BLACK text and an upgraded UI/background.

**Iteration 2 additions**: Journal entries (with mood), Mock Test score tracking (with trend chart), Share-my-streak card export to PNG, **playful neo-brutalist** theme replacing the original dark theme.

## Architecture
- **Backend**: FastAPI (`/app/backend/server.py`), all routes prefixed `/api`, MongoDB via Motor, UUIDs as ids (no ObjectId leak), datetimes stored as ISO strings.
- **Frontend**: React 19 + Tailwind, single `App.js` shell with sidebar navigation across **9 views**.
- **Storage**: MongoDB collections — `subjects`, `sessions`, `settings`, `journal`, `mock_tests`. Schedule alarms + custom alarm music live in browser localStorage.

## User Personas
- Student / self-learner who logs daily study sessions, tracks streaks, runs Pomodoros, schedules study blocks with alarms, journals their reflections, tracks mock-test progress, and shares their streak on social.

## Core Requirements (static)
- Subjects CRUD with daily target.
- Log sessions with subject, duration, notes, date.
- Daily goal progress bar.
- Streak counter (current + longest + active days).
- Weekly chart (last 7 days, recharts bar chart).
- Pomodoro work/break with circular timer; auto-logs completed work session.
- Schedule clock + alarms ringing at start AND end times; user-uploaded audio.
- Records view with date-range filter and per-row delete.
- Export JSON / CSV; Import JSON (replace mode).
- Duration values rendered as **black text on bright accent chips**.
- **Journal**: per-day entry with mood (great/good/okay/meh/bad) + notes; idempotent upsert.
- **Mock Tests**: log name/subject/date/score/max → auto %, stats overview, line-chart trend.
- **Share streak card**: branded PNG export of streak / today / week.

## What's Implemented
**Apr 25, 2026 — Iteration 1**
- ✅ Backend: subjects, sessions, settings, stats (today/weekly/streak), export/import.
- ✅ Frontend: 7 views (Today, Subjects, Pomodoro, Schedule, Stats, Records, Settings).
- ✅ Original dark "playful" theme; duration chips black-on-bright.
- ✅ Tested: 100% backend + frontend.

**Apr 25, 2026 — Iteration 2**
- ✅ Backend: `/api/journal` (upsert by date, list, delete), `/api/mocks` (CRUD + stats/overview, max_score validation), export/import include journal + mock_tests.
- ✅ Frontend: Journal view (date picker, 5 mood buttons, textarea, past-entries grid), Mock Tests view (form, sticker stats, recharts line trend, color-coded list).
- ✅ ShareStreakCard component using `html-to-image` for PNG export with branded gradient + mini bar chart.
- ✅ Full theme overhaul → cream `#FFF7E3` background with subtle dot pattern + soft coral/sky gradients, white cards with thick black borders and offset shadows, rotated sticker chips, colorful sidebar.
- ✅ Duration chips still BLACK text on bright bg (verified by testing agent — `rgb(0,0,0)`).
- ✅ Tested: 15/15 backend pytest + 100% frontend (iteration_2.json).

## Backlog / Future
- **P1**: Split `App.js` (~1220 lines) into per-view files under `/app/frontend/src/components/`.
- **P1**: Add Pydantic validation on `/api/import` payload items.
- **P1**: Alarm trigger uses minute-string match; add last-trigger guard to handle background-throttled tabs.
- **P2**: Per-subject weekly stacked bar; calendar heatmap of study days.
- **P2**: Multi-user / auth.
- **P2**: Mobile sidebar (hamburger / drawer).
- **P2**: Journal prompts ("what clicked?", "what's stuck?") + mood-based study insights.
- **P2**: Mock-test "topic" tags + per-subject breakdown.

## Next Tasks
- Awaiting user feedback after iteration 2 review.
