"use client";

import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ScrollSceneProps {
  /**
   * Outer scroll distance, e.g. "240vh" for a single fixed-height sequence.
   * Omit this when the scene needs a *responsive* height (different per
   * breakpoint) and supply Tailwind height utilities via `className`
   * instead (e.g. `h-[150vh] md:h-[190vh] lg:h-[240vh]`) — one or the
   * other, never both (inline style would always win and silently defeat
   * the responsive classes). One of the two is required; there is no
   * default height.
   */
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
 */
export const ScrollScene = forwardRef<HTMLElement, ScrollSceneProps>(
  ({ outerHeight, children, className, innerClassName }, ref) => (
    <section
      ref={ref}
      style={outerHeight ? { height: outerHeight } : undefined}
      className={className}
    >
      <div className={cn("sticky top-0 h-[100svh] overflow-hidden", innerClassName)}>{children}</div>
    </section>
  ),
);

ScrollScene.displayName = "ScrollScene";
