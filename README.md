# Karthik-v11.github.io

Personal portfolio for **Karthik V** — Software Engineer building mobile apps, real-time systems, and 3D web. Live at https://karthik-v11.github.io/.

## Structure

```
├── index.html            # Home: hero, selected work, skills, about, contact
├── html/
│   ├── info.html         # About, off the clock, how I work
│   └── *project.html     # Individual case studies
├── css/                  # style.css (home), infostyle.css (info), projectstyle.css (projects)
├── assets/
│   ├── project-images/   # Case study imagery (WebP)
│   ├── resume/           # Résumé PDF
│   └── archived/         # Deprecated images, kept for reference (not linked)
├── script.js             # Shared interactions (scroll, nav, hero canvas, menus)
├── 404.html              # Custom 404 page
├── robots.txt
└── sitemap.xml
```

## Stack

Vanilla HTML, CSS, and JS. The hero point-cloud is Three.js (loaded from cdnjs), with Google Fonts for typography. No build step — deploy is a direct push to `main`, served by GitHub Pages.

## Deploy

Push to `main`. GitHub Pages serves the repo root.

## Notes

- Respects `prefers-reduced-motion`; the hero canvas pauses when off-screen or the tab is hidden.
- Desktop shows a brief loading overlay with a JS fallback; `noscript` styles keep content visible if JS is disabled.
