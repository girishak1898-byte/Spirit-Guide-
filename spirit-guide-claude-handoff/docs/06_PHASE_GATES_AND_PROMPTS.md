# Spirit Guide V5 — Phase Gates and Claude Prompts

## Phase 0 — Planning only
Prompt:

> Read `CLAUDE.md` and every required project document. Inspect the entire repository and supplied assets. Perform Phase 0 only. Do not modify application code. Produce `docs/ARCHITECTURE.md`, `docs/DESIGN-SYSTEM.md`, `docs/MOTION-SPEC.md`, `docs/ASSET-PLAN-IMPLEMENTATION.md`, and `docs/IMPLEMENTATION-PLAN.md`. Report current state, proposed architecture, asset gaps, responsive strategy, top ten technical risks, top ten visual risks, recommended dependencies, rejected dependencies and exact Phase-1 scope. Then stop for approval.

## Phase 0 self-review
> Self-review Phase 0 against the V4 master brief, Midnight Sanctuary visual bible, motion ownership rules, mobile-first-class requirement, accessibility and performance targets. Find contradictions, omissions, unnecessary complexity, performance risks, animation ownership conflicts, asset gaps and accessibility issues. Correct documentation only. Return PASS or NEEDS REVISION. Do not code.

## Phase 1 — Foundation
> Phase 0 approved. Implement Phase 1 only: design tokens, global typography, layout/container system, navigation, responsive navigation, core controls and motion infrastructure. Before editing, list expected files. After implementation run typecheck, lint, relevant tests and production build. Check responsive and accessibility basics. Fix failures and re-run. Do not begin Phase 2.

## Hero asset verification gate
> The Level-1 Temple Gateway hero asset is supplied in `public/assets/hero/`. Before implementing Phase 2, verify exact file path, dimensions, format, absence of baked UI/text, composition, Buddha crop and left copy safe zone. Report ASSET FOUND, DIMENSIONS, FORMAT, COMPOSITION PASS, BUDDHA CROP PASS, LEFT COPY SAFE-ZONE PASS and PHASE 2 READY. Do not modify code. Stop.

## Phase 2 — Temple Gateway
> Asset gate approved. Implement Phase 2 — Temple Gateway only. Use the Level-1 single-image version first. Do not implement Level-2 depth layers, Three.js, WebGL, frame sequences or later chapters. Follow all approved architecture/design/motion docs plus `04_HERO_MOTION_STORYBOARD.md`. Validate 390, 430, 768, 1024, 1280, 1440 and 1728+ widths, reduced motion, keyboard navigation, resize behaviour, ScrollTrigger cleanup, horizontal overflow, image crop, LCP implications, console and production build. The phase fails if the Buddha is awkwardly cropped, copy competes with the art, mobile is compressed desktop, scrolling feels hijacked, the Buddha appears to zoom toward the viewer, motion is decorative, reduced-motion breaks or console/hydration errors remain. Stop after Phase 2.

## Phase 3 — Discover
Inside the Sanctuary highlights, Guide Me and ritual discovery only. Validate state handoff into Meditation configuration. Stop.

## Phase 4 — Temple Mode
Immersive Temple Mode, open/close, ritual dock, candle, bell, incense, lotus, reflection, sound-toggle architecture. No autoplay. Stop.

## Phase 5 — Breathe
Meditation Hall, breathing mandala, duration selection, accurate timer, pause/resume/completion/reset, Sound Sanctuary and audio lifecycle. Stop.

## Phase 6 — Reflect
Daily Wisdom, Lotus Garden, Intention Sanctuary, Private Journal. Use encapsulated localStorage prototype persistence. Stop.

## Phase 7 — Belong/Return
My Sanctuary prototype states, Support presentation, closing scene and footer. No fake payment processing. Stop.

## Phase 8 — Dedicated polish
Responsive art direction, accessibility and performance optimisation across the whole front end. Stop.

## Phase 9+ — Backend only after explicit approval
Authentication, secure persistence, CMS and later monetisation are separate approval gates.
