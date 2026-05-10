# Zeitwinkel — PROJECT_NOTES

## Concept — *The Time Angle*

**The brand:** Zeitwinkel — independent Swiss watch manufacturer, founded 2006 by three friends in Saint-Imier, Bernese Jura. In-house manufacture calibers ZW0102 and ZW0103. Only 100 watches per year. German silver (untreated nickel silver) plates and bridges.

**The truth:** The brand name *Zeitwinkel* means "time angle" — a measure for calculating true local time in celestial navigation. The angle between the observer's meridian and a celestial body.

**Radical metaphor:** The site IS the angle. Two rays meeting at a vertex. One fixed (the horizon, the constant). One rotating (the index, the variable). The user is the navigator, rotating the index to find their position in the brand's universe.

**Spatial grammar — The Time Angle:** No scroll. No nav. The viewport is a dark field with a single vertex at its center. Two luminous rays emanate: one fixed to the right (0°, the horizon), one rotating (the index). The user drags or swipes to rotate the index ray through five snap positions: 0°, 15°, 30°, 45°, 60°. At each angle, the sector between the rays fills with content. The angle number is displayed at the vertex, ghost-like at 18% opacity.

**Cursor:** A sextant crosshair — thin intersecting lines with a luminous dot at the center, like the sight of a navigational instrument. The dot casts a faint glow.

**Loader:** A single point of light at the center pulses three times (the "first heartbeat" of a movement), then expands into the two rays. The angle opens from 0° to 15°. Text: "Measuring the angle" / "Saint-Imier, Bernese Jura".

**Living texture:** Very dark charcoal (#0C0C0C) with SVG fractalNoise grain at 0.035 opacity. Anisotropic sheen — a radial gradient that shifts with mouse position, simulating the directional reflectivity of untreated German silver.

**Type (un-logged pairing):** Sora (geometric sans, technical precision) + Literata (serif, warm reading). Avoids Cardo, Cormorant, Marcellus, Newsreader, Fraunces, Dahlia, Instrument Serif, Inter, Archivo, JetBrains Mono, IBM Plex Mono, DM Mono, Space Mono.

**Palette — Saint-Imier Night (new):** Background `#0C0C0C` · German Silver `#B8B0A8` · Luminous Ray `#D4CFC8` · Text `#E8E4DC` · Muted `#8A8580`.

**Anti-pattern audit:** No nav · no hero · no centred headline · no scroll-snap · no cards · no hamburger · no footer · no video · no stock asset · no library default. Differs from Anton (radial clock), Poole (folio), Gibran (held tableau/film/listening room), Garrick (bench-top), Agentur Grimm (cork wall).

## Five Angles

- **0° — The Founders:** Three friends, 2006, still independent, still in Saint-Imier.
- **15° — The Workshop:** Saint-Imier, Bernese Jura. No more than 100 watches per year. Each assembled, regulated and tested by hand.
- **30° — German Silver:** Untreated nickel silver. Harder than brass. Warmer than steel. The plates and bridges of every Zeitwinkel movement.
- **45° — The Movement:** Caliber ZW0102 & ZW0103. 72-hour power reserve. 28 jewels. 257 components. Three-quarter plate. Manufactured in the Swiss Jura.
- **60° — The Timepiece:** Five models. 173° Saphir. 273° Saphir Fumé. 273° Saphir Bleu. 240°. 082° Email Grand Feu. 188° MAKS.

## Radical References

1. **Olafur Eliasson — "The Weather Project" (Tate Modern, 2003)** — a single artificial sun in a dark space, the viewer's position changes the angle of light. The angle as the primary spatial variable.
2. **James Turrell — Skyspaces** — a thin aperture framing the sky, the viewer's angle of view determines what is seen. Light entering at an angle.
3. **Robert Irwin — "Untitled" (1969)** — the angle between viewer and object becomes the artwork. Perception is the medium.
4. **Carsten Nicolai — "unidisplay"** — data visualized through geometric angles and ratios. The angle as information.
5. **Rafael Lozano-Hemmer — "Pulse Room"** — heartbeat translated to light, pulsing through a field of bulbs. The first heartbeat as the origin of experience.

## Technical

- Static HTML / CSS / vanilla JS — no build step.
- Google Fonts: Sora + Literata.
- SVG for rays, sector, and angle arc.
- Pointer events for drag + touch rotation.
- Wheel rotation with delayed snap.
- Keyboard arrow navigation.
- Anisotropic sheen shifts with mouse position.
- Content positioned within the sector using polar coordinates.
- Mobile: swipe rotation, no custom cursor.

## Deployment

Cloudflare Pages, project name `zeitwinkel`:

```sh
npx wrangler pages deploy . --project-name=zeitwinkel
```

A *Velocity* atelier work — © MMXXVI.
