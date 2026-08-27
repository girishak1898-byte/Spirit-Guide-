"use client";

import type { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ReducedMotionProps {
  /** Rendered when the visitor has no motion preference restrictions. */
  children: ReactNode;
  /** Rendered instead when prefers-reduced-motion is set — must remain fully functional on its own. */
  fallback: ReactNode;
}

/**
 * Per docs/MOTION-SPEC.md §7, reduced motion must produce an elegant static
 * alternative, not a disabled experience. Every scrubbed/pinned scene that
 * ships from Phase 2 onward should render its fallback through this
 * component rather than checking the media query ad hoc.
 *
 * Caution for consumers: useReducedMotion() necessarily starts `false` on
 * first render (SSR hydration requires the client's first render to match
 * the server's) and flips a tick later. If `children` contains an
 * in-flight Motion (Framer Motion) animation at that moment, this
 * component unmounting it mid-flight can crash Motion's WAAPI completion
 * handler (observed in components/motion/TextReveal.tsx — fixed there by
 * never swapping element types, only animation props, via
 * `initial={false}`). Prefer that same-element-different-props pattern
 * over children/fallback swapping wherever the animated content can be
 * expressed both ways; reserve this component for cases where the two
 * variants are genuinely different subtrees (e.g. a scrubbed hero vs. a
 * static image).
 */
export function ReducedMotion({ children, fallback }: ReducedMotionProps) {
  const reduced = useReducedMotion();
  return <>{reduced ? fallback : children}</>;
}
