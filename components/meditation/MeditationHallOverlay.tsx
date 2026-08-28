"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { Button } from "@/components/ui/Button";
import { MEDITATION_CONTENT } from "@/lib/meditation/meditationContent";
import type { MeditationHandoff } from "@/lib/guide/moodConfig";
import { BreathingMandala } from "./BreathingMandala";
import { DurationPicker } from "./DurationPicker";
import { formatTime, useMeditationTimer } from "./useMeditationTimer";

interface MeditationHallOverlayProps {
  isOpen: boolean;
  handoff: MeditationHandoff | null;
  onClose: () => void;
}

/**
 * No dedicated Meditation Hall background artwork exists yet
 * (docs/01_SPIRIT_GUIDE_V4_MASTER_BRIEF.md §16 is a future scene) — reuses
 * the same restrained midnight-token treatment as Temple Mode's dock, gap
 * logged in docs/ASSET-PLAN-IMPLEMENTATION.md §8.
 */
function OverlayContent({ handoff, onClose }: Omit<MeditationHallOverlayProps, "isOpen">) {
  // This subtree only mounts while isOpen is true (see MeditationHallOverlay
  // below) and fully unmounts on close, so useMeditationTimer's own state —
  // and its interval cleanup — resets by construction on every reopen.
  // Applying the handoff's duration in a mount-time effect is what makes a
  // reopen "start clean unless handoff supplies configuration".
  const { status, durationMinutes, remainingSeconds, announcement, selectDuration, start, pause, resume, reset } =
    useMeditationTimer();

  useEffect(() => {
    if (handoff) selectDuration(handoff.recommendedDuration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handoff]);

  return (
    <>
      <div aria-hidden="true" className="absolute inset-0 bg-bg-primary-1">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, var(--surface-elevated-2) 0%, var(--bg-primary-1) 65%)",
          }}
        />
      </div>

      <div className="absolute left-6 top-6 z-content flex items-center gap-2 text-ink-primary">
        <span className="font-serif text-ui-label tracking-[0.08em]">SPIRIT GUIDE</span>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close Meditation Hall"
        className="absolute right-6 top-6 z-modal flex min-h-[44px] min-w-[44px] items-center justify-center rounded-pill border border-border-subtle bg-[var(--glass-surface)] text-ink-primary backdrop-blur-[var(--glass-blur)]"
      >
        <span aria-hidden="true" className="text-xl leading-none">×</span>
      </button>

      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>

      <div className="absolute inset-0 z-content flex flex-col items-center justify-center gap-8 px-6 text-center">
        {status === "idle" && (
          <>
            <div className="flex flex-col gap-2">
              <h2 className="font-serif text-section-title text-ink-primary">{MEDITATION_CONTENT.headline}</h2>
              <p className="text-body text-ink-secondary">{MEDITATION_CONTENT.supporting}</p>
            </div>
            <DurationPicker selected={durationMinutes} onSelect={selectDuration} disabled={false} />
            <Button variant="primary" onClick={start} disabled={!durationMinutes}>
              {MEDITATION_CONTENT.primaryCta}
            </Button>
          </>
        )}

        {(status === "running" || status === "paused") && (
          <>
            <BreathingMandala status={status} />
            <div className="font-serif text-hero text-ink-primary" aria-hidden="true">
              {formatTime(remainingSeconds)}
            </div>
            <div className="flex gap-4">
              <Button variant="primary" onClick={status === "running" ? pause : resume}>
                {status === "running" ? MEDITATION_CONTENT.pauseLabel : MEDITATION_CONTENT.resumeLabel}
              </Button>
              <Button variant="secondary" onClick={reset}>
                Reset
              </Button>
            </div>
          </>
        )}

        {status === "finished" && (
          <>
            <BreathingMandala status={status} />
            <div className="flex flex-col gap-2">
              <h2 className="font-serif text-section-title text-ink-primary">Meditation complete.</h2>
              <p className="text-body text-ink-secondary">Carry this stillness with you.</p>
            </div>
            <Button variant="primary" onClick={reset}>
              Begin again
            </Button>
          </>
        )}
      </div>
    </>
  );
}

export function MeditationHallOverlay({ isOpen, handoff, onClose }: MeditationHallOverlayProps) {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  useFocusTrap(isOpen, containerRef, onClose);

  if (reducedMotion) {
    if (!isOpen) return null;
    return (
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label={MEDITATION_CONTENT.headline}
        className="fixed inset-0 z-temple-mode overflow-hidden bg-bg-primary-1"
      >
        <OverlayContent handoff={handoff} onClose={onClose} />
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-label={MEDITATION_CONTENT.headline}
          className="fixed inset-0 z-temple-mode overflow-hidden bg-bg-primary-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <OverlayContent handoff={handoff} onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
