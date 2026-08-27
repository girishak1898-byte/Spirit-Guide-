# IMPLEMENTATION-PLAN.md — Spirit Guide V5

Phased build. Each phase: **PLAN → IMPLEMENT → TYPECHECK → LINT → TEST → BUILD → VISUAL QA →
RESPONSIVE QA → ACCESSIBILITY QA → REPORT → STOP.** No phase is reported complete because it
merely compiles — every gate must actually pass, or the phase is reported as not-yet-complete
with specifics.

## Required Reading Status (per the official `CLAUDE.md`)

`CLAUDE.md` requires reading, in order: `00_READ_ME_FIRST.md`, `01_SPIRIT_GUIDE_V4_MASTER_BRIEF.md`,
`02_V5_MASTER_BUILD_DIRECTIVE.md`, `03_VISUAL_BIBLE.md`, `04_HERO_MOTION_STORYBOARD.md`,
`05_ASSET_PLAN.md`, `06_PHASE_GATES_AND_PROMPTS.md`, `07_QA_ACCEPTANCE_CRITERIA.md`,
`08_CONTENT_COPY_DECK.md`, `10_ARCHITECTURE_CONSTRAINTS.md` (and `09_IMAGE_GENERATION_PROMPTS.md`
per `00_READ_ME_FIRST.md`). **Only 00, 01, and 02 were actually supplied and read.** Documents 03
through 10 are referenced but were not included in the upload — this plan proceeds on 00–02 plus
this project's own prior Phase 0/1 work, and flags every place a missing document's content would
plausibly change a decision (see the risk list in the Phase 0 report). In particular
`06_PHASE_GATES_AND_PROMPTS.md` is the document the V5 Build Directive names as authoritative for
phase boundaries ("Follow the phase boundaries in `06_PHASE_GATES_AND_PROMPTS.md`") — since it's
missing, this file's own phase breakdown (below) continues to serve as the working plan; it should
be reconciled against `06` once supplied, per the cross-check in the section below.

## Phase 0 — Inspection & Planning (this phase)

Read the brief, inspect the (empty) repository, produce this document plus `ARCHITECTURE.md`,
`DESIGN-SYSTEM.md`, `MOTION-SPEC.md`, `ASSET-PLAN.md`. No application code. Self-review against
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

## Phase 2 — Temple Gateway

Scope: hero, image handling (Level 1 single image per `ASSET-PLAN.md`), navigation scroll
behavior (transparent → glass), hero intro timeline, ambient effects, the signature Temple
Gateway scroll transition per `MOTION-SPEC.md` §6. No later sections. **Gated on real hero asset
delivery** (see `ASSET-PLAN.md` §5).

Gate: all of Phase 1's gate, plus GSAP ScrollTrigger cleanup verified (no accumulating triggers
across re-renders/route changes), reduced-motion fallback verified against the strategy in
`MOTION-SPEC.md` §7, Buddha framing checked at all 7 breakpoints, no horizontal overflow, scroll
feels responsive (not over-smoothed/laggy).

## Phase 3 — Sanctuary Storytelling

Scope: Sanctuary Highlights, Ritual Actions, Guide Me, Temple preview link. Gate adds: touch
interaction verified, Guide Me → Meditation Hall state handoff verified (state exists even though
Meditation Hall itself isn't built yet — target a stub route/log).

## Phase 4 — Temple Mode

Scope: immersive Temple Mode — open/close, ritual dock, candle/bell/incense/lotus/reflection
interactions, sound-toggle architecture (not full Sound Sanctuary yet). Gate adds: focus trap
while Temple Mode is open, Escape/Close both work, Buddha never obstructed at any breakpoint,
audio never autoplays.

## Phase 5 — Meditation + Sound

Scope: Meditation Hall, breathing mandala, duration selection, timer (start/pause/resume/finish/
reset), Sound Sanctuary. Gate adds: timer accuracy under tab-visibility changes (backgrounded tab
must not drift), audio cleanup on unmount/navigation (no orphaned playback), reduced-motion
breathing state fully usable from text alone.

## Phase 6 — Reflection

Scope: Daily Wisdom, Lotus Garden, Intention Sanctuary, Private Journal. `lib/storage` built here
(first real caller). Gate adds: reload persistence verified for journal/intention, attribution
rules verified in content (no invented Buddha quotes), character-limit enforcement on Intention
(180 chars).

## Phase 7 — My Sanctuary

Scope: logged-out + local-preview states only. No real auth. Gate adds: verify no fake statistics
anywhere, verify object-based (not dashboard-KPI) presentation.

## Phase 8 — Closing + Support

Scope: Support section presentation (no payment logic), closing cinematic scene, footer, legal
nav placeholders.

## Phase 9 — Responsive + Performance Pass

Dedicated pass across all 7 breakpoints for every shipped chapter — not just fixing obvious CSS
breakage. Optimize image sources, scroll timeline/pin lengths, font sizing, spacing, touch
targets, GPU cost, mobile layering. Measure against LCP/CLS/INP targets from
`01_SPIRIT_GUIDE_V4_MASTER_BRIEF.md` §41 (Performance).

## Phase 10 — Accessibility + QA

Full keyboard nav, focus management, screen-reader labels, reduced motion, audio controls, and
every interactive chapter (nav, Temple Mode, rituals, Guide Me, meditation, sound, journal,
intention, My Sanctuary, footer) tested across Chrome/Safari/Edge desktop + Safari iPhone +
Chrome Android + tablet.

## Phase 11 — Backend (official brief's Phase 6, §68)

Not started until the front-end prototype (Phases 1–10) is approved. Supabase-based: auth,
journal_entries, intentions, wisdom_content, etc. per `01_SPIRIT_GUIDE_V4_MASTER_BRIEF.md` §44
(Backend architecture), plus the CMS/admin dashboard in §45–46 (see `ARCHITECTURE.md` §9).
Payments (Stripe) are the official brief's separate Phase 7 (§68, "Monetisation") — a distinct,
later sub-phase requiring separate explicit approval, never bundled with backend rollout.

## Cross-Check Against the Official Brief's Own Phase Sequence (§68) and Quality Bar (§69)

The official brief's own high-level sequence is: 1 Design system, 2 Cinematic environments
(Hero/Temple Mode/Meditation Hall/Lotus Garden), 3 Core interactions (rituals/breathing/timer/
audio), 4 Personal tools (Guide Me/Wisdom/Journal/Intentions/My Sanctuary), 5 Responsive polish,
6 Backend, 7 Monetisation, 8 Launch QA. This plan's Phases 1–11 above are a finer-grained
decomposition of the same sequence (one phase per chapter instead of one phase per group of
chapters, each with its own explicit STOP gate) — every official phase maps onto a contiguous
range here (official Phase 2 ≈ this plan's Phases 2, 4 [Temple Mode], 5 [Meditation Hall], and the
Lotus Garden portion of Phase 6; official Phase 5 ≈ this plan's Phase 9; etc.). No content is
dropped, nothing here contradicts §68 — it's a stricter subdivision with more approval
checkpoints, which fits the brief's own §67 "Visual approval process" (Stage 1 visual system,
Stage 2 core sanctuary, Stage 3 personal experience, Stage 4 responsive) more precisely than the
brief's own rougher phase list does. Should `06_PHASE_GATES_AND_PROMPTS.md` arrive with a
different intended breakdown, reconcile against it directly — it is the more authoritative source
per the V5 Build Directive.

The brief's §69 quality-bar table (art direction 95, colour 95, typography 92, hero 95, Temple
Mode 95, meditation UX 92, mobile 90+, interaction 90+, performance 90+, accessibility 90+,
overall 90–95) is adopted as-is as the acceptance bar for Phase 9/10's visual and QA gates —
no reason to diverge from an explicit, numeric target the brief already sets.

## Quality Gate Checklist (every phase)

TypeScript check · lint · automated tests where relevant · production build · browser console
clean · no hydration warnings · no horizontal overflow · no broken/missing assets · no missing alt
text · full keyboard flow · reduced motion verified · mobile verified · scroll restoration
verified · resize behavior verified · GSAP context/ScrollTrigger cleanup verified · audio cleanup
verified (once audio exists) · memory/perf spot-check where relevant. Any failure blocks marking
the phase complete — fix and rerun, don't downgrade the bar.

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

**Mobile-first-class:** `ASSET-PLAN.md` §3 requires separate art direction per breakpoint, not a
crop-down; `MOTION-SPEC.md` §8 requires separate matchMedia branches, not scaled-down desktop
timelines. **PASS.**

**Premature complexity check:** Zustand, Lenis, and any storage implementation are explicitly
deferred until a real caller exists in a later phase (see `ARCHITECTURE.md` §2, this file's Phase
1 note). **PASS — corrected during drafting:** the original draft of this file listed
`lib/storage` as a Phase 1 deliverable; that was premature (no Phase 1 component reads or writes
persisted data) and has been moved to Phase 6, its actual first caller.

**Gap found and flagged (not silently corrected):** there is no real hero asset in the repository,
and the Level-1 hero image is a hard prerequisite for Phase 2. This is called out in
`ASSET-PLAN.md` §5 as a decision point for you, not something Phase 0 can resolve on its own.

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
disagree; treating this as unresolved, not as delivered. See `ASSET-PLAN.md` §1.

**Gap found and flagged, not resolved:** `CLAUDE.md`'s required-reading list names 10 documents;
only 3 were supplied. Missing: `03_VISUAL_BIBLE.md`, `04_HERO_MOTION_STORYBOARD.md`,
`05_ASSET_PLAN.md`, `06_PHASE_GATES_AND_PROMPTS.md`, `07_QA_ACCEPTANCE_CRITERIA.md`,
`08_CONTENT_COPY_DECK.md`, `10_ARCHITECTURE_CONSTRAINTS.md` (plus `09_IMAGE_GENERATION_PROMPTS.md`
referenced by `00_READ_ME_FIRST.md`). This plan continues to serve in place of the still-missing
`06_PHASE_GATES_AND_PROMPTS.md`; the others most likely refine detail this project's own
`DESIGN-SYSTEM.md`/`MOTION-SPEC.md`/`ASSET-PLAN.md` already cover from the earlier build
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
