# MOTION-SPEC.md — Spirit Guide V5

## 1. Ownership Rules (hard boundary — never violated)

| Owns | Used for |
|---|---|
| **GSAP + ScrollTrigger** | Scroll choreography, pinning, scrubbed transitions, image masking, parallax, major text-reveal sequences, horizontal highlight storytelling, chapter/scene transitions, the hero sequence |
| **Framer Motion (`motion`)** | Menu open/close, modal transitions, selected-state changes, small component presence transitions |
| **CSS** | Hover, focus, pressed states, tiny microinteractions |

**Never** let GSAP and Framer Motion animate the same `transform`/`opacity` property on the same
DOM element. If a component needs both a scroll-driven state and a click-driven state (rare),
split it into an outer element GSAP controls and an inner element Framer controls.

Implementation rules:
- Every GSAP timeline/ScrollTrigger is created inside `gsap.context()`, scoped to the owning
  component's ref, and reverted in the `useLayoutEffect` cleanup. No exceptions.
- Use `gsap.matchMedia()` for desktop/tablet/mobile behavior branching — never `window.innerWidth`
  checks scattered through components.
- Never create a new ScrollTrigger on every React re-render — timelines are built once per mount
  (or once per matchMedia breakpoint change) and reused.

## 2. Duration Tokens (from `DESIGN-SYSTEM.md`)

```
micro:      150–250ms   → hover, button state, icon change
ui:         250–450ms   → menu, card change, selector transition
editorial:  600–1000ms  → headline/scene introduction
cinematic:  1000–1800ms → environment transformation, scene transition
scroll:     no fixed duration — driven directly by scroll progress (scrub)
```

## 3. Easing

Default: `power3.out` / `power4.out` for entrances, `power2.inOut` for state changes. CSS
equivalent: `cubic-bezier(0.16, 1, 0.3, 1)` (`--ease-premium`). **Never** bounce, elastic, or
overshoot easing anywhere in the product.

## 4. Scroll Pinning Rule

Pin only the scenes that need it. Candidates (per brief): Temple Gateway transition, Sanctuary
Highlights, Temple Mode transition, Meditation Hall introduction, at most one Wisdom/Lotus
transition. Everything else scrolls normally. Stillness between pinned scenes is intentional —
do not add motion just because a section is otherwise "quiet."

## 5. Parallax Depth (conceptual speed bands)

```
background: 0.15–0.25
midground:  0.35–0.5
foreground: 0.55–0.75
text/UI:    normal document speed (no parallax)
```

Users should feel depth without consciously registering "this page uses parallax."

## 6. Temple Gateway — Scroll Storyboard

**Now sourced directly from the official `04_HERO_MOTION_STORYBOARD.md`** — this project's own
earlier derivation (from the pre-handoff build conversation) independently matched the official
percentage breakpoints and intent almost exactly, so the table below adopts the official stage
names verbatim and folds in this project's implementation-level detail (exact scale/opacity/blur
values) underneath each official stage.

Outer section: 240–270vh desktop (240vh baseline, tune during Phase 2 QA). Internal sticky scene:
`position: sticky; top: 0; height: 100svh`. One master GSAP timeline driven by a single
ScrollTrigger with `scrub: 1`, split into labeled segments so each state is independently tunable.
Mobile gets a shorter, lower-cost version per §8 below.

| Progress | Official Stage (`04`) | Behavior |
|---|---|---|
| 0–0.08 | Emergence | Midnight background first (`--bg-primary-1`); hero media resolves softly. No fake loading-progress screen. This project's own intro-timeline detail (blurred low-res → full-res crossfade) applies only to true first page load, not scroll re-entry. |
| 0.08–0.15 | Arrival | Full hero visible: nav, eyebrow `WELCOME HOME`, headline, supporting copy, both CTAs, spiritual note. Artwork scale 1.00. Ambient candle/haze motion almost imperceptible. |
| 0.15–0.25 | Invitation | Supporting copy and spiritual note begin losing emphasis (opacity 1→0.4); secondary CTA begins fading. Artwork scale → ~1.025. Edge vignette increases slightly. |
| 0.25–0.38 | Focus | Eyebrow and secondary CTA fully gone. Primary statement remains. Tiny foreground/background separation begins (foreground shifts fractionally faster). Central illumination +2–4%. |
| 0.38–0.50 | Crossing | Headline exits line-by-line: `opacity 1→0`, `translateY 0→-24px`, `blur 0→5px` per line, staggered. Primary CTA disappears. Artwork scale 1.025→1.08. |
| 0.50–0.65 | Leaving the Website | Conventional hero UI (nav) nearly gone. Foreground moves more than background (scale 1→1.07 / translateY 0→2% vs. background scale 1→1.025). Haze drifts upward. Buddha/central subject stays visually locked — it must not appear to rush at the viewer; the environment moves, the focal subject doesn't. Central light strengthens marginally. |
| 0.65–0.78 | Pure Sanctuary | No marketing copy at all — a meaningful, deliberate period of visual silence (~30–50vh equivalent). Movement becomes slower, not more dramatic. |
| 0.78–0.88 | Temple Identity | Navigation becomes extremely restrained. Small eyebrow `TEMPLE MODE` fades in. Edges darken slightly. |
| 0.88–0.95 | Stillness Statement | `Nothing to achieve.` (~54–64px desktop / ~38–44px mobile, elegant — smaller than an advertising billboard) then `Stay for one breath or as long as you need.` Reveal slowly, no dramatic movement. |
| 0.95–1.00 | Handoff | Ritual dock resolves one element at a time (Candle → Bell → Incense → Lotus → Reflection). End-state must visually match Temple Mode's own opening state — no black gap or unrelated scene load. ScrollTrigger ends; normal document scroll resumes. |

Design intent carried through every segment: the Buddha/central subject must never appear to
"zoom toward" the viewer — scale and parallax differentials create the illusion that the *viewer*
moves through the environment. See `ASSET-PLAN-IMPLEMENTATION.md` §2 for how this is achieved with
a single flattened image vs. layered assets, and `04_HERO_MOTION_STORYBOARD.md`'s own "Motion
rules": no bounce/elastic easing, no scroll-jacking, animate transform/opacity first, test crop
and focal point at all 7 breakpoints (390/430/768/1024/1280/1440/1728+).

The Temple Gateway's final state (immersive, no UI, statement text) must visually resemble Temple
Mode's own default state, so entering Temple Mode later doesn't feel like a discontinuous jump.

## 7. Reduced Motion Strategy

`prefers-reduced-motion: reduce` must produce a genuinely elegant static experience, not a
disabled one:
- Temple Gateway: skip the scrubbed zoom/parallax entirely. Render the hero at rest, then use a
  simple opacity/translateY cross-section transition into "Nothing to achieve" content as the
  user scrolls normally (no pinning, no scale animation).
- Meditation breathing mandala: replace the animated ring with a static ring plus clear text state
  (`Breathe In — 4`) — the practice must remain fully usable from text alone.
- Mobile menu: opacity-only transition, no clip-path sweep.
- Ambient effects (candle flicker, haze drift, dust) are disabled outright under reduced motion —
  they carry no functional information, so removing them is correct (unlike the hero transition,
  which needs a *replacement*, not a removal).

Implementation: a shared `components/motion/ReducedMotion.tsx` / `useReducedMotion` hook, checked
once via `matchMedia('(prefers-reduced-motion: reduce)')`, feeding both the GSAP matchMedia
branches and any Framer `transition` overrides — never a per-component ad hoc check.

## 8. Mobile Motion Adjustments (all scroll/pin scenes)

Shorter pin distance, reduced parallax range, less blur, fewer simultaneous animated layers,
shorter travel distances, touch-first controls (no hover-dependent state). These are separate
`gsap.matchMedia()` branches, not the desktop timeline played at a smaller scale.

## 9. Frame-Sequence Readiness (future, not built now)

Architecture note for `ASSET-PLAN-IMPLEMENTATION.md`: when true rendered frame sequences are supplied (Temple
Gateway→Temple Mode, and optionally Meditation Hall intro — max two moments per the brief), the
scroll-to-frame mapping is `frameIndex = Math.round(scrollProgress * (frameCount - 1))`, rendered
to a `<canvas>`, with neighbor-frame preloading (not all frames upfront), `devicePixelRatio`-aware
source selection, a static-image fallback, and full respect for the reduced-motion strategy above.
Not implemented until real frames exist — do not build this in Phase 1 or 2.

## 10. Reconciliation with the Official V4 Brief (§33–35)

The official `01_SPIRIT_GUIDE_V4_MASTER_BRIEF.md` §33 ("Microinteraction system") independently
confirms the restraint rules here — no bounce, no playful motion — and adds concrete per-element
notes not previously captured:

- Buttons: 1–2px elevation, slight highlight, subtle gold shift (not the 2–4px this spec's
  ritual-object guidance uses elsewhere — buttons get the smaller, more restrained value).
- Cards: tiny perspective/depth response (a few degrees of 3D tilt or shadow shift), not just flat
  elevation.
- Navigation: smooth active indicator (small champagne/jade mark under the active chapter link).
- Images: very slight scale only when it serves a purpose — never decorative.
- "Scroll reveals: 250–500ms" is the brief's own general guideline for simple in-view reveals.
  This spec's `--duration-editorial` (600–1000ms) is intentionally slower and reserved
  specifically for hero/section *emotional statements* (per V4 §3's typography intent and the
  more detailed V5 storyboard in §6 above) — general-purpose reveals (e.g. a card fading into
  view) should use `--duration-ui` (250–450ms), which already sits inside the brief's 250–500ms
  band. No contradiction, but future components should pick the right token: editorial for
  statements, ui for everything else.
- §35 confirms: natural scroll only, no scroll-jacking, sticky positioning used selectively (its
  own example — Meditation Hall visual staying fixed while explanation text scrolls — is a good
  concrete case for Phase 5, not previously spelled out).
