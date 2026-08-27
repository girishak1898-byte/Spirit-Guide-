# ARCHITECTURE.md — Spirit Guide V5

Companion to `SPIRIT-GUIDE-V4.md` (product source of truth), `DESIGN-SYSTEM.md`,
`MOTION-SPEC.md`, `ASSET-PLAN.md`, `IMPLEMENTATION-PLAN.md`. This document covers technology
choices, directory structure, component boundaries, state domains, and the storage abstraction.

## 1. Current Repository State

As of Phase 0, the repository contains **no application code** — no `package.json`, no framework
scaffold, no source files, no assets. This is a greenfield build. There is nothing to "retain" —
Phase 1 creates the foundation from scratch.

## 2. Technology Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router) + React + TypeScript | Required by brief; supports Image optimization, routing per chapter, code splitting, RSC for static content |
| Scroll choreography | GSAP + ScrollTrigger | Required by brief for pinning/scrubbing/masking |
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
