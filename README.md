# 🎂 Nainika's 6th Birthday — Interactive Website

A polished, no-backend, no-build birthday microsite: hero with confetti, an
original Web Audio birthday melody, a flip-open card, six "things for six
years" cards, a memory gallery with graceful photo fallbacks, three mini
games (Pop the Balloons, Catch the Stars, Mystery Present), a quiz, wishes,
and a big finale — all responsive, accessible, and dependency-free.

## File structure

```
/
├── index.html
├── styles.css
├── script.js
├── render.yaml          (optional — Render auto-detects static config)
└── assets/
    ├── README.txt        (instructions for adding real photos/music)
    ├── photo1.jpg …5.jpg  (optional — add your own; placeholders shown if absent)
    └── birthday-song.mp3  (optional — add a real song; falls back to a built-in melody)
```

## Adding real photos or music (optional)

Drop files into `assets/` using these **exact names**:

- `photo1.jpg`, `photo2.jpg`, `photo3.jpg`, `photo4.jpg`, `photo5.jpg`
- `birthday-song.mp3`

Nothing needs to be reconfigured — the page detects each file automatically.
If a file is missing, you get a pretty gradient placeholder (photos) or the
built-in synthesized melody (music) instead. No broken images, no errors.

## Run locally

Just open `index.html` in a browser, or serve it with any static server, e.g.:

```
npx serve .
```

or (Python):

```
python -m http.server 8000
```

## Deploy to Render (Static Site)

1. Push this folder to a GitHub/GitLab repo (or connect via Render's Git integration).
2. In the [Render Dashboard](https://dashboard.render.com), click **New +** → **Static Site**.
3. Connect your repository.
4. Configure:
   - **Build Command:** *(leave blank)*
   - **Publish Directory:** `.` (the repo root)
5. Click **Create Static Site**. No environment variables, no database, no server needed.

That's it — Render will build nothing and simply serve the static files. The
included `render.yaml` documents this config if you prefer Render's
[Blueprint](https://render.com/docs/blueprint-spec) deploys, but manual setup
via the dashboard (steps above) works just as well.

## Notes

- No frameworks, no npm install, no build step.
- Respects `prefers-reduced-motion`.
- Confetti and game animations clean up after themselves (no memory leaks).
- Tested responsively from 320px to 1440px+.
