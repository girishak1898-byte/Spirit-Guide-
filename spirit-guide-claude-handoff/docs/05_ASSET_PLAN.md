# Spirit Guide V5 — Asset Plan

## A. Assets supplied in this handoff

### Visual reference
`public/assets/reference/spirit-guide-reference-ui.png`
- Purpose: visual direction only.
- Never use this entire screenshot as the production webpage.

### Production/asset board
`public/assets/reference/visual-asset-production-board.png`
- Purpose: visual production reference and asset taxonomy.

### Level-1 Temple Gateway hero
`public/assets/hero/hero-sanctuary-level1-source.png`
- Native generated source: 1672×941.

`public/assets/hero/hero-sanctuary-level1-3840x2160.jpg`
- 3840×2160 dimension-contract derivative for Phase-2 composition/motion validation.
- Upscaled from the generated source; replace with true 4K before final launch.

Responsive derivatives:
- `hero-sanctuary-level1-2560.webp`
- `hero-sanctuary-level1-1920.webp`
- `hero-sanctuary-level1-1440.webp`
- `hero-sanctuary-level1-1024.webp`
- `hero-sanctuary-level1-mobile-fallback-1200x1500.webp`

The mobile file is a fallback crop only. A separately art-directed mobile hero is recommended before final production.

## B. Future Level-2 hero layers
Produce only after Level-1 motion is approved.
- `hero-bg-environment.*`
- `hero-buddha-midground.*`
- `hero-foreground.*`
- `hero-haze.*`
- `hero-light-overlay.*`
- CSS vignette/grade layer

Target true master: approximately 3840×2160 per visual plane where appropriate.

## C. Section environments
Create when their phase approaches, preserving the exact same physical sanctuary language.
- Temple Mode: 3840×2160 master.
- Meditation Hall: 3200–4000px wide.
- Lotus Garden: 3000–3200px wide.
- Daily Wisdom manuscript scene: 2400–3000px.
- Private Journal environment: 2400–3000px.
- My Sanctuary room: approximately 3000px wide.
- Support scene: 2400–3000px.
- Closing Sanctuary: 3200–4000px.

## D. Ritual objects
Prefer isolated transparent assets or carefully built SVG/3D renders.
- Candle: unlit + lit.
- Bell.
- Incense bowl + separate smoke asset.
- Lotus: closed + open; later optional 6–12 transition frames.
- Reflection journal/manuscript object.

Target: approximately 1000–1600px object masters.

## E. Optional flagship frame sequence
Only after hero composition and motion are approved.
- 80–140 rendered frames.
- Camera moves from entrance deeper into same sanctuary.
- Canvas rendering driven by ScrollTrigger progress.
- Static and reduced-motion fallback required.
- Do not fabricate a sequence by duplicating one still image.

## F. Production formats
- AVIF preferred for photographic scene assets where pipeline allows.
- WebP fallback.
- PNG only when true transparency is required.
- Responsive dimensions and `sizes/srcset` required.
- Preload only critical hero media.
