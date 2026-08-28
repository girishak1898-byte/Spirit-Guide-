"use client";

import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TEMPLE_STATES, type TempleStateId } from "@/lib/temple/templeContent";

export function TempleStateText({ stateId }: { stateId: TempleStateId }) {
  const reducedMotion = useReducedMotion();
  const state = TEMPLE_STATES[stateId];
  const transition = reducedMotion ? { duration: 0 } : { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state.id}
        initial={reducedMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
        transition={transition}
        className="flex flex-col gap-2"
      >
        <span className="text-eyebrow uppercase tracking-[0.2em] text-gold-primary">{state.eyebrow}</span>
        <h2
          className="font-serif text-section-title text-ink-primary"
          style={{ textShadow: "0 4px 32px rgba(5, 9, 13, 0.85)" }}
        >
          {state.headline}
        </h2>
        <p className="max-w-sm text-body text-ink-secondary" style={{ textShadow: "0 2px 20px rgba(5, 9, 13, 0.85)" }}>
          {state.supporting}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
