"use client";

import { useLayoutEffect } from "react";
import { gsap, registerGsap } from "@/lib/motion/gsapConfig";
import type { GatewayRefs } from "@/lib/motion/gatewayRefs";

/**
 * The Temple Gateway's single master GSAP timeline — the one thing that
 * owns scroll choreography for this scene, per docs/MOTION-SPEC.md §1.
 * Implements the 10-stage storyboard from docs/04_HERO_MOTION_STORYBOARD.md
 * / docs/MOTION-SPEC.md §6, scrubbed against a single ScrollTrigger spanning
 * the outer section's full scroll distance (progress 0→1 maps directly to
 * timeline position 0→1).
 *
 * Desktop/tablet/mobile get independent gsap.matchMedia() branches — not
 * one timeline played at different sizes — per docs/MOTION-SPEC.md §8.
 * Only rendered when NOT reduced-motion (see TempleGatewayScene /
 * TempleGatewayStatic); this hook has no reduced-motion branch of its own.
 */
export function useGatewayTimeline(refs: GatewayRefs) {
  useLayoutEffect(() => {
    registerGsap();

    const ctx = gsap.context(() => {
      const nav = document.querySelector<HTMLElement>("[data-gateway-nav]");
      const headlineLines = refs.headlineRef.current
        ? gsap.utils.selector(refs.headlineRef.current)(".gateway-headline-line")
        : [];
      const ritualItems = refs.dockRef.current
        ? gsap.utils.selector(refs.dockRef.current)(".gateway-ritual-item")
        : [];
      const ritualShell = refs.dockRef.current
        ? gsap.utils.selector(refs.dockRef.current)(".gateway-ritual-shell")
        : [];

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          isTablet: "(min-width: 768px) and (max-width: 1023px)",
          // Required even though its value is never read: GSAP's matchMedia
          // only invokes this callback when at least one listed query
          // currently matches (see MatchMedia.add in gsap-core.js — `active`
          // stays falsy otherwise). Without this, the whole timeline below
          // silently never builds on mobile viewports, since neither
          // isDesktop nor isTablet ever matches there.
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const { isDesktop, isTablet } = context.conditions as {
            isDesktop: boolean;
            isTablet: boolean;
          };

          // Per docs/MOTION-SPEC.md §8: mobile gets the smallest scale range,
          // no blur, and skips the illumination overlay to cut concurrent
          // animated layers. Tablet is a genuine midpoint, not desktop scaled down.
          const scaleEnd = isDesktop ? 1.2 : isTablet ? 1.12 : 1.06;
          const crossingBlur = isDesktop ? 5 : isTablet ? 3 : 0;
          const useIllumination = isDesktop || isTablet;

          // Scale is expressed as a fraction of each breakpoint's own growth
          // range (1.00 → scaleEnd), not as absolute per-stage values. This
          // guarantees the sequence is monotonically increasing at every
          // breakpoint — picking flat absolute numbers per stage previously
          // produced a visible "un-zoom" on tablet/mobile where a later
          // stage's target was lower than an earlier one's.
          const scaleAt = (fraction: number) => 1 + (scaleEnd - 1) * fraction;

          const tl = gsap.timeline({
            defaults: { ease: "power2.inOut" },
            scrollTrigger: {
              trigger: refs.outerRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
            },
          });

          // Every stage boundary this storyboard uses. `to()` below sizes each
          // tween's duration to the gap before the *next* boundary by default,
          // so consecutive tweens on the same property (artworkLayerRef's
          // scale/y in particular, animated at nearly every stage) never
          // overlap. Without this, GSAP's default 0.5-unit tween duration is
          // larger than the ~0.07-0.15 gaps between stages here, so several
          // tweens on the same property would run concurrently and fight —
          // this previously produced a visible non-monotonic "un-zoom" partway
          // through the sequence.
          const STAGE_POSITIONS = [0.08, 0.15, 0.25, 0.38, 0.5, 0.65, 0.78, 0.88, 0.95, 1.0];
          const gapAfter = (position: number) => {
            const index = STAGE_POSITIONS.indexOf(position);
            if (index === -1 || index === STAGE_POSITIONS.length - 1) return 0.05;
            return STAGE_POSITIONS[index + 1]! - position;
          };

          const to = (target: Element | Element[] | null, vars: gsap.TweenVars, position: number) => {
            if (!target || (Array.isArray(target) && target.length === 0)) return;
            tl.to(target, { duration: gapAfter(position), ...vars }, position);
          };

          // 0.08 — Arrival: explicit rest state (baseline the stages below animate from).
          to(refs.artworkLayerRef.current, { scale: scaleAt(0), y: "0%" }, 0.08);

          // 0.15–0.25 — Invitation
          to(refs.supportingRef.current, { opacity: 0.4 }, 0.15);
          to(refs.spiritualNoteRef.current, { opacity: 0.4 }, 0.15);
          to(refs.secondaryCtaRef.current, { opacity: 0 }, 0.15);
          to(refs.artworkLayerRef.current, { scale: scaleAt(0.125) }, 0.15);
          to(refs.vignetteRef.current, { opacity: 0.12 }, 0.15);

          // 0.25–0.38 — Focus. "Primary statement remains" per the storyboard —
          // everything else, including the supporting paragraph and spiritual
          // note parked at 0.4 opacity since Invitation, must fully clear by
          // here so Pure Sanctuary (0.65+) genuinely has no marketing copy on
          // screen. Previously these two were never taken past 0.4, leaving
          // ghostly lingering text through Pure Sanctuary and the Handoff
          // statement — a real gap the real hero asset's visual QA exposed.
          to(refs.eyebrowRef.current, { opacity: 0 }, 0.25);
          to(refs.supportingRef.current, { opacity: 0 }, 0.25);
          to(refs.spiritualNoteRef.current, { opacity: 0 }, 0.25);
          to(refs.artworkLayerRef.current, { scale: scaleAt(0.225) }, 0.25);
          to(refs.illuminationRef.current, { opacity: useIllumination ? 0.05 : 0 }, 0.25);

          // 0.38–0.50 — Crossing
          to(headlineLines, { opacity: 0, y: -24, filter: `blur(${crossingBlur}px)`, stagger: 0.02 }, 0.38);
          to(refs.primaryCtaRef.current, { opacity: 0 }, 0.38);
          to(refs.artworkLayerRef.current, { scale: scaleAt(0.4) }, 0.38);

          // 0.50–0.65 — Leaving the Website. Buddha stays visually locked (see
          // GatewayArtwork's transform-origin) while the environment scales
          // around it — never a "zoom the subject at the viewer" effect.
          to(nav, { opacity: 0.05 }, 0.5);
          to(refs.artworkLayerRef.current, { scale: scaleAt(0.65), y: "-1%" }, 0.5);
          to(refs.vignetteRef.current, { opacity: 0.22 }, 0.5);
          to(refs.illuminationRef.current, { opacity: useIllumination ? 0.09 : 0 }, 0.5);

          // 0.65–0.78 — Pure Sanctuary: no new elements, movement slows rather
          // than intensifies. A deliberate, meaningful period of visual silence.
          to(refs.artworkLayerRef.current, { scale: scaleAt(0.82), y: "-2%" }, 0.65);
          to(refs.vignetteRef.current, { opacity: 0.28 }, 0.65);

          // 0.78–0.88 — Temple Identity
          to(refs.templeEyebrowRef.current, { opacity: 1 }, 0.78);
          to(refs.artworkLayerRef.current, { scale: scaleAt(1), y: "-2.5%" }, 0.78);
          to(refs.vignetteRef.current, { opacity: 0.32 }, 0.78);

          // 0.88–0.95 — Stillness Statement
          to(refs.statementRef.current, { opacity: 1, y: 0 }, 0.88);

          // 0.95–1.00 — Handoff. End-state should visually match Temple Mode's
          // own opening state — no black gap, no unrelated scene load.
          to(ritualShell, { opacity: 1 }, 0.95);
          to(ritualItems, { opacity: 1, stagger: 0.03 }, 0.95);
        },
      );
    });

    return () => ctx.revert();
  }, [refs]);
}
