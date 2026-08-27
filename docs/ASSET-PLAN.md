# ASSET-PLAN.md — Spirit Guide V5

## 1. Current State (critical gap)

**No image, audio, or font assets exist in this repository.** `public/assets/` was created empty
during Phase 0. The reference screenshot shared in chat is a *composited UI mock* (it contains
baked-in navigation, cards, and text) — per the brief it must **not** be used as the production
hero asset. It's the art-direction reference only: Buddha placement, candlelight palette, temple
architecture style.

This blocks all of Phase 2 (Temple Gateway) and any later chapter that needs cinematic imagery.
Phase 1 does not require any image asset and is unaffected.

## 2. Hero Asset Levels (build order — do not skip ahead)

**Level 1 — Single image (Phase 2 target):** one high-resolution (~3840×2160) hero image with
*no baked-in UI* — no nav, no buttons, no cards, no text, no ritual icons. Just the sanctuary:
temple architecture, unobstructed centered Buddha, candles, lotus, water, atmospheric haze.
Composition target: keep the left ~30–38% relatively clean for the text safe-zone; concentrate
visual energy around ~55–65% horizontal position. Depth on a flat image is created entirely
through GSAP: crop/scale changes, lighting masks, blurred foreground overlays, gradient masks,
controlled parallax — never faked 3D geometry.

**Level 2 — Layered planes (post Level-1 approval):** the same environment separated into
independently-moving layers:

```
public/assets/hero/desktop/
  background-environment.avif   (far architecture, columns, ceiling, distant lanterns)
  buddha-midground.webp          (Buddha, mandala, immediate shrine — transparent bg)
  foreground.webp                (nearest candles, lotus, bowls, stones, near water)
  haze.webp                      (incense smoke / atmospheric haze — transparent, near-invisible)
  light-overlay.webp             (Buddha backlight, candle pools, gold highlights — screen-blend)
```

Vignette/color-grading (edge darkening, central-focus brightening as scroll progresses) is done in
CSS, not baked into any layer, so it can react to scroll state.

Approximate movement bands during the Temple Gateway sequence (ties to `MOTION-SPEC.md` §6):
```
background-environment   translateY 0→-1%,  scale 1→1.03
buddha-midground          translateY 0→-2%,  scale 1→1.05   (stays visually locked/stable)
foreground                translateY 0→4%,   scale 1→1.10
haze                       translateY 0→-6%,  opacity .25→.45
light-overlay              opacity .55→.70
```

**Level 3 — Rendered frame sequence (flagship, later):** 80–150 rendered frames of a camera
slowly moving through the sanctuary, mapped to scroll progress via canvas (see `MOTION-SPEC.md`
§9). Reserved for at most two moments: Temple Gateway → Temple Mode, and optionally the Meditation
Hall intro. Not started until Level 1 is validated and approved, and real frames are supplied —
never manufactured by duplicating one still image.

## 3. Format & Responsive Strategy

- Deliver AVIF primary, WebP fallback, JPEG last-resort fallback, via `next/image` `sources`.
- Separate art direction per breakpoint — **not** a single desktop image cropped down:
  - Desktop: copy | Buddha side-by-side composition
  - Tablet (768–1024): adjusted crop keeping Buddha + mandala fully visible
  - Mobile (390–430): copy above, Buddha/sanctuary below or behind at reduced but intentional
    prominence — never a cropped-off Buddha
- Retina-capable (2x) source required for every breakpoint image.
- No base64-embedded images in CSS. No unnecessary preloading beyond the actual above-the-fold
  hero asset.

## 4. Other Chapter Assets (needed before their respective phases, not now)

- `public/assets/temple/` — Temple Mode environment + ritual dock iconography (Phase 4)
- `public/assets/meditation/` — Meditation Hall environment, breathing mandala ring art if not
  pure CSS/SVG (Phase 5)
- `public/assets/wisdom/` — manuscript/parchment imagery for Daily Wisdom (Phase 6)
- `public/assets/journal/` — desk/leather/lamp imagery for Private Journal (Phase 6)
- Ritual object art (candle, bell, incense burner, lotus) — purpose-built SVG or image assets,
  never emoji/Unicode/generic icon packs (Phase 3/4)
- Bell audio sample (high-quality, natural decay) — Phase 3/4
- Sound Sanctuary loops: Temple, Rain, Forest, Singing Bowls, River (seamless loops) — Phase 5

## 5. Immediate Action Needed From You

Before Phase 2 can start, we need one of:
1. The real Level-1 hero image (single flattened, no-UI sanctuary artwork), or
2. Confirmation to proceed with a placeholder/generated stand-in for Phase 2 prototyping only,
   understood to be replaced before that phase is considered visually final.

This is a decision point, not a blocker for Phase 1 — Phase 1 has no asset dependency.
