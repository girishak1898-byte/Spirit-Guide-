"use client";

import { forwardRef, type ReactNode } from "react";

interface ScrollSceneProps {
  /** Outer scroll distance, e.g. "240vh" for the Temple Gateway sequence. Defaults to a non-pinned single viewport. */
  outerHeight?: string;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}

/**
 * Structural primitive for a pinned scroll scene: an outer tall section plus
 * an inner sticky viewport. It owns no animation itself — per
 * docs/MOTION-SPEC.md §1, the consuming chapter component builds its own
 * gsap.context()-scoped ScrollTrigger timeline targeting the forwarded ref
 * (the outer <section>) and the children within the sticky scene.
 *
 * Not used with real hero content until Phase 2 — this is Phase 1
 * infrastructure only.
 */
export const ScrollScene = forwardRef<HTMLElement, ScrollSceneProps>(
  ({ outerHeight = "100svh", children, className, innerClassName }, ref) => (
    <section ref={ref} style={{ height: outerHeight }} className={className}>
      <div
        className={`sticky top-0 h-[100svh] overflow-hidden ${innerClassName ?? ""}`}
      >
        {children}
      </div>
    </section>
  ),
);

ScrollScene.displayName = "ScrollScene";
