# Karthik-v11.github.io

Personal portfolio for **Karthik V** — Software Engineer building mobile apps, real-time systems, and 3D web. Live at https://karthik-v11.github.io/.

## Structure

```
├── index.html              # Home: hero, selected work, skills, about, contact
├── 404.html                # Custom 404 page
├── script.js               # Shared interactions (scroll, nav, hero canvas, menus)
├── script.min.js           # Minified build output of script.js
├── html/
│   ├── info.html           # About, off the clock, how I work
│   ├── everythingproject.html
│   ├── imtexproject.html
│   ├── miot-cnc.html
│   ├── o2dproject.html
│   └── packingproject.html # Individual case studies
├── css/
│   ├── style.css           # Base + home (also shared chrome on project/info pages)
│   ├── infostyle.css       # Info-page overrides
│   ├── projectstyle.css    # Project case-study layout
│   └── *.min.css           # Minified build outputs (generated)
├── assets/
│   ├── brand/              # Logo
│   ├── about/              # Profile image
│   ├── ui/                 # Shared UI glyphs (dividers, swipe icon)
│   ├── project-images/     # Case study imagery (WebP)
│   └── resume/             # Résumé PDF
├── build.mjs               # Minification script
├── robots.txt
└── sitemap.xml
```

## Stack

Vanilla HTML, CSS, and JS. The hero point-cloud is Three.js (loaded from cdnjs), with Google Fonts for typography.

## Build

HTML pages reference the `.min.css` / `script.min.js` files. After editing any CSS or `script.js`, regenerate them:

```
npm install
npm run build
```

Deploy is a direct push to `main`, served by GitHub Pages (no other build step).

## Notes

- Respects `prefers-reduced-motion`; the hero canvas pauses when off-screen or the tab is hidden.
- Desktop shows a brief loading overlay with a JS fallback; `noscript` styles keep content visible if JS is disabled.
