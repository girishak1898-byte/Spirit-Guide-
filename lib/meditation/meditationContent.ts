/** Copy verbatim from docs/08_CONTENT_COPY_DECK.md §Meditation. */
export type MeditationDuration = 3 | 7 | 12 | 20;
export const MEDITATION_DURATIONS: readonly MeditationDuration[] = [3, 7, 12, 20];

export const MEDITATION_CONTENT = {
  headline: "Time becomes spacious again.",
  supporting: "Choose your practice and follow the rhythm of your breath.",
  primaryCta: "Begin Meditation",
  pauseLabel: "Pause",
  resumeLabel: "Resume",
} as const;

export type BreathPhase = "inhale" | "hold" | "exhale";

/** Seconds per phase, docs/01_SPIRIT_GUIDE_V4_MASTER_BRIEF.md §17. */
export const BREATH_PHASE_SECONDS: Record<BreathPhase, number> = { inhale: 4, hold: 2, exhale: 6 };
export const BREATH_CYCLE_SECONDS =
  BREATH_PHASE_SECONDS.inhale + BREATH_PHASE_SECONDS.hold + BREATH_PHASE_SECONDS.exhale;

export type MeditationStatus = "idle" | "running" | "paused" | "finished";
