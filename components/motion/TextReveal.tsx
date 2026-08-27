"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { easePremium } from "@/lib/motion/tokens";

const TAGS = {
  div: motion.div,
  span: motion.span,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
} as const;

type TextRevealTag = keyof typeof TAGS;

interface TextRevealProps {
  children: ReactNode;
  /** Seconds to delay the reveal, for staggering a group of TextReveal siblings. */
  delay?: number;
  as?: TextRevealTag;
  className?: string;
}

const REST_STATE = { opacity: 1, y: 0, filter: "blur(0px)" };

/**
 * In-view editorial reveal (opacity + translateY + blur-out) for text that
 * is NOT part of a master scroll-driven sequence — e.g. a section statement
 * that simply appears once as the visitor scrolls to it. Uses Motion
 * (Framer Motion) because this is a component-presence transition, not
 * scroll choreography.
 *
 * Do NOT use this inside the Temple Gateway's own scroll timeline or any
 * other pinned/scrubbed scene — per docs/MOTION-SPEC.md §1, GSAP owns
 * "major text-reveal sequences" inside those; this primitive is for the
 * simpler, non-pinned sections (Sanctuary Highlights copy, Wisdom
 * statements, etc.) that just need a tasteful one-time reveal.
 *
 * Always renders the same motion element regardless of the reduced-motion
 * branch — reduced motion is expressed only through `initial={false}` +
 * no `whileInView` trigger (render already at rest, never animate), not by
 * swapping to a different element type. Swapping element types here
 * previously caused a real crash: useReducedMotion() necessarily starts
 * `false` on first render (for SSR hydration safety) and flips true a tick
 * later, so a structural swap would unmount an in-flight Motion animation
 * mid-flight and its completion handler would fire against a torn-down
 * node.
 */
export function TextReveal({ children, delay = 0, as = "div", className }: TextRevealProps) {
  const reducedMotion = useReducedMotion();
  const MotionTag = TAGS[as];

  if (reducedMotion) {
    return (
      <MotionTag className={className} initial={false} animate={REST_STATE}>
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
      whileInView={REST_STATE}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      style={{ transitionTimingFunction: easePremium }}
    >
      {children}
    </MotionTag>
  );
}
