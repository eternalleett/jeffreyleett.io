# GU · Business Analyst Portfolio (V7)

A static, modular Business Analyst portfolio designed for GitHub Pages. No build tooling required.

## Project structure

```text
business-analyst/
├── index.html                # Semantic content and page sections only
├── assets/
│   ├── css/
│   │   ├── tokens.css        # All paint colors and surface/theme variables
│   │   ├── base.css          # Site layout and responsive foundations
│   │   └── portfolio.css     # Portfolio-specific styles and components
│   └── js/
│       ├── site.js           # Menu, theme, motion toggle, navigation
│       ├── animations.js     # GSAP ScrollTrigger, pinned story and motion
│       ├── chalk-engine.js   # Canvas chalk drawing / erasing / dust
│       ├── audio.js          # Optional Web Audio notes and experiments
│       └── lettering.js      # Vector handwritten chalk text
└── README.md
```

## Changing colors

Edit **only** `assets/css/tokens.css` for theme/color changes. The primary design tokens are `--ink`, `--cream`, `--lime`, `--orange`, `--muted`, `--line`, `--surface-page`, `--surface-story`, `--surface-chalk`, `--surface-bridge`, `--surface-playground`, `--surface-timeline`, `--surface-contact` and six `--chalk-*` colors. The `body.light` section overrides light-mode colors. All other original legacy colors have also been centralized as `--pigment-HEX` properties rather than embedded in layout styles. This makes it possible to systematically consolidate them into further semantic tokens over time.

## Smooth scrolling changes

- Native browser scrolling replaces Lenis and the extra animation ticker.
- GSAP ScrollTrigger still controls the pinned narrative when the CDN is available, but uses only the browser's scroll progress.
- Chalk Canvas is limited to about 30 redraws/second, skips insignificant progress changes, caps DPR to 1.5, uses fewer geometry samples and renders fewer dust particles.
- Work-image parallax runs only for fine hover-capable pointers.
- Handwritten lettering reads its story progress from the shared ScrollTrigger when available. A lightweight native scroll fallback is used when GSAP is unavailable.
- A reduced-motion fallback is preserved.

## Local preview

Serve this folder over HTTP, e.g. from its parent directory:

```sh
python -m http.server 8000
```

Open `http://localhost:8000/business-analyst/`. Opening via `file://` may be restricted by browser security settings. GSAP and ScrollTrigger currently use external CDN scripts; for a fully offline build, download and vendor compatible library files and update the two `<script>` references in `index.html`.

## Accuracy

The portfolio contains illustrative KPI percentages that are labeled **Illustrative / Unverified**. Replace these with substantiated before-and-after measurements before using them as factual job achievements.

## Checks

Run `node --check assets/js/*.js` per file, view desktop and mobile layouts, test theme and menu, inspect the browser console, and use performance tooling to benchmark animation FPS. Static syntax tests have passed; live JS animation execution was not verifiable in the available cloud browser session, so FPS gains have not been measured yet.