# IMPLEMENTATION-PLAN.md — Spirit Guide V5

Phased build. Each phase: **PLAN → IMPLEMENT → TYPECHECK → LINT → TEST → BUILD → VISUAL QA →
RESPONSIVE QA → ACCESSIBILITY QA → REPORT → STOP.** No phase is reported complete because it
merely compiles — every gate must actually pass, or the phase is reported as not-yet-complete
with specifics.

## Required Reading Status (per the official `CLAUDE.md`)

`CLAUDE.md` requires reading, in order: `00_READ_ME_FIRST.md` through `10_ARCHITECTURE_CONSTRAINTS.md`.
**All 11 documents (00–10) are now supplied and read**, across three handoff messages. The phase
breakdown below has been reconciled against `06_PHASE_GATES_AND_PROMPTS.md` — the document the V5
Build Directive names as authoritative for phase boundaries — and now matches it exactly (see the
former "Cross-Check" section, superseded below). No document content remains unread.

The one thing still not supplied, despite three separate claims that it was: the actual Level-1
hero binary asset. See `ASSET-PLAN-IMPLEMENTATION.md` §1 for the formal Hero Asset Verification
Gate result (FAIL — asset not found).

## Phase 0 — Inspection & Planning (this phase)

Read the brief, inspect the (empty) repository, produce this document plus `ARCHITECTURE.md`,
`DESIGN-SYSTEM.md`, `MOTION-SPEC.md`, `ASSET-PLAN-IMPLEMENTATION.md`. No application code. Self-review against
the brief before presenting for approval (see bottom of this file).

## Phase 1 — Foundation

Scope: design tokens, global typography, layout/container system, buttons, navigation (desktop +
mobile), basic motion primitives (empty-scene-safe wrappers, no hero content). No hero, no
chapter content beyond a minimal placeholder shell so navigation/layout is verifiable.

Deliverables: `styles/tokens.css`, `app/layout.tsx`, `app/page.tsx` (minimal shell), `components/
ui/*` (Button + a couple of primitives later phases will need), `components/navigation/
GlobalNav.tsx` + `MobileNav.tsx`, `components/motion/*` primitives, `lib/motion/*` (matchMedia +
easing helpers), `lib/storage/*` scaffold (types + localStorage impl, unused until Phase 6 but
built now since it's foundational plumbing... — **actually deferred**: storage is only built when
Journal/Intention need it in Phase 6, to avoid speculative code with no caller. Phase 1 builds
only what Phase 1's own UI needs.)

Gate: typecheck, lint, tests (if any exist yet), production build, console/hydration check,
responsive check at all 7 breakpoints for nav only, keyboard nav through the nav bar, reduced
motion has no effect to verify yet (no motion shipped besides micro-interactions).

## Hero Asset Verification Gate (per `06_PHASE_GATES_AND_PROMPTS.md`, runs before Phase 2)

Verify exact file path, dimensions, format, absence of baked UI/text, composition, Buddha crop,
and left-copy safe zone for the Level-1 hero. **Current result: FAIL — ASSET FOUND: NO.** Full
gate output in `ASSET-PLAN-IMPLEMENTATION.md` §1. Phase 2 does not start until this gate passes.

## Phase 2 — Temple Gateway

Scope: hero, image handling (Level 1 single image per `ASSET-PLAN-IMPLEMENTATION.md` and
`05_ASSET_PLAN.md`), navigation scroll behavior (transparent → glass), hero intro timeline,
ambient effects, the signature Temple Gateway scroll transition per `MOTION-SPEC.md` §6 and the
official `04_HERO_MOTION_STORYBOARD.md`. Level-1 single image only — no Level-2 depth layers,
Three.js, WebGL, or frame sequences (`06_PHASE_GATES_AND_PROMPTS.md` explicitly excludes these
from Phase 2). No later sections. **Gated on the Hero Asset Verification Gate above passing.**

Gate: all of Phase 1's gate, plus every item in `07_QA_ACCEPTANCE_CRITERIA.md`'s Hero visual gate
and Motion gate (one obvious focal point, Buddha fully visible and unobstructed, left-copy zone
readable, gold restrained, camera illusion reads as entering the environment rather than the
Buddha zooming toward the viewer, a meaningful period of visual silence, continuous handoff into
Temple Mode, no bounce/elastic easing, scroll never hijacked, pinning selective, no fighting
transforms), GSAP ScrollTrigger cleanup verified (no accumulating triggers across re-renders/route
changes), reduced-motion fallback verified against `MOTION-SPEC.md` §7, Buddha framing checked at
all 7 breakpoints, no horizontal overflow.

## Phase 3 — Discover

Scope: Sanctuary Highlights, Guide Me, ritual discovery (renamed from this plan's earlier
"Sanctuary Storytelling" to match `06_PHASE_GATES_AND_PROMPTS.md`'s exact phase name — same
scope). Gate adds: touch interaction verified, Guide Me → Meditation configuration state handoff
verified (state exists even though Meditation Hall itself isn't built yet).

## Phase 4 — Temple Mode

Scope: immersive Temple Mode — open/close, ritual dock, candle/bell/incense/lotus/reflection
interactions, sound-toggle architecture (not full Sound Sanctuary yet). No autoplay. Gate adds:
focus trap while Temple Mode is open, Escape/Close both work, Buddha never obstructed at any
breakpoint, audio never autoplays.

## Phase 5 — Breathe

Scope: Meditation Hall, breathing mandala, duration selection, timer (start/pause/resume/finish/
reset), Sound Sanctuary, full audio lifecycle (renamed from "Meditation + Sound" to match
`06_PHASE_GATES_AND_PROMPTS.md` — same scope). Gate adds: timer accuracy under tab-visibility
changes (backgrounded tab must not drift), audio cleanup on unmount/navigation (no orphaned
playback), reduced-motion breathing state fully usable from text alone.

## Phase 6 — Reflect

Scope: Daily Wisdom, Lotus Garden, Intention Sanctuary, Private Journal (renamed from
"Reflection" to match `06_PHASE_GATES_AND_PROMPTS.md` — same scope). `lib/storage` built here
(first real caller), encapsulated per `10_ARCHITECTURE_CONSTRAINTS.md` §Persistence. Gate adds:
reload persistence verified for journal/intention, attribution rules verified in content (no
invented Buddha quotes — copy pulled from `08_CONTENT_COPY_DECK.md`), character-limit enforcement
on Intention (180 chars).

## Phase 7 — Belong/Return

Scope: My Sanctuary (logged-out + local-preview states, no real auth), Support presentation (no
payment logic), closing cinematic scene, footer. **Merged from this plan's earlier separate
Phase 7 (My Sanctuary) and Phase 8 (Closing + Support)** to match `06_PHASE_GATES_AND_PROMPTS.md`,
which groups them as one phase. Gate adds: verify no fake statistics anywhere, verify object-based
(not dashboard-KPI) My Sanctuary presentation, no fake payment processing.

## Phase 8 — Dedicated Polish

Scope: responsive art direction, accessibility, and performance optimization across the entire
front end. **Merged from this plan's earlier separate Phase 9 (Responsive + Performance) and
Phase 10 (Accessibility + QA)** to match `06_PHASE_GATES_AND_PROMPTS.md`. Dedicated pass across
all 7 breakpoints for every shipped chapter — not just fixing obvious CSS breakage: image sources,
scroll timeline/pin lengths, font sizing, spacing, touch targets, GPU cost, mobile layering,
keyboard nav, focus management, screen-reader labels, audio controls, cross-browser (Chrome/
Safari/Edge desktop + Safari iPhone + Chrome Android + tablet). Measure against LCP/CLS/INP
targets from `01_SPIRIT_GUIDE_V4_MASTER_BRIEF.md` §41 and the full `07_QA_ACCEPTANCE_CRITERIA.md`
checklist.

## Phase 9+ — Backend (only after explicit approval)

Not started until the front-end prototype (Phases 1–8) is approved — matches
`06_PHASE_GATES_AND_PROMPTS.md`'s "Phase 9+ — Backend only after explicit approval." Supabase-
based: auth, journal_entries, intentions, wisdom_content, etc. per
`01_SPIRIT_GUIDE_V4_MASTER_BRIEF.md` §44, plus the CMS/admin dashboard in §45–46 (see
`ARCHITECTURE.md` §9). Payments (Stripe) and monetisation are a distinct, later sub-phase
requiring separate explicit approval, never bundled with backend rollout, per
`10_ARCHITECTURE_CONSTRAINTS.md`'s "Future backend" note.

## Adopted Acceptance Bar

`07_QA_ACCEPTANCE_CRITERIA.md`'s target quality — 90+ across mobile, accessibility, performance,
and interaction; 95-level craft for art direction, hero, and Temple Mode — is adopted as-is as the
literal acceptance bar for Phase 8's polish gate, superseding this plan's earlier citation of the
V4 brief's own §69 table (the two are consistent; §07 is the more specific, official source).

## Quality Gate Checklist (every phase)

TypeScript check · lint · automated tests where relevant · production build · browser console
clean · no hydration warnings · no horizontal overflow · no broken/missing assets · no missing alt
text · full keyboard flow · reduced motion verified · mobile verified · scroll restoration
verified · resize behavior verified · GSAP context/ScrollTrigger cleanup verified · audio cleanup
verified (once audio exists) · memory/perf spot-check where relevant. Any failure blocks marking
the phase complete — fix and rerun, don't downgrade the bar. This checklist is this project's own
elaboration of `07_QA_ACCEPTANCE_CRITERIA.md`'s "Engineering gate for every phase" — the two agree;
`07`'s Responsive/Accessibility/Motion/Product gates apply on top of this per-phase as relevant to
what that phase ships (e.g. the Motion gate applies from Phase 2 onward, the Product/content gate
from Phase 6 onward).

## Visual Quality Gate (every major scene, every phase)

One obvious focal point? Does the artwork breathe? Is the Buddha unobstructed (once present)? Is
gold scarce? Is jade scarcer? Does the movement communicate something (would removing it hurt)?
Is there enough stillness? Does it feel like one coherent place? Does it look like generic
AI-generated SaaS UI? Is mobile equally intentional, not just shrunk? Any "no" → iterate before
reporting the phase done.

## Self-Review Protocol (before presenting any phase for approval)

Before reporting a phase complete, check the work against: `01_SPIRIT_GUIDE_V4_MASTER_BRIEF.md` (functional
completeness, content policy, terminology), `DESIGN-SYSTEM.md` (token discipline, gold/jade
scarcity), `MOTION-SPEC.md` (ownership boundaries respected, no bounce/spring easing, reduced
motion works), mobile-first-class requirement (not a shrunk desktop), accessibility requirements,
performance targets. Look specifically for: contradictions between what was built and the spec,
missing requirements, unnecessary complexity/premature abstraction, animation-ownership conflicts
(GSAP and Framer fighting the same property), responsive risk, accessibility omissions, asset
gaps. Report PASS or NEEDS REVISION with reasons — never silently ship a NEEDS REVISION item.

---

## Phase 0 Self-Review (performed now)

**Checked against V4:** all 14 content chapters are represented in the 7-chapter grouping with no
requirement dropped; attribution rules, empty/failure states, and the full reject list carried
forward verbatim. **PASS.**

**Checked against motion ownership rules:** `ARCHITECTURE.md` §5 and `MOTION-SPEC.md` §1 agree —
GSAP owns scroll/pin, Framer owns presence/menus, CSS owns micro-interactions. No conflict found.
**PASS.**

**Mobile-first-class:** `ASSET-PLAN-IMPLEMENTATION.md` §3 requires separate art direction per breakpoint, not a
crop-down; `MOTION-SPEC.md` §8 requires separate matchMedia branches, not scaled-down desktop
timelines. **PASS.**

**Premature complexity check:** Zustand, Lenis, and any storage implementation are explicitly
deferred until a real caller exists in a later phase (see `ARCHITECTURE.md` §2, this file's Phase
1 note). **PASS — corrected during drafting:** the original draft of this file listed
`lib/storage` as a Phase 1 deliverable; that was premature (no Phase 1 component reads or writes
persisted data) and has been moved to Phase 6, its actual first caller.

**Gap found and flagged (not silently corrected):** there is no real hero asset in the repository,
and the Level-1 hero image is a hard prerequisite for Phase 2. This is called out in
`ASSET-PLAN-IMPLEMENTATION.md` §5 as a decision point for you, not something Phase 0 can resolve on its own.

**Gap found and flagged:** no font decision has been made (`DESIGN-SYSTEM.md` §2 uses placeholder
family names). Real serif/sans selection should happen at the start of Phase 1 implementation, not
deferred silently — flagging it here so it isn't missed.

**Result: PASS**, with the two flagged gaps above carried forward as open items rather than
blocking Phase 0 sign-off (neither blocks Phase 1, which has no asset or font-license dependency
beyond picking a system-safe interim font stack).

---

## Phase 0 Self-Review, Pass 2 (official handoff pack reconciliation)

Performed after `CLAUDE.md`, `00_READ_ME_FIRST.md`, `01_SPIRIT_GUIDE_V4_MASTER_BRIEF.md`,
`02_V5_MASTER_BUILD_DIRECTIVE.md`, and `ASSET_STATUS.json` were supplied and copied into the repo.

**Checked the official V4 brief against everything already documented:** colors, typography scale,
spacing scale, the 7-chapter narrative grouping, motion-ownership rules, and nav structure all
match what Phase 0 Pass 1 already produced — no contradiction. **PASS.**

**Gap found and fixed (post-approval fast-follow):** the official brief's §62 radius system
(buttons 999px pill or 14–18px, cards 20–28px, environments 28–36px) was more deliberate than the
4/8/16px scale Phase 1 shipped with. Corrected token values now in `DESIGN-SYSTEM.md` §4, applied
to `styles/tokens.css`, `tailwind.config.ts`, and `Button.tsx`; typecheck/lint/tests/build/
responsive/keyboard/reduced-motion all re-verified passing.

**Gap found and flagged, not resolved:** `ASSET_STATUS.json` claims the Level-1 hero image is
"supplied," but the actual PNG/JPG files were not included in this upload. Manifest and reality
disagree; treating this as unresolved, not as delivered. See `ASSET-PLAN-IMPLEMENTATION.md` §1.

**Gap found and flagged, not resolved:** `CLAUDE.md`'s required-reading list names 10 documents;
only 3 were supplied. Missing: `03_VISUAL_BIBLE.md`, `04_HERO_MOTION_STORYBOARD.md`,
`05_ASSET_PLAN.md`, `06_PHASE_GATES_AND_PROMPTS.md`, `07_QA_ACCEPTANCE_CRITERIA.md`,
`08_CONTENT_COPY_DECK.md`, `10_ARCHITECTURE_CONSTRAINTS.md` (plus `09_IMAGE_GENERATION_PROMPTS.md`
referenced by `00_READ_ME_FIRST.md`). This plan continues to serve in place of the still-missing
`06_PHASE_GATES_AND_PROMPTS.md`; the others most likely refine detail this project's own
`DESIGN-SYSTEM.md`/`MOTION-SPEC.md`/`ASSET-PLAN-IMPLEMENTATION.md` already cover from the earlier build
conversation, but that can't be confirmed without reading them.

**Stale section-number citations corrected:** several cross-references in `DESIGN-SYSTEM.md`,
`MOTION-SPEC.md`, and this file pointed at section numbers from the earlier chat-reconstructed
brief, which don't match the official document's actual numbering. Corrected to cite
`01_SPIRIT_GUIDE_V4_MASTER_BRIEF.md`'s real section numbers (§41 Performance, §44 Backend, §59
Reject list) or, where the earlier conversation supplied detail the official brief doesn't contain
(the second-by-second hero intro timeline; the precise 0–100% Temple Gateway storyboard
percentages), labeled explicitly as this project's own addition rather than misattributed to V4.

**Result: PASS.** The radius fast-follow is now applied and re-verified. The hero-asset gap and
the seven missing documents remain the two open items blocking full confidence — Phase 1 needs no
further changes, and Phase 2 remains blocked on the hero asset exactly as before.

---

## Phase 0 Self-Review, Pass 3 (complete document set, official phase gates)

Performed after all remaining documents (`03`–`10`) arrived, completing the required-reading set,
and after a `PHASE2_UNBLOCK_README.txt` claiming a full unblock package (docs + hero files) turned
out to contain only the README and a duplicate `ASSET_STATUS.json` — the docs arrived separately
and correctly in a later message; the hero files still have not arrived in any form that puts a
file on disk.

**Checked all 8 newly supplied documents against everything already built/documented:**
- `03_VISUAL_BIBLE.md` — colors, typography scale, and card radius (20–28px) match
  `DESIGN-SYSTEM.md` exactly, including the radius correction already applied. **PASS.**
- `04_HERO_MOTION_STORYBOARD.md` — the official percentage-mapped storyboard (0–8% Emergence
  through 95–100% Handoff) matches this project's own derived storyboard in `MOTION-SPEC.md` §6
  almost exactly, same breakpoints, same intent (environment moves, not the Buddha). Relabeled
  `MOTION-SPEC.md`'s stage names to the official ones and cited `04` directly. **PASS, no rework.**
- `05_ASSET_PLAN.md` — confirms the Level-1/Level-2/section-environment/ritual-object structure
  already in `ASSET-PLAN-IMPLEMENTATION.md`, and adds exact filenames (including responsive
  derivatives not previously known) now recorded there. **PASS, extended.**
- `06_PHASE_GATES_AND_PROMPTS.md` — the authoritative phase-boundary document. Found a real
  structural gap: this plan had Phases 1–11 (one phase per chapter); the official document has
  Phases 0–8 plus 9+ (grouping "My Sanctuary" with "Support/closing/footer" as one Phase 7, and
  "Responsive" with "Accessibility/QA" as one Phase 8). **Corrected: phase list restructured to
  match `06` exactly**, including adding the explicit Hero Asset Verification Gate `06` defines
  between Phase 1 and Phase 2, which this project's Phase 0 work had described in prose but never
  named or gated as its own checkpoint.
- `07_QA_ACCEPTANCE_CRITERIA.md` — adopted as the literal acceptance bar (see "Adopted Acceptance
  Bar" above), replacing this plan's earlier citation of the V4 brief's own rougher §69 table.
- `08_CONTENT_COPY_DECK.md` — cross-checked against Phase 1's shipped `app/page.tsx`: the Phase 1
  placeholder shell correctly does **not** use any real hero/chapter copy yet (that's Phase 2+
  scope), so there's nothing to correct. Future phases must pull copy from this file verbatim.
- `09_IMAGE_GENERATION_PROMPTS.md` — forward-looking generation prompts for Phase 4+ assets; no
  action needed until those phases approach.
- `10_ARCHITECTURE_CONSTRAINTS.md` — directory structure, state domains, storage/media/audio/
  performance rules all match `ARCHITECTURE.md` almost exactly (including `lib/audio/`,
  `lib/content/`, `types/`, all already planned). **PASS, no rework.**

**Ran the Hero Asset Verification Gate** (§ new, defined in `06`) for the first time — result FAIL,
full detail in `ASSET-PLAN-IMPLEMENTATION.md` §1. This is now the third time an upload claimed the
hero asset was supplied without an actual file arriving; the report to the user is explicit about
exactly what delivery mechanism is needed (a real file attachment, not a manifest/README/inline
chat image).

**Result: PASS.** All required reading is complete. The phase-boundary structure now exactly
matches the authoritative `06_PHASE_GATES_AND_PROMPTS.md`. The sole remaining blocker for Phase 2
is the hero asset itself.
