"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  BREATH_CYCLE_SECONDS,
  BREATH_PHASE_SECONDS,
  type BreathPhase,
  type MeditationStatus,
} from "@/lib/meditation/meditationContent";

function phaseAt(elapsedSeconds: number): { phase: BreathPhase; scale: number } {
  const t = elapsedSeconds % BREATH_CYCLE_SECONDS;
  if (t < BREATH_PHASE_SECONDS.inhale) {
    return { phase: "inhale", scale: 0.85 + 0.3 * (t / BREATH_PHASE_SECONDS.inhale) };
  }
  if (t < BREATH_PHASE_SECONDS.inhale + BREATH_PHASE_SECONDS.hold) {
    return { phase: "hold", scale: 1.15 };
  }
  const exhaleT = t - BREATH_PHASE_SECONDS.inhale - BREATH_PHASE_SECONDS.hold;
  return { phase: "exhale", scale: 1.15 - 0.3 * (exhaleT / BREATH_PHASE_SECONDS.exhale) };
}

const PHASE_LABEL: Record<BreathPhase, string> = { inhale: "INHALE", hold: "HOLD", exhale: "EXHALE" };

/**
 * Layered breathing mandala (docs/01_SPIRIT_GUIDE_V4_MASTER_BRIEF.md §17):
 * transform-only scale, only animates while running, freezes exactly where
 * it was on pause and continues from there on resume (not a restart), no
 * continuous animation idle/finished. Reduced motion keeps scale fixed —
 * the phase is still conveyed through the INHALE/HOLD/EXHALE text.
 */
export function BreathingMandala({ status }: { status: MeditationStatus }) {
  const reducedMotion = useReducedMotion();
  const [state, setState] = useState<{ phase: BreathPhase; scale: number }>({ phase: "inhale", scale: 0.85 });
  const elapsedAtPauseRef = useRef(0);
  const cycleStartRef = useRef<number | null>(null);

  useEffect(() => {
    if (status !== "running") {
      if (status === "paused" && cycleStartRef.current !== null) {
        elapsedAtPauseRef.current = (Date.now() - cycleStartRef.current) / 1000;
      }
      if (status === "idle") elapsedAtPauseRef.current = 0;
      cycleStartRef.current = null;
      return;
    }

    if (cycleStartRef.current === null) {
      cycleStartRef.current = Date.now() - elapsedAtPauseRef.current * 1000;
    }

    const interval = setInterval(() => {
      if (cycleStartRef.current === null) return;
      setState(phaseAt((Date.now() - cycleStartRef.current) / 1000));
    }, 200);

    return () => clearInterval(interval);
  }, [status]);

  const isRestState = status === "idle" || status === "finished";
  const scale = reducedMotion || isRestState ? 1 : state.scale;
  const showPhase = status === "running" || status === "paused";

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative flex h-48 w-48 items-center justify-center sm:h-64 sm:w-64">
        <div
          className="absolute inset-0 rounded-full border border-ink-primary/10"
          style={{ transform: `scale(${scale})`, transition: reducedMotion ? "none" : "transform 220ms linear" }}
        />
        <div
          className="absolute inset-4 rounded-full border border-gold-primary/40"
          style={{ transform: `scale(${scale})`, transition: reducedMotion ? "none" : "transform 220ms linear" }}
        />
        <div
          className="absolute inset-8 rounded-full border border-jade-primary/30"
          style={{ transform: `scale(${scale})`, transition: reducedMotion ? "none" : "transform 220ms linear" }}
        />
        <div
          className="absolute inset-16 rounded-full bg-bg-primary-2"
          style={{ transform: `scale(${scale})`, transition: reducedMotion ? "none" : "transform 220ms linear" }}
        />
      </div>
      <div className="flex h-14 flex-col items-center justify-center text-center">
        {showPhase && (
          <>
            <span className="text-eyebrow uppercase tracking-[0.3em] text-gold-primary">{PHASE_LABEL[state.phase]}</span>
            <div className="mt-1 font-serif text-card-title text-ink-primary">{BREATH_PHASE_SECONDS[state.phase]}</div>
          </>
        )}
      </div>
    </div>
  );
}
