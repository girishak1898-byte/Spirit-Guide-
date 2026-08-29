# Temple Gateway — Hero Motion Storyboard

## Scene contract
Desktop outer scene: approximately 240–270vh.
Sticky internal viewport: 100svh.
Use one master GSAP/ScrollTrigger timeline where practical.
Mobile gets a shorter, lower-cost version.

## 0–8% — Emergence
- Midnight background first.
- Hero media resolves softly.
- No fake loading progress screen.

## 8–15% — Arrival
- Navigation visible.
- Eyebrow: `WELCOME HOME`.
- Headline: `A sanctuary / for the inner life.`
- Supporting copy and two CTAs visible.
- Hero scale 1.00.
- Ambient candle/haze motion almost imperceptible.

## 15–25% — Invitation
- Spiritual note/supporting copy begins losing emphasis.
- Secondary CTA begins fading.
- Hero scale roughly 1.00 → 1.025.
- Edge vignette increases slightly.

## 25–38% — Focus
- Eyebrow and secondary CTA disappear.
- Primary statement remains.
- Tiny foreground/background separation begins.
- Central sanctuary illumination +2–4% only.

## 38–50% — Crossing
- Headline exits line-by-line using restrained opacity/translate/blur.
- Primary CTA disappears.
- Hero scale roughly 1.025 → 1.08.

## 50–65% — Leaving the Website
- Conventional hero UI is nearly gone.
- Foreground moves more than background.
- Buddha remains visually stable; do not make it appear to rush at the viewer.
- Haze drifts upward.
- Central light strengthens marginally.

## 65–78% — Pure Sanctuary
- No marketing copy.
- Give the visitor a meaningful moment of visual silence.
- Movement becomes slower, not more dramatic.

## 78–88% — Temple Identity
- Normal navigation becomes extremely restrained.
- Small eyebrow appears: `TEMPLE MODE`.

## 88–95% — Stillness Statement
Reveal:
`Nothing to achieve.`
`Stay for one breath or as long as you need.`

Keep typography elegant and smaller than an advertising billboard.

## 95–100% — Handoff
- Ritual dock begins resolving: Candle, Bell, Incense, Lotus, Reflection.
- End-state should visually match the opening state of Temple Mode.
- Avoid a black gap or unrelated scene load between hero and Temple Mode.

## Motion rules
- No bounce or elastic easing.
- Do not scroll-jack.
- Animate transform/opacity first; avoid layout-thrashing properties.
- `prefers-reduced-motion`: static hero + elegant non-scrubbed transition.
- Test crop and focal point at 390, 430, 768, 1024, 1280, 1440 and 1728+ px.
