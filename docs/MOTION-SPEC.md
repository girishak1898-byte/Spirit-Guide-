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

## 6. Temple Gateway — Scroll Storyboard (Phase 2 spec, documented now for planning)

Outer section: 240–270vh desktop (240vh baseline, tune during Phase 2 QA). Internal sticky scene:
`position: sticky; top: 0; height: 100svh`. One master GSAP timeline driven by a single
ScrollTrigger with `scrub: 1`, split into labeled segments so each state is independently tunable.

| Progress | State | Behavior |
|---|---|---|
| 0–0.08 | Darkness → resolve | Background exists at `--bg-primary-1`; hero image crossfades in per the intro timeline in V4 §4 (this only applies to true first-load, not to scroll re-entry) |
| 0.08–0.15 | Arrival | Full hero visible: eyebrow, headline, supporting copy, both CTAs, spiritual note, nav all present. Artwork scale 1.00. Small ambient movement only. |
| 0.15–0.25 | Invitation | Secondary paragraph opacity 1→0.4, secondary CTA and spiritual note begin fading. Artwork scale → ~1.025. |
| 0.25–0.38 | Focus | Secondary CTA and eyebrow fully gone. Hero copy remains. Foreground (if layered) shifts fractionally faster than background. Candlelight +3%. |
| 0.38–0.50 | Crossing | Headline exits line-by-line: `opacity 1→0`, `translateY 0→-24px`, `blur 0→5px` per line, staggered. Artwork scale 1.025→1.08. Primary CTA begins fading. |
| 0.50–0.65 | Threshold | Normal web UI (nav) recedes to near-invisible. Foreground scale 1→1.07 / translateY 0→2%; background scale 1→1.025. Haze layer (if present) drifts upward. Buddha/central subject stays visually locked — the environment moves, not the focal subject. |
| 0.65–0.78 | Immersion | No marketing copy on screen at all — deliberate visual silence (~30–50vh equivalent). Pure sanctuary. |
| 0.78–0.88 | Temple Mode reveal begins | Edges darken slightly; central light increases slightly. Eyebrow `TEMPLE MODE` fades in. |
| 0.88–0.95 | Statement | `Nothing to achieve.` (~54–64px desktop / ~38–44px mobile) then `Stay for one breath or as long as you need.` Reveal slowly, no dramatic movement. |
| 0.95–1.00 | Handoff | Ritual dock resolves one element at a time (Candle → Bell → Incense → Lotus → Reflection). ScrollTrigger ends; normal document scroll resumes into the next chapter. |

Design intent carried through every segment: the Buddha/central subject must never appear to
"zoom toward" the viewer — scale and parallax differentials create the illusion that the *viewer*
moves through the environment. See `ASSET-PLAN.md` §2 for how this is achieved with a single
flattened image vs. layered assets.

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

Architecture note for `ASSET-PLAN.md`: when true rendered frame sequences are supplied (Temple
Gateway→Temple Mode, and optionally Meditation Hall intro — max two moments per the brief), the
scroll-to-frame mapping is `frameIndex = Math.round(scrollProgress * (frameCount - 1))`, rendered
to a `<canvas>`, with neighbor-frame preloading (not all frames upfront), `devicePixelRatio`-aware
source selection, a static-image fallback, and full respect for the reduced-motion strategy above.
Not implemented until real frames exist — do not build this in Phase 1 or 2.
