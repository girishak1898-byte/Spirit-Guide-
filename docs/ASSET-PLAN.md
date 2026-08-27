# ASSET-PLAN.md — Spirit Guide V5

## 1. Current State (critical gap — updated, still unresolved)

**No image, audio, or font asset files exist in this repository.** `public/assets/ASSET_STATUS.json`
(supplied in the official handoff pack) claims the Level-1 Temple Gateway hero is "supplied" at
`public/assets/hero/hero-sanctuary-level1-source.png` (1672×941 native) with a dimension-contract
derivative at `public/assets/hero/hero-sanctuary-level1-3840x2160.jpg` (explicitly flagged in the
manifest as *upscaled from the native source, not true additional-detail 4K* — replace before
final launch). **Neither file was actually included in this upload batch** — only the JSON
manifest describing them arrived. `public/assets/hero/` is empty. This is a manifest/asset
mismatch, not a resolved delivery — see the request at the bottom of this section.

The V4 UI reference screenshot and the visual production-pipeline board referenced in
`00_READ_ME_FIRST.md` ("Ready now") are in the same state: referenced as available, not actually
present in this session. Per the brief, none of these may be replaced with unrelated stock or
generic AI imagery if/when building proceeds — the correct action is to request the actual files,
which this report does.

This blocks all of Phase 2 (Temple Gateway) and any later chapter that needs cinematic imagery.
Phase 1 does not require any image asset and is unaffected — it already shipped and passed its
quality gate.

**Action needed:** please attach the actual binary files — at minimum
`hero-sanctuary-level1-source.png` (and, if you want Phase 2 layout/motion validation on the
larger derivative, `hero-sanctuary-level1-3840x2160.jpg`) — plus the UI reference image and
production board if you'd like them cross-checked before Phase 2 begins.

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

## 4a. Production Pipeline (from supplied visual asset pipeline guide)

A visual production-pipeline reference has been supplied (infographic, not exported assets — it
contains baked-in labels/checkmarks and thumbnail-resolution previews, so it cannot be used
directly as a source file). It independently confirms the Level-2 layer split in §2 above
(far environment / Buddha midground / foreground objects / haze-smoke / light overlay /
CSS vignette) and adds the following specifics, now adopted:

**Master sizes:** Hero/Temple Mode master 3840×2160 (16:9); other section scenes 3000×2000–
3200×1800; ritual objects 1000–1600px square, isolated on transparent/neutral background;
animation frame sequences 1920×1080; icons/UI 512–1024px.

**Formats:** AVIF + WebP for all photographic/environment assets (responsive at 1920/1440/1024/
mobile widths); WebP/PNG (transparent) for isolated ritual objects; AVIF sequence for animation
frames; SVG/PNG for icons.

**Per-scene asset list** (beyond the hero, one dominant image per scene — matches V4's "one
image, one statement" rule for Sanctuary Highlights):
Temple Mode · Meditation Hall · Lotus Garden · Daily Wisdom · Private Journal · My Sanctuary ·
Support Sanctuary · Closing Sanctuary — each a single cinematic master image, later croppable per
breakpoint, no baked-in text/UI (mirrors the hero rule in §2).

**Ritual objects (isolated, transparent bg):** Candle (unlit/lit states), Bell, Incense Bowl,
Lotus (closed/open states, ~8-frame bloom sequence for a smoother open animation if warranted),
Reflection/Journal object. Multiple states are prepared as separate exports, not CSS-filtered
recolors of one asset, so lit/unlit or closed/open reads as a real state change.

**Workflow:** lock the visual bible (identity/palette/lighting) once → generate concept options →
select and refine → separate into depth layers (Photoshop or equivalent) → isolate ritual objects
with clean edges → export in AVIF/WebP at the responsive sizes above → integrate with GSAP/React.
Consistency across scenes (architecture, materials, lighting, palette) matters more than variety
per the guide's own note — every scene must read as the same physical sanctuary.

**Quality checklist before any asset is accepted into the repo:** consistent architecture/
lighting across all scenes · Buddha always clear and unobstructed · left-side negative space
preserved in the hero for headline/CTA · palette matches the midnight/ivory/champagne/jade tokens
in `DESIGN-SYSTEM.md` (no flat or neon lighting) · no text, UI, or watermarks baked into any
asset · responsive formats exported · objects isolated with clean edges · animation states
prepared where the interaction needs them (candle flame, lotus bloom).

This does not change the Level 1 → 2 → 3 build order in §2 — Level 1 (single hero master, no
layers yet) is still the Phase 2 target; the layer/object list above is the target state once
Level 2 work begins.

## 5. Immediate Action Needed From You

Before Phase 2 can start, we need one of:
1. The real Level-1 hero image (single flattened, no-UI sanctuary artwork), or
2. Confirmation to proceed with a placeholder/generated stand-in for Phase 2 prototyping only,
   understood to be replaced before that phase is considered visually final.

This is a decision point, not a blocker for Phase 1 — Phase 1 has no asset dependency.
