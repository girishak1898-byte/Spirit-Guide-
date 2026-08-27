/**
 * Shared matchMedia breakpoints for gsap.matchMedia() branching.
 * Per docs/MOTION-SPEC.md §8, mobile/tablet/desktop must be independent
 * timeline branches, never a single desktop timeline scaled down.
 */

export const breakpoints = {
  mobile: "(max-width: 767px)",
  tablet: "(min-width: 768px) and (max-width: 1023px)",
  desktop: "(min-width: 1024px)",
} as const;

export type BreakpointKey = keyof typeof breakpoints;
