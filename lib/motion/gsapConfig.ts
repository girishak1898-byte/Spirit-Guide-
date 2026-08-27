"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/**
 * Registers the GSAP plugins the product uses, exactly once, client-side
 * only. Call from any component that builds a ScrollTrigger timeline before
 * constructing it — safe to call repeatedly.
 */
export function registerGsap(): void {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export { gsap, ScrollTrigger };
