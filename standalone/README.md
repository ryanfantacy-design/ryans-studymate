# Studi — Single-File PWA Daily Study Tracker

One self-contained `index.html`. **Installable as a PWA**. No backend, no signup, no cost.

## Features
- ✅ Subjects (CRUD with daily targets) + per-session notes
- ✅ Daily goal & progress bar · Streak counter (current / longest / active)
- ✅ Pomodoro timer (auto-logs sessions on completion)
- ✅ Schedule clock with start/end alarms + custom music upload
- ✅ Journal (mood + free-form notes per day)
- ✅ Mock test scores with auto-% and trend chart
- ✅ Weekly bar chart · Records browser with date-range filter
- ✅ JSON & CSV export, JSON import (replace mode)
- ✅ "Share my streak" — exports a beautiful PNG card
- ✅ Playful neo-brutalist theme · duration values rendered in solid BLACK on bright accent chips
- ✅ **Installable PWA** — Add to Home Screen on Android / iOS / desktop

## Where your data lives
**100% in your browser's `localStorage`** (key: `studi.v1`). It never leaves your device. To move data between devices, use Settings → **Export JSON**, then **Import JSON** on the other device.

---

## Deploy on GitHub Pages (free, ~2 min)

1. Create a new public repo on github.com (e.g., `studi`).
2. Click **Add file → Upload files**.
3. Drag the **`index.html`** file into the upload area. Commit.
4. Repo → **Settings → Pages**. Source: **Deploy from a branch**. Branch: **main** / folder: **/ (root)**. Save.
5. Wait ~30 s. Your app is live at:
   ```
   https://<your-username>.github.io/<repo-name>/
   ```
6. Open it on your phone, then **Add to Home Screen**:
   - **Android / Chrome**: tap the "⬇ Install Studi" button (auto-appears) or browser menu → "Install app".
   - **iPhone / Safari**: tap **Share → Add to Home Screen**. (Studi shows a one-time hint banner with this instruction.)

> Tip: If your username is `alice` and the repo is named `studi`, your install URL is `https://alice.github.io/studi/`.

## Other free hosts
- **Netlify Drop**: drag the file onto https://app.netlify.com/drop → instant URL, no account needed.
- **Vercel · Cloudflare Pages · surge.sh · your-folder.com** — same idea. Any static-host free tier works.
- **Just open it locally**: download `index.html` and double-click.

---

## What's loaded from CDN (first visit needs internet)
- Tailwind CSS Play CDN (styles)
- Chart.js (weekly + mock-test charts)
- html2canvas (PNG share card)
- Google Fonts (Bricolage Grotesque · DM Sans · JetBrains Mono)

After first visit, browsers cache these aggressively, so the app works mostly offline. For full offline-first behavior you can later add a service-worker file beside `index.html`, but the single-file PWA happily installs + runs without one.

## Browser notifications & alarms
Schedule → click "Enable browser notifications". Alarms ring with your uploaded music (or a default beep) at exactly the configured `HH:MM` start and end times **while a Studi tab/PWA window is open**.

## Reset everything
Settings → "Reset everything" wipes your localStorage. Or DevTools → Application → Local Storage → delete the `studi.v1` key.
