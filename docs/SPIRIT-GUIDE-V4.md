# SPIRIT GUIDE — PRODUCT SPECIFICATION (V4 BASELINE)

> Reconstructed from the full product brief supplied in chat (the "Spirit Guide V5 — Apple-Class
> Midnight Sanctuary" master prompt and the subsequent refinement conversation). This document is
> the **source of truth for product functionality, content, terminology, privacy, accessibility,
> responsive requirements, and performance targets**. `docs/DESIGN-SYSTEM.md`, `docs/MOTION-SPEC.md`,
> `docs/ASSET-PLAN.md` and `docs/ARCHITECTURE.md` upgrade *how* this is presented; they must never
> silently drop a requirement listed here.

## 1. Product Definition

Spirit Guide is a premium digital sanctuary for meditation, contemplative wisdom, ritual,
reflection, intention-setting, private journaling, sound, and personal spiritual practice.

**Core emotional target:** a visitor must not feel "I opened another meditation website." They
must feel "I entered somewhere."

**Benchmark:** contemporary premium Apple product pages (e.g. an iPhone Pro launch page) — for
craftsmanship discipline only. Never copy Apple branding, layouts, assets, animations, or copy.

## 2. Experience Journey (Narrative Model)

```
ARRIVE   → Temple Gateway
ENTER    → Temple transition / sanctuary reveal
DISCOVER → Guide Me + rituals
EXPERIENCE → Temple Mode
BREATHE  → Meditation Hall
LISTEN   → Sound Sanctuary
REFLECT  → Wisdom + Lotus Garden
PLACE    → Intention Sanctuary
WRITE    → Private Journal
BELONG   → My Sanctuary
SUPPORT  → Support the Sanctuary
RETURN   → Closing temple scene
```

For presentation purposes these 12 narrative beats are grouped into **7 emotional chapters**
(this grouping is a presentation decision, defined in `ARCHITECTURE.md`/`IMPLEMENTATION-PLAN.md`;
no functional requirement below is removed by the grouping):

1. **Enter** — Navigation, Temple Gateway, Hero, Temple-entry scroll transition
2. **Discover** — Sanctuary Highlights, Guide Me, Ritual Actions
3. **Temple** — Temple Mode (immersive) + all ritual interactions
4. **Breathe** — Meditation Hall, breathing mandala, Sound Sanctuary
5. **Reflect** — Daily Wisdom, Lotus Garden, Intention Sanctuary
6. **Belong** — Private Journal, My Sanctuary
7. **Return** — Support the Sanctuary, closing scene, footer

## 3. Global Navigation

**Desktop:**
- Left: Spirit Guide symbol + wordmark
- Center/right nav: Temple, Meditate, Wisdom, Rituals, Journal, My Sanctuary
- Primary action: **Enter Temple**
- Initial state: nearly transparent over hero. Becomes increasingly opaque midnight glass on
  scroll (restrained `backdrop-filter`, 1px border, small shadow). Transition must interpolate
  smoothly, not step.
- Optional: active-chapter awareness once user is past the hero.
- Optional secondary layer: minimal local chapter navigation (Sanctuary / Temple / Meditation /
  Wisdom / Journal) that appears only once useful — never cluttering the opening hero.

**Mobile:**
- Purpose-built system, not a shrunk desktop nav. Header = logo + menu control.
- Opening the menu produces a full-height Midnight Sanctuary layer, animated via opacity,
  clip-path, and controlled translate — no cartoon spring physics.
- Menu items: Temple, Meditate, Wisdom, Rituals, Journal, My Sanctuary. CTA: Enter Temple.
- All touch targets ≥ ~44px.

## 4. Chapter 01 — Temple Gateway (Hero)

Uses the supplied cinematic temple artwork as visual reference; Buddha must remain unobstructed
and correctly framed. Desktop composition: ~35–40% textual narrative zone, remainder for artwork.

**Copy:**
- Eyebrow: `WELCOME HOME`
- Headline: `A sanctuary / for the inner life.`
- Supporting: `Ancient wisdom for modern life. Rituals, meditation and reflection designed to
  help you return to what is real.`
- Primary CTA: `Enter Temple`
- Secondary CTA: `Begin Meditation`
- Restrained spiritual note (opposite side, small): `May all beings be happy and at peace.`

No large "Daily Wisdom card" overlapping the hero.

**Hero intro timeline (first load, near-darkness start):**
0.00s background exists → 0.15s low-res image visible → 0.35s full-res crossfade → 0.60s
atmospheric illumination resolves → 0.90s eyebrow → 1.05s heading line 1 → 1.18s heading line 2 →
1.35s supporting copy → 1.55s primary CTA → 1.65s secondary CTA → 1.8s+ ambient environment
becomes subtly alive. Motion = tiny translateY + opacity + blur reduction combinations. No
bounce, no dramatic springs; premium cubic-bezier/GSAP easing only.

**Hero atmosphere:** very subtle candle flame movement, incense haze, tiny dust movement,
reflection shimmer, ambient light breathing, depth parallax. Should be almost imperceptible —
never a game environment.

**Signature scroll transition ("Enter the Temple"):** the primary signature interaction of the
product. Outer section ~200–260vh; internal scene `position: sticky; top:0; height:100svh`;
GSAP ScrollTrigger drives the sequence. Detailed percentage-mapped storyboard lives in
`docs/MOTION-SPEC.md` (source: refinement conversation). End state reveals:
- Statement: `Nothing to achieve.`
- Supporting line: `Stay for one breath or as long as you need.`

No visible hard section cut — the visitor should feel they crossed a threshold, not that a new
image loaded.

**Image limitation constraint:** if only a single flattened hero image exists, do not fake true
3D geometry. Create depth via crop changes, scaling, lighting masks, blurred foreground overlays,
gradient masks, perspective, controlled parallax, texture/shadow layers. Component architecture
must allow a future layered asset set (or frame sequence) to replace the single image without a
rewrite. See `docs/ASSET-PLAN.md`.

## 5. Chapter 02 — Sanctuary Highlights

"Inside the Sanctuary" — borrows the *information architecture discipline* of a premium product
Highlights section (not its visual style). Cinematic panels, not tiny cards:
- Temple Mode
- Meditation Hall
- Daily Wisdom
- Journal
- My Sanctuary

Each highlight: one image, one strong statement, one supporting sentence, one optional action —
never a wall of copy. Desktop may use horizontal scroll-linked storytelling.

## 6. Chapter 03 — Ritual Actions

Light a Candle · Ring the Bell · Offer Incense · Offer Lotus · Reflection.

Purpose-designed objects — **no Unicode emoji, no generic icon packs.** Objects must feel
physically present. Hover: 2–4px elevation max, subtle border brightness, tiny object shift,
small light response, CTA arrow translate ~3–5px. No huge scale, no glowing halo on every object.

**Candle:** click → optional intention field → flame ignition animation → local light increase →
save intention locally (prototype) → optional audio only after explicit interaction.

**Bell:** click → physical swing/strike animation → high-quality bell sample → natural decay. No
autoplay.

**Incense:** click → subtle increase in smoke movement → reveal short contemplation text.

**Lotus:** click → small opening animation → reveal intention/reflection prompt.

**Reflection:** opens reflection experience or leads into journal/wisdom. Never attribute
invented quotations to Buddha.

## 7. Chapter 04 — Guide Me

Question: `What do you need today?`
Choices: Restless · Anxious · Heavy · Scattered · Seeking Clarity.

Must NOT resemble a five-column SaaS pricing grid — editorial interactive selector, each option
can contain a small cinematic environment. Selecting an option transitions a central
recommendation in place (no page load).

Example: `Restless` → `7-minute Longer Exhale` — "Slow the nervous system with a longer outward
breath." → CTA `Begin Practice`.

Selecting the CTA must preconfigure Meditation Hall (duration + pattern + category). This
requires shared state between Guide Me and the meditation domain — see `ARCHITECTURE.md` §State.

## 8. Chapter 05 — Temple Mode (Flagship Experience #1)

Fully immersive viewport state.
- Top-left: Spirit Guide identity
- Top-right: Close (×)
- Center: unobstructed sanctuary/Buddha environment
- Left/lower-left: current ritual state
- Bottom: floating ritual dock (Candle, Bell, Incense, Lotus, Reflection), restrained Midnight
  glass. Interface must never cover the Buddha.

**States:**
| Trigger | Statement | Supporting line |
|---|---|---|
| Default | Nothing to achieve. | Stay for one breath or as long as you need. |
| Candle | Light a candle. | Name one intention without needing to explain it. |
| Bell | Ring the bell. | Listen until the sound becomes silence. |
| Incense | Offer incense. | Let gratitude rise without words. |
| Lotus | Offer a lotus. | Open toward what you are ready to receive. |
| Reflection | (original Spirit Guide reflection) | — no manufactured religious attribution |

## 9. Chapter 06 — Meditation Hall (Flagship Experience #2)

Deeply cinematic dark temple hall: circular meditation platform, mandala flooring, depth
architecture, candle path, restrained foliage, midnight-blue atmosphere. Breathing interface is
visually central.

**Breathing mandala layers:** outer atmospheric halo, champagne ring, subtle jade ring, inner
midnight surface, progress indication.

**Sequence:** INHALE 4s (ring expands slowly) → HOLD 2s (still) → EXHALE 6s (ring contracts). No
pulsing neon, no sci-fi hologram look — movement must read as physically soothing.

**Controls:** durations 3 / 7 / 12 / 20 min, selected duration gets a restrained champagne border.
Primary CTA `Begin Meditation` → becomes `Pause` when active. Must show remaining timer (e.g.
`06:42`), progress, and current breath phase. Functional requirements: start, pause, resume,
finish, reset — state transitions must be reliable (esp. across tab visibility changes).

**Architecture for future categories** (data model only, do not build all in prototype): Breath
Awareness, Body Scan, Stillness, Compassion, Sleep, Clarity, Anxiety Relief, Morning Practice,
Evening Practice.

## 10. Chapter 07 — Sound Sanctuary

Environments: Temple, Rain, Forest, Singing Bowls, River, Silence. Controls: play, pause, volume,
selection. **Never autoplay.** Loops must be seamless. Leaving the environment must stop/cleanup
playback intentionally — no orphaned audio.

## 11. Chapter 08 — Daily Wisdom

Must feel like encountering a contemplative object, not a rectangular content card. Visual
language: dark manuscript, aged ivory paper, subtle gold edge, candle illumination.

Headline: `Read once. / Sit with it.` then one contemplation.
Actions: `Read today's wisdom` / `Another reflection`.

**Attribution rule (hard constraint):** original text is labeled "Spirit Guide Reflection";
verified Buddhist material is labeled "Teaching." **Never invent a Buddha quote.**

## 12. Chapter 09 — Lotus Garden

Deliberate pacing/quiet beat after functional sections. Night garden: dark water, lotus, stone,
lanterns, distant temple, restrained jade foliage. Copy: `Return to stillness.` — at most one
reflective question. Generous visual space; exists partly to slow the experience down. Do not
overload with functionality.

## 13. Chapter 10 — Intention Sanctuary

Headline: `Place one thing here with care.`
Placeholder: `May I meet today with…` — max 180 characters.
CTA: `Place Intention`. On success: small light/lotus acknowledgement + `Your intention has been
placed.`
Prototype persistence: `localStorage`. Production must support authenticated secure storage later
(architecture must allow the swap — see `ARCHITECTURE.md` §Storage).

## 14. Chapter 11 — Private Journal

Headline: `Write without performing.` More editorial visual language than Intention tool: dark
leather, ivory paper, warm lamp, jade bookmark, quiet desk. Textarea must be extremely
comfortable. Provide word/character count. CTA: `Save Reflection`. Prototype storage:
`localStorage` — must not present fake cloud persistence.

## 15. Chapter 12 — My Sanctuary (Flagship Experience #3)

Must NOT resemble an analytics dashboard. Represents the user's private spiritual room.
Headline: `Your personal spiritual home.`

Represent Practice, Intention, Journal, Wisdom as meaningful objects within the room — never as
KPI widgets. Avoid anxiety-inducing gamification; no conventional daily-streak pressure by
default; **no fake statistics of any kind** (e.g. no "328,947 people on the path" style counters).

**Logged-out state:** Headline `Create your Sanctuary`, concise benefit copy, actions `Create
account` / `Sign in`. Do not implement fake authentication — display a clearly defined preview
state until real backend work begins.

## 16. Chapter 13 — Support the Sanctuary

Respectful tone only. Offerings: £5 / £10 / £25 / Custom. Essential spiritual content must never
feel paywalled. Do not implement fake Stripe/payment behavior — payments are a backend-phase
feature (Phase 10), explicitly out of scope until separately approved.

## 17. Chapter 14 — Closing Scene

Do not let the page end after functional UI — return to cinematic storytelling. Environment: dark
shrine, water reflection, distant lights, sanctuary atmosphere. Headline: `The door stays open.`
Supporting: `Return whenever you need.` CTA: `Enter Temple`. Must emotionally mirror the opening
(opening = entering; ending = belonging).

## 18. Content Policy

Tone: calm, intelligent, warm, respectful, concise, grounded. Avoid: fake mysticism, religious
manipulation, fear, overpromising ("transform your life instantly"), gamification pressure.
**Never invent quotations attributed to Buddha.**

## 19. Accessibility (target WCAG AA)

Semantic HTML, logical heading hierarchy, full keyboard navigation, visible focus states,
meaningful control names, meaningful image alt text, sufficient contrast, touch targets ≥44px,
correct screen-reader states, no sound autoplay ever, no inaccessible custom buttons.
`prefers-reduced-motion` must produce an elegant static/low-motion version — never simply disable
the whole experience. Meditation must remain fully understandable without animated rings (timer +
phase text alone must suffice).

## 20. Responsive Requirements

Tablet is a first-class design, not an interpolation between mobile and desktop. Test at minimum:
390, 430, 768, 1024, 1280, 1440, 1728+. Mobile motion must be independently art-directed (shorter
pinning, reduced parallax, less blur, fewer simultaneous layers, shorter travel distances,
touch-first controls) — never merely a shrunk desktop animation.

## 21. Performance Targets

LCP ideally < 2.5s, CLS < 0.1, INP < 200ms where practical, 60fps on supported modern hardware
where possible. Prefer `transform`/`opacity` for animation. Avoid animating expensive layout
properties continuously. Avoid heavy filters. No unnecessary particle effects. Pause ambient
animation when offscreen where practical. Code-split; dynamically import expensive experiences
(Temple Mode, Meditation Hall, Sound Sanctuary).

## 22. Privacy Direction

Journal and Intention content is sensitive. Prototype phase: `localStorage` only, encapsulated
behind a storage abstraction (see `ARCHITECTURE.md` §Storage) so production can swap in
authenticated, encrypted storage without touching presentation components. Private sanctuary
content (My Sanctuary, Journal) must never be indexed by search engines.

## 23. SEO

Public content: metadata, semantic titles, OG data, canonical URLs, sitemap, robots
configuration, structured data where appropriate.

## 24. Analytics (future)

Eventually measure: Temple entry, meditation start/completion, duration selection, ritual
interaction, journal save, intention placement, return visits, account creation, support
conversion. Must remain non-invasive. **No fake visitor counters, ever.**

## 25. Loading & Empty/Failure States

**Loading:** never a generic spinner — use Spirit Guide visual language (lotus, breathing ring,
thin champagne line) only where a loading indicator is genuinely needed; never delay usable
content just to show an animation.

**Empty states:**
- Journal: `Nothing written yet.` — "Begin with one honest sentence."
- Intentions: `No intention placed.` — "Place what matters here."
- Wisdom collection: `Your collection is quiet.` — "Save a reflection when one speaks to you."

**Failure states:**
- 404: `This path has gone quiet.` → `Return to Sanctuary`
- Offline: `The sanctuary is temporarily unreachable.` → `Retry`
Error states remain clear and useful despite spiritual styling.

## 26. Absolute Rejection List

Standard SaaS homepage structure · giant card grids for cinematic sections · excessive
glassmorphism · generic meditation template · 120px serif typography everywhere · excessive gold
· brown UI overlays · bright yellow CTAs · cheap/generic icon packs · Unicode ritual symbols ·
stock photography mismatching the art direction · dashboard-like My Sanctuary · fake statistics ·
fake reviews · fake Buddha quotes · visual clutter over Buddha artwork · excessive empty dark
sections with no purpose · glow on every element · constant/idle animation everywhere ·
identical repeated section layouts · repetitive "headline + paragraph + button" pattern ·
scroll-jacking · WebGL used merely to show technical sophistication.

## 27. Future Backend (not in scope until explicitly approved)

Likely platform: Supabase. Domains: users, profiles, meditations, meditation_sessions,
journal_entries, intentions, wisdom_content, saved_wisdom, subscriptions, donations. Journal/
intention content requires special privacy handling. Payments (Stripe) are a separate, later
phase.
