# ARCHITECTURE.md — Spirit Guide V5

Companion to `01_SPIRIT_GUIDE_V4_MASTER_BRIEF.md` and `02_V5_MASTER_BUILD_DIRECTIVE.md` (product
source of truth — supplied by the official Claude handoff pack, superseding the earlier
chat-reconstructed `SPIRIT-GUIDE-V4.md`), `DESIGN-SYSTEM.md`, `MOTION-SPEC.md`, `ASSET-PLAN.md`,
`IMPLEMENTATION-PLAN.md`. This document covers technology choices, directory structure, component
boundaries, state domains, and the storage abstraction.

## 1. Current Repository State (updated — this is a re-run of Phase 0, not a fresh start)

This is the second Phase 0 pass. The first ran against a chat-reconstructed version of the brief
before any official handoff pack existed, and Phase 1 (design tokens, typography, navigation,
motion primitives) was already implemented and gated (typecheck/lint/tests/build/responsive/
keyboard/reduced-motion all passing) on that basis. This official pack (`CLAUDE.md`,
`00_READ_ME_FIRST.md`, `01_SPIRIT_GUIDE_V4_MASTER_BRIEF.md`, `02_V5_MASTER_BUILD_DIRECTIVE.md`,
`ASSET_STATUS.json`) has now been copied into the repo at the paths it expects. Cross-checking it
against the existing Phase 1 code found one real gap (radius tokens — see §10) and no other
rework. `public/assets/hero/` exists but is empty — the hero asset `ASSET_STATUS.json` claims is
supplied was not actually included in this upload (see `ASSET-PLAN.md` §1).

## 2. Technology Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router) + React + TypeScript | Required by brief; supports Image optimization, routing per chapter, code splitting, RSC for static content |
| Scroll choreography | GSAP + ScrollTrigger | Required by `02_V5_MASTER_BUILD_DIRECTIVE.md`. Note: the official V4 brief's own §42 tech section only lists "Framer Motion and CSS" for animation — the V5 Build Directive explicitly upgrades this by adding GSAP as the scroll-choreography owner, which is what's implemented; this is a deliberate V5 upgrade over V4, not a contradiction to resolve. |
| Component-level motion | Framer Motion (`motion`) | Menu, modal, selected-state, presence transitions only |
| Styling | CSS custom properties (design tokens) + Tailwind CSS utility layer | Tokens give us the strict palette/spacing discipline the brief demands; Tailwind speeds up layout without inventing ad hoc values |
| Cross-cutting state | React Context, component-local `useState` | Sufficient for Phase 1–7 scope |
| Global state (conditional) | Zustand | Adopt **only** if/when a state domain genuinely needs to be read from 3+ unrelated component subtrees (e.g. Guide Me → Meditation Hall handoff in Phase 3+). Not used in Phase 1. |
| Audio | Native Web Audio API via a thin `lib/audio` wrapper | Avoids an extra dependency (Howler) until a real need (crossfading loops, multiple concurrent sources) appears |
| Smooth scroll | Lenis — **deferred, not adopted in Phase 1–2** | Brief marks it optional; only added later if GSAP ScrollTrigger's native scroll feels insufficient, and only if it doesn't break anchor nav/keyboard/back-forward/a11y |
| 3D / WebGL | None | Explicitly rejected until a specific effect (smoke/light depth) demonstrably can't be done in CSS/GSAP |

**Rejected outright (per brief):** Redux (no demonstrated need), Three.js (start), any CSS-in-JS
runtime that fights Tailwind/tokens, any animation library with spring/bounce defaults used
un-configured (Framer's default easing must be explicitly set to match our tokens).

## 3. Directory Structure

```
spirit-guide/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                  # composes chapters for the single-page journey
│   ├── temple/                   # deep-linkable Temple Mode route (Phase 4+)
│   ├── meditate/                 # deep-linkable Meditation Hall route (Phase 5+)
│   ├── wisdom/
│   ├── journal/
│   └── sanctuary/
│
├── components/
│   ├── navigation/
│   │   ├── GlobalNav.tsx
│   │   └── MobileNav.tsx
│   ├── gateway/                  # Phase 2
│   ├── highlights/                # Phase 3
│   ├── rituals/                   # Phase 3/4
│   ├── guide/                     # Phase 3
│   ├── temple/                    # Phase 4
│   ├── meditation/                # Phase 5
│   ├── wisdom/                    # Phase 6
│   ├── journal/                   # Phase 6
│   ├── intention/                 # Phase 6
│   ├── sanctuary/                 # Phase 7
│   ├── motion/                    # Phase 1 — shared primitives (see §5)
│   └── ui/                        # Phase 1 — Button, Chip, Field, GlassPanel, etc.
│
├── lib/
│   ├── motion/                    # GSAP context helpers, matchMedia breakpoints, easing tokens
│   ├── audio/                     # Web Audio wrapper, autoplay-safe gating
│   ├── storage/                   # persistence abstraction (see §6)
│   └── content/                   # wisdom/reflection content, attribution-tagged
│
├── hooks/
├── types/
├── styles/                        # token CSS, global.css
├── public/assets/
│   ├── hero/
│   ├── temple/
│   ├── meditation/
│   ├── wisdom/
│   └── journal/
└── docs/
```

No component file should exceed roughly 250–300 lines; a chapter that grows past that is split
into a container (state/layout) + presentational subcomponents, following the existing
per-chapter folder boundaries above — not a generic "helpers" grab bag.

## 4. Component Boundaries

Each chapter folder owns:
- Its own presentational components
- A container component that wires chapter state to `lib/` services
- Its own local motion timeline hook (e.g. `useGatewayTimeline.ts`), never a shared "God" GSAP
  file

Chapters communicate only through explicit state domains (§5) or props — never by reaching into
another chapter's internals.

## 5. State Domains

Per the brief, state must be organized by domain, not scattered `useState` calls:

| Domain | Scope | Mechanism (Phase 1 default) |
|---|---|---|
| Navigation (scroll progress, active chapter, mobile menu open) | Global | Context + local state |
| Guide Me selection | Cross-chapter (Guide Me → Meditation Hall) | Context (promote to Zustand only if needed) |
| Meditation configuration (duration, category, pattern) | Cross-chapter | Same context as above |
| Meditation timer (running/paused/remaining/phase) | Local to Meditation Hall | Local state + `useRef` for interval/RAF |
| Ritual state (Temple Mode: which ritual is active) | Local to Temple Mode | Local state |
| Sound state (playing environment, volume) | Local to Sound Sanctuary, but must survive Temple Mode open/close | Context scoped to the "immersive experience" boundary |
| Journal draft/entries | Local + persisted | Local state + `lib/storage` |
| Intention draft/entries | Local + persisted | Local state + `lib/storage` |
| Sanctuary preview (logged-out vs. preview state) | Global (auth-adjacent) | Context, backed by a stub auth state in Phase 1–7 |

`components/motion/` primitives (`ScrollScene`, `TextReveal`, `ParallaxLayer`,
`ReducedMotion`) are Phase 1 deliverables — thin, reusable wrappers around the GSAP/Framer
ownership rules defined in `MOTION-SPEC.md`, so no chapter invents its own timeline plumbing.

## 6. Storage Abstraction

Per the brief's privacy direction, presentation components never call `localStorage` directly.

```
lib/storage/
├── index.ts            # exports the active repository implementation
├── types.ts             # JournalRepository, IntentionRepository interfaces
└── localStorageRepo.ts  # Phase 1–7 implementation
```

Example shape:
```ts
interface JournalRepository {
  list(): JournalEntry[];
  save(entry: JournalEntryDraft): JournalEntry;
}
```

A future `supabaseJournalRepo.ts` implements the same interface; swapping `lib/storage/index.ts`'s
export is the only change required. This satisfies the brief's requirement that production
storage can replace `localStorage` without touching presentation components.

## 7. Media Handling

- `next/image` for all raster hero/chapter imagery, with AVIF → WebP → JPEG fallback sources.
- Hero image: `priority` loading only for the above-the-fold asset actually visible at paint time.
- Everything below the fold: default lazy loading; expensive chapters (Temple Mode, Meditation
  Hall, Sound Sanctuary) are dynamically imported (`next/dynamic`) so their JS doesn't ship on
  initial load.
- No base64 images inlined in CSS.

## 8. What Phase 1 Actually Touches

Phase 1 creates: `styles/` tokens, `app/layout.tsx` + `app/page.tsx` shell, `components/ui/`
(Button, basic Chip/Field primitives used by later phases), `components/navigation/` (desktop +
mobile), `components/motion/` primitives (empty-scene-safe, no hero content yet), and the
`lib/motion` matchMedia/easing helpers. It does **not** touch `components/gateway/` or any hero
imagery — that's Phase 2, gated on real asset delivery per `ASSET-PLAN.md`.

## 9. Deferred Product Surfaces (from the official V4 brief, §44–53)

The supplied `01_SPIRIT_GUIDE_V4_MASTER_BRIEF.md` describes several surfaces beyond the front-end
prototype scope of Phases 1–10 (`IMPLEMENTATION-PLAN.md`). Recording them here so they aren't lost,
without designing them prematurely:

- **CMS + admin dashboard** (§45–46): separate, private admin UI (Dashboard, Meditations, Wisdom,
  Audio, Users, Supporters, Content, Analytics) for Owner/Editor/Content Manager roles. Entirely
  out of scope until Phase 11+ (backend) is approved — not a route inside the public sanctuary app.
- **Meditation content model** (§47): title, slug, description, duration, category, difficulty,
  audio file, narrator, background sound, transcript, image, benefits, tags, published status.
  This is the eventual shape of the `meditations` table in `ARCHITECTURE.md`/backend scope; the
  Phase 5 front-end only needs duration/category/pattern (see §5 State Domains) since real audio
  content doesn't exist yet.
- **Audio system** (§48): full guided-audio player (play/pause/seek/volume/elapsed/remaining,
  narrator, background ambience, guided/silent toggle) — beyond Phase 5's ambient Sound Sanctuary
  loops. Deferred until real narrated audio content exists.
- **Search** (§49): title/topic/duration/mood search with duration-bucket filters, for Meditation
  and Wisdom libraries once they have enough real content to search.
- **Membership concept** (§30): "Sanctuary Member" tier (full library, cross-device journal sync,
  premium soundscapes, offline audio, live events). Strictly later than Phase 10 (Support the
  Sanctuary in Phase 8 is one-time offerings only, no subscription UI, no fake payment flows).
- **PWA capability** (§53): Add to Home Screen, offline shell, push reminders. Brief itself says
  "I would not put this ahead of core quality" — treat as post-launch.
- **Cursor effects** (§34): an extremely subtle champagne-ring pointer enhancement over immersive
  areas only (never over buttons, which keep the standard pointer). Candidate for Temple Mode
  polish in Phase 4, not Phase 1 — noted here so it isn't forgotten, not scheduled yet.

## 10. Reconciliation with Phase 1 (already implemented)

Phase 1 (tokens, typography, navigation, motion primitives) was implemented and gated (typecheck/
lint/tests/build/responsive/keyboard/reduced-motion, all passing) before this official handoff
pack arrived, using a chat-reconstructed version of the V4 brief. Cross-checking that
implementation against the now-supplied `01_SPIRIT_GUIDE_V4_MASTER_BRIEF.md` and
`02_V5_MASTER_BUILD_DIRECTIVE.md`:

- Colors, typography scale, spacing scale, motion-ownership rules, and the 7-chapter grouping all
  match exactly — the official brief confirms rather than contradicts what shipped.
- Nav items (Temple/Meditate/Wisdom/Rituals/Journal/My Sanctuary + Enter Temple CTA), mobile
  full-height panel behavior, and the scroll-driven glass nav all match §5 of the official brief.
- **One real gap found:** the official brief's §62 radius system (buttons 999px pill or 14–18px,
  cards 20–28px, large environments 28–36px, inputs 14–18px) is larger and more deliberate than
  the generic 4/8/16px scale Phase 1 shipped with. `Button.tsx` and `Container.tsx` use an 8px
  Tailwind default that predates this. Corrected token values now live in `DESIGN-SYSTEM.md` §4;
  applying them to the two components is a small, contained fast-follow, not a rebuild.
- No other rework identified — colors, spacing, motion, and nav all still match.
