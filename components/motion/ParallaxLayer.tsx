"use client";

import { forwardRef, type ReactNode } from "react";

export type ParallaxDepth = "background" | "midground" | "foreground";

interface ParallaxLayerProps {
  /** Conceptual depth band from docs/MOTION-SPEC.md §5 — informational only, exposed as a data attribute for the owning GSAP timeline to select on. */
  depth: ParallaxDepth;
  children: ReactNode;
  className?: string;
}

/**
 * Targetable layer node for scroll-linked parallax. Applies no motion of
 * its own — GSAP owns parallax per docs/MOTION-SPEC.md §1, so the parent
 * scene's timeline animates this element's transform via ref or the
 * data-parallax-depth attribute. Kept dumb on purpose so it never competes
 * with the owning timeline.
 */
export const ParallaxLayer = forwardRef<HTMLDivElement, ParallaxLayerProps>(
  ({ depth, children, className }, ref) => (
    <div ref={ref} data-parallax-depth={depth} className={className}>
      {children}
    </div>
  ),
);

ParallaxLayer.displayName = "ParallaxLayer";
