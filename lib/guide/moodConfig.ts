/**
 * Guide Me source data (docs/08_CONTENT_COPY_DECK.md §Guide Me for the
 * question/options/CTA copy; only the Restless row's recommendation is
 * given verbatim there, so the remaining four practice names/durations are
 * authored here in the same calm, grounded register — durations drawn from
 * the approved Meditation durations list (§Meditation: 3/7/12/20 minutes).
 * No fake claims, no invented attribution.
 */

export type MoodId = "restless" | "anxious" | "heavy" | "scattered" | "seeking-clarity";

export type MeditationDuration = 3 | 7 | 12 | 20;

export interface MoodOption {
  id: MoodId;
  label: string;
  recommendedDuration: MeditationDuration;
  practiceName: string;
  guidance: string;
}

export const MOOD_OPTIONS: readonly MoodOption[] = [
  {
    id: "restless",
    label: "Restless",
    recommendedDuration: 7,
    practiceName: "7-Minute Longer Exhale",
    guidance: "Slow the nervous system with a longer outward breath.",
  },
  {
    id: "anxious",
    label: "Anxious",
    recommendedDuration: 12,
    practiceName: "12-Minute Steady Breath",
    guidance: "Settle a racing mind with a slow, even rhythm.",
  },
  {
    id: "heavy",
    label: "Heavy",
    recommendedDuration: 20,
    practiceName: "20-Minute Grounding Practice",
    guidance: "Give what feels heavy somewhere to rest.",
  },
  {
    id: "scattered",
    label: "Scattered",
    recommendedDuration: 3,
    practiceName: "3-Minute Return",
    guidance: "Gather your attention back to one breath at a time.",
  },
  {
    id: "seeking-clarity",
    label: "Seeking Clarity",
    recommendedDuration: 12,
    practiceName: "12-Minute Open Awareness",
    guidance: "Let the next right thing become obvious on its own.",
  },
] as const;

/**
 * The Phase 5 Meditation Hall handoff — built now, consumed later.
 * "Begin Practice" only ever produces this value; nothing here opens or
 * simulates the Meditation Hall itself.
 */
export interface MeditationHandoff {
  moodId: MoodId;
  recommendedDuration: MeditationDuration;
  practiceName: string;
  source: "guide-me";
}

export function buildMeditationHandoff(mood: MoodOption): MeditationHandoff {
  return {
    moodId: mood.id,
    recommendedDuration: mood.recommendedDuration,
    practiceName: mood.practiceName,
    source: "guide-me",
  };
}
