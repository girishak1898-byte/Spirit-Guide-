/**
 * docs/01_SPIRIT_GUIDE_V4_MASTER_BRIEF.md §22: every item carries explicit
 * typed provenance. Original text is labelled "reflection" (UI: "Spirit
 * Guide Reflection"); a verified historical source would be "teaching"
 * (UI: "Teaching") — none is available yet, so this pool ships
 * reflections only rather than fabricating attributed content.
 */
export type WisdomProvenance = "reflection" | "teaching";

export interface WisdomItem {
  id: string;
  provenance: WisdomProvenance;
  text: string;
}

export const WISDOM_PROVENANCE_LABEL: Record<WisdomProvenance, string> = {
  reflection: "Spirit Guide Reflection",
  teaching: "Teaching",
};

export const WISDOM_ITEMS: readonly WisdomItem[] = [
  { id: "w1", provenance: "reflection", text: "What you are looking for is not further away than this breath." },
  { id: "w2", provenance: "reflection", text: "Stillness is not empty. It is where everything else has room to settle." },
  { id: "w3", provenance: "reflection", text: "You do not have to solve today. You only have to meet it." },
  { id: "w4", provenance: "reflection", text: "Return, gently, as many times as it takes." },
  { id: "w5", provenance: "reflection", text: "Notice what you carry that was never yours to hold." },
] as const;
