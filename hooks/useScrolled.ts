"use client";

import { useEffect, useState } from "react";

/**
 * True once the page has scrolled past `threshold`. Drives the navigation's
 * transparent-over-hero → midnight-glass interpolation. Plain state + CSS
 * transition (not GSAP) — this is a simple boolean UI toggle, not scroll
 * choreography, so it stays outside GSAP's ownership per
 * docs/MOTION-SPEC.md §1.
 */
export function useScrolled(threshold = 24): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > threshold);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return scrolled;
}
