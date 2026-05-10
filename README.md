# Zeitwinkel — Das Werk

Independent Swiss watch manufacture. Saint-Imier. 100 watches per year.

## Concept

The website is Caliber ZW0102. A hand-drawn SVG schematic of the actual movement, top-down. The balance wheel oscillates at 4 Hz (28,800 vph). The escape wheel ticks. The mainspring slowly winds. Ruby jewels glow at every pivot. Click any component — barrel, workshop, escapement, balance, plate — to zoom in and read the brand story tied to that part of the watch.

## Stack

- Static HTML / CSS / vanilla JS
- Google Fonts: Sora + Literata
- No build step, no libraries

## Run locally

```bash
python3 -m http.server 8204
# open http://localhost:8204
```

## Deploy

```bash
npx wrangler pages deploy . --project-name=zeitwinkel
```

---

A Velocity atelier work — © MMXXVI.
