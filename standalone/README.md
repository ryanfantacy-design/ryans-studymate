# Studi — Standalone HTML

A single self-contained `index.html` daily study tracker. **No backend, no server, no signup, no cost.**

## What's inside
Everything from the full-stack version, just running in your browser:
- ✅ Subjects (CRUD with daily targets)
- ✅ Daily goal & progress bar
- ✅ Streak counter (current / longest / active days)
- ✅ Pomodoro timer (auto-logs sessions on completion)
- ✅ Schedule clock with start/end alarms + custom music upload
- ✅ Journal (mood + free-form notes per day)
- ✅ Mock test scores with auto-% and trend chart
- ✅ Weekly bar chart
- ✅ Records browser with date-range filter
- ✅ JSON & CSV export, JSON import (replace)
- ✅ "Share my streak" — exports a beautiful PNG card
- ✅ Playful neo-brutalist theme; duration values rendered in solid BLACK on bright accent chips

## Where your data lives
**100% in your browser's `localStorage`** (key: `studi.v1`). It never leaves your device. To move data between devices, use Settings → Export JSON, then Import JSON on the other device.

## How to use it
**Option A — Just open it locally**
1. Download `index.html`
2. Double-click to open in any modern browser
3. Done

**Option B — Host it for free on the web** (so you can use it on any device)
- **GitHub Pages**: drop `index.html` into a public repo, enable Pages → done
- **Netlify Drop**: drag the file onto https://app.netlify.com/drop → done
- **Vercel / Cloudflare Pages / surge.sh / your-folder.com**: same idea

Because the file is fully self-contained, any static-host (free tier) works.

## Required CDNs (loaded automatically)
- Tailwind CSS Play CDN (styles)
- Chart.js (weekly + mock-test charts)
- html2canvas (PNG share card)
- Google Fonts (Bricolage Grotesque, DM Sans, JetBrains Mono)

These are loaded over the network, so the **first visit** needs internet. After that, browsers cache them and the app generally keeps working offline for everyday use.

## Browser notifications & alarms
Open Schedule → click "Enable browser notifications". Alarms ring with your uploaded music (or a default beep) at exactly the configured `HH:MM` start and end times **while the tab is open**.

## Reset everything
Settings → "Reset everything" wipes your localStorage. Or just open DevTools → Application → Local Storage → delete the `studi.v1` key.
