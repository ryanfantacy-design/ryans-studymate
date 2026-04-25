# Studi — Daily Study Tracker (PRD)

## Original Problem Statement
"create a simple daily study tracker" — full-stack app (React + FastAPI + MongoDB) with subjects/topics + daily times, daily goal & progress bar, streak counter, weekly chart/stats, notes per session, full history of records, Pomodoro timer, schedule clock with alarms (custom music upload), JSON/CSV export and editable JSON import. User explicitly wanted duration values like "7 hr" rendered in BLACK text and an upgraded UI/background.

## Architecture
- **Backend**: FastAPI (`/app/backend/server.py`), all routes prefixed `/api`, MongoDB via Motor, UUIDs as ids (no ObjectId leak), datetimes stored as ISO strings.
- **Frontend**: React 19 + Tailwind, single `App.js` shell with sidebar navigation across 7 views.
- **Storage**: MongoDB collections `subjects`, `sessions`, `settings`. Schedule alarms + custom alarm music live in browser localStorage.

## User Personas
- Student / self-learner who logs daily study sessions, tracks consecutive-day streaks, runs Pomodoros, schedules study blocks with alarms, and reviews historical records.

## Core Requirements (static)
- Add/edit/delete subjects with daily target.
- Log sessions with subject, duration, notes, date.
- Daily goal progress bar (today total / goal).
- Streak counter (current + longest + active days).
- Weekly chart (last 7 days, recharts bar chart).
- Pomodoro work/break with circular timer; auto-logs work session on completion.
- Schedule clock + alarms ringing at start AND end times; user-uploaded audio (any file).
- Full Records view with date range filter and per-row delete.
- Export JSON / CSV (sessions); Import JSON (replace mode).
- Duration values rendered as **black text on bright accent chips** (Bricolage Grotesque + DM Sans + JetBrains Mono fonts).

## What's Implemented (Apr 25, 2026)
- ✅ Backend endpoints: `/api/subjects` (CRUD), `/api/sessions` (CRUD + filters), `/api/stats/today|weekly|streak`, `/api/settings` (GET/PUT), `/api/export`, `/api/import`.
- ✅ Frontend views: Today, Subjects, Pomodoro, Schedule, Stats, Records, Settings.
- ✅ Dark "playful" theme per `/app/design_guidelines.json` with vibrant accents.
- ✅ All duration chips use `text-black` on bright background — verified by testing agent.
- ✅ Schedule alarms with custom music upload (localStorage, base64 dataUrl).
- ✅ Pomodoro auto-logs completed work sessions.
- ✅ JSON & CSV export, JSON import (replace).
- ✅ Tested: 100% backend pytest, 100% frontend UI flows (iteration_1.json).

## Backlog / Future
- **P1**: Split `App.js` into per-view files for maintainability.
- **P1**: Alarm trigger uses `ss==0` window; switch to per-minute last-trigger guard so background-throttled tabs still fire.
- **P2**: Per-subject weekly breakdown (stacked bar).
- **P2**: Heatmap calendar of study days.
- **P2**: Multi-user / auth.
- **P2**: Validate `/api/import` payload shape (currently accepts loose objects).
- **P2**: Mobile responsiveness pass for the sidebar.

## Next Tasks
- Awaiting user feedback after first review.
