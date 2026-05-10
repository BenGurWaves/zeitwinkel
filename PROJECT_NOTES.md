# Zeitwinkel — PROJECT_NOTES

## Concept — *The Five Positions*

**The brand:** Zeitwinkel — independent Swiss watch manufacturer, founded 2006 by three friends in Saint-Imier, Bernese Jura. In-house manufacture calibers ZW0102 and ZW0103. Only 100 watches per year. German silver (untreated nickel silver) plates and bridges.

**The truth:** Zeitwinkel regulates each movement in five positions — a meticulous process that ensures precision regardless of orientation. The name *Zeitwinkel* means "time angle."

**Radical metaphor:** The website is a sequence of five rooms — like the five positions of regulation. The user moves horizontally through them, each room a different facet of the brand. The movement between rooms is the experience.

**Spatial grammar — The Five Positions:** Five full-viewport rooms arranged horizontally (500vw total). The user drags, swipes, or uses arrow keys to navigate between rooms. Each room has a distinct atmosphere — subtle background gradients, unique SVG accent shapes, and content that fades in when the room becomes active. A thin progress line at the bottom shows position. Corner marks provide constant brand context.

**Cursor:** A luminous dot with a thin ring — like the sight of a precision instrument. The ring expands on hover.

**Loader:** A single point of light pulsing like a heartbeat, with a thin ring. Text: "Regulating" / "Saint-Imier, Bernese Jura".

**Living texture:** Very dark charcoal (#0C0C0C) with SVG fractalNoise grain at 0.035 opacity.

**Type (un-logged pairing):** Sora (geometric sans, technical precision) + Literata (serif, warm reading).

**Palette — Saint-Imier Night (new):** Background `#0C0C0C` · German Silver `#B8B0A8` · Luminous Ray `#D4CFC8` · Text `#E8E4DC` · Muted `#8A8580`.

**Anti-pattern audit:** No nav · no hero · no centred headline · no scroll-snap · no cards · no hamburger · no footer · no video · no stock asset · no library default. Differs from Anton (radial clock), Poole (folio), Gibran (held tableau/film/listening room), Garrick (bench-top), Agentur Grimm (cork wall).

## Five Rooms

- **01 — Zeitwinkel:** The brand name large and italic. "The time angle" subtitle. Founded 2006. Three friends, still independent, still in Saint-Imier.
- **02 — The Workshop:** Saint-Imier, Bernese Jura. No more than 100 watches per year. Each assembled, regulated and tested by hand. Stats: 100 watches/year, 1 watchmaker per watch.
- **03 — German Silver:** Untreated nickel silver. Harder than brass. Warmer than steel. In-house calibers ZW0102 and ZW0103. Stats: 72h power reserve, 28 jewels, 257 components.
- **04 — The Collection:** All six watch models listed with sizes. 173° Saphir, 273° Saphir Fumé, 273° Saphir Bleu, 240°, 082° Email Grand Feu, 188° MAKS. Two sizes: 42.5mm and 39mm.
- **05 — True Local Time:** Philosophy. No shortcuts. No simplifications. Contact: Saint-Imier, Bernese Jura, Switzerland.

## Radical References

1. **Olafur Eliasson — "The Weather Project" (Tate Modern, 2003)** — a single artificial sun in a dark space, the viewer's position changes the angle of light.
2. **James Turrell — Skyspaces** — a thin aperture framing the sky, the viewer's position determines what is seen.
3. **Robert Irwin — "Untitled" (1969)** — the space between viewer and object becomes the artwork.
4. **Carsten Nicolai — "unidisplay"** — data visualized through geometric precision and ratios.
5. **Rafael Lozano-Hemmer — "Pulse Room"** — heartbeat translated to light, pulsing through a field.

## Technical

- Static HTML / CSS / vanilla JS — no build step.
- Google Fonts: Sora + Literata.
- Five `section.room` elements inside a flex container.
- Pointer events for drag + touch navigation.
- Wheel and keyboard arrow navigation.
- Progress line with active markers.
- Room indicator (01/05) in top right.
- Content fades in via CSS transitions on `.active` class.
- Mobile: swipe navigation, no custom cursor, hidden accent SVGs.

## Deployment

Cloudflare Pages, project name `zeitwinkel`:

```sh
npx wrangler pages deploy . --project-name=zeitwinkel
```

A *Velocity* atelier work — © MMXXVI.
