# START HERE — Spirit Guide Handoff

Read this file first, before anything else in this repo.

## PROJECT STATUS

- Spirit Guide V4/V5 frontend — Phases 1-8 complete.
- **FINAL FREEZE COMMIT: `0ff041b`**
- Phase 8 final acceptance: PASS (nav, mobile Handoff composition, full
  integration QA, performance all verified — see §3 below).
- Treat the current product as a **frozen baseline**. Default to not
  touching it; see FROZEN-PHASE RULE.

## SESSION START RULE

1. Read this file (`START_HERE.md`) first.
2. Read root `CLAUDE.md`.
3. Read only the docs in `docs/` directly relevant to the requested task —
   not all ten.
4. Inspect only the components actually involved in the task.
5. Never reconstruct phase-by-phase history unless the task specifically
   requires it (e.g. "why does X work this way").

## FROZEN-PHASE RULE

Phases 1-8 must **not** be reopened for speculative polish. Modify frozen
code only for:
- a proven regression
- an accessibility defect
- a security/privacy defect
- a production failure
- an explicitly user-approved new feature that integrates with it

If none of these apply, don't touch it — even if it looks improvable.

## ARCHITECTURE MAP

**Gateway** (`components/gateway/`, `useGatewayTimeline.ts`) — canonical
Phase-2 cinematic hero. GSAP/ScrollTrigger-owned scroll choreography.

**Temple Mode** — `TempleModeProvider` + `TempleModeOverlay`. Single
canonical `openTemple()` / `closeTemple()` API; mounted once.

**Meditation Hall** — `MeditationHallProvider` + `MeditationHallOverlay` +
`useMeditationTimer`. Single canonical `openMeditation()` /
`closeMeditation()` API; mounted once.

**Guide Me** — `components/guide/`, `lib/guide/moodConfig.ts`, typed
`MeditationHandoff` into Meditation Hall (preselects duration).

**Reflect** — Wisdom, Lotus, Intention, Journal.

**Storage** — `lib/storage/localStorageService.ts`. SSR-safe, versioned,
corruption-safe. Components never touch `localStorage` directly.

**Journal graph** — `lib/journal/journalGraph.ts`. Real-data-only
relationships; never fabricates semantic edges.

**Belong/Return** — My Sanctuary, Support, Closing, Footer.

**Focus/modal** — `hooks/useFocusTrap.ts` is the one shared modal
accessibility mechanism; every overlay uses it.

## QA MAP

`scripts/`: `phase2-qa.mjs` … `phase7-qa.mjs`, `phase8-integration-qa.mjs`
(one continuous session across every subsystem — catches state leaks the
per-phase scripts can't see).

**Do not automatically run every historical suite for small isolated
work.** Run:
- the affected phase's QA script during development
- dependent regression scripts when a change crosses phase boundaries
- the complete regression battery only for release/freeze work

Core baseline at freeze (`0ff041b`): typecheck PASS · lint PASS ·
tests 11/11 PASS · build PASS · Phase 2-7 QA PASS · Phase 8 integration
QA PASS.

## PERFORMANCE STATE AT FREEZE

Production build, local/lab conditions (not field data):
- LCP ≈ 176-180ms
- CLS = 0.0000
- TBT ≈ 0ms, 0 long tasks observed
- INP: **not measured** — real INP needs field interaction data; never
  mislabel lab click timing or TBT as INP.
- First Load JS for `/`: 204 kB

## FIXES ALREADY MADE — do not reintroduce

- Obsolete "Rituals" development stub removed from the homepage assembly.
- Nav's "Rituals" link now targets the canonical Ritual Discovery section
  (`#sanctuary-highlights`), not the removed stub anchor.
- Temple Preview and Closing sections' reused sanctuary image: visibility/
  darkness corrected (was reading muddier than the Phase-2 hero).
- `GlobalNav` 1024-1279px item spacing corrected (was crowded, not
  overflowing).
- Mobile Gateway "Nothing to achieve." (Handoff statement, in
  `GatewayStillness.tsx` — **not** `TempleModeOverlay`) moved off the
  Buddha's face/torso on mobile only; desktop/tablet composition is
  unchanged.

## DEFERRED / NON-BLOCKING — do not fabricate to fill these

- Level-2 hero separated-depth planes.
- Dedicated scene artwork for later visual upgrades (current sections
  reuse the Phase-2 hero by design).
- Ritual object artwork (Temple Mode currently uses text labels only).
- Approved audio / Sound Sanctuary assets (no audio ships today —
  correct, not a bug).
- Real auth, real payments, session persistence/history.
- Tagging/linking UI for the journal graph.
- Hero `fetchPriority` supplementary optimization.
- Unused hero-image derivatives cleanup (6 generated sizes in
  `public/assets/hero/` aren't referenced by app code).

None of these are launch blockers. Missing assets must never be
fabricated or replaced with stock/AI imagery — see root `CLAUDE.md`.

## PRODUCT INTEGRITY RULES

Preserve on every change:
- No fake statistics. No invented Buddha quotations.
- No fake auth. No fake payment success. No clickable no-op controls.
- No autoplay audio.
- No fabricated journal-graph relationships.
- Private journal/intention content is never logged or transmitted.
- Components never access `localStorage` directly — go through
  `lib/storage/localStorageService.ts`.
- Reduced motion stays fully usable (full experience, not a stripped one).
- Focus trap/restoration stays correct on every modal.
- Temple Mode and Meditation Hall each stay mounted exactly once; reuse
  their existing provider APIs — don't add a second instance or a
  parallel API.

## TOKEN CONSERVATION RULES

- Don't reread every project document — read only what the task needs.
- Don't narrate routine repository exploration.
- Don't repeat already-established architecture back in responses; this
  file already states it.
- Don't rerun green QA unnecessarily (see QA MAP above).
- Use targeted searches (grep for the symbol/string) before broad reads.
- Report concise evidence and results, not process narration.
- Preserve known-good frozen systems — investigate root cause before
  patching, and prefer the smallest change that fixes it.
