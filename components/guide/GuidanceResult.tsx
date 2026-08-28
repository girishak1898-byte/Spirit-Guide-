"use client";

import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { MoodOption } from "@/lib/guide/moodConfig";

interface GuidanceResultProps {
  mood: MoodOption | null;
  prepared: boolean;
  onBeginPractice: () => void;
}

/**
 * Fixed min-height regardless of state (empty prompt vs. resolved guidance)
 * so selecting a mood never shifts layout below it — the CLS requirement
 * from this pass's QA checklist.
 */
export function GuidanceResult({ mood, prepared, onBeginPractice }: GuidanceResultProps) {
  const reducedMotion = useReducedMotion();
  const transition = reducedMotion ? { duration: 0 } : { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const };
  const emptyTransition = reducedMotion ? { duration: 0 } : { duration: 0.25 };

  return (
    <div className="mt-8 flex min-h-[168px] flex-col justify-center rounded-card border border-border-subtle bg-[var(--glass-surface)] p-6 backdrop-blur-[var(--glass-blur)] sm:p-8">
      <AnimatePresence mode="wait">
        {mood ? (
          <motion.div
            key={mood.id}
            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={transition}
            className="flex flex-col gap-3"
          >
            <span className="text-eyebrow uppercase tracking-[0.2em] text-gold-primary">
              Recommended
            </span>
            <h3 className="font-serif text-card-title text-ink-primary">{mood.practiceName}</h3>
            <p className="text-body text-ink-secondary">{mood.guidance}</p>
            <div className="pt-2">
              <Button variant="primary" onClick={onBeginPractice}>
                {prepared ? "Practice Ready" : "Begin Practice"}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.p
            key="empty"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0 }}
            transition={emptyTransition}
            className="text-body text-ink-muted"
          >
            Choose what you need today, and we&rsquo;ll recommend a practice.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
