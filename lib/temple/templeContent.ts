/** Copy verbatim from docs/08_CONTENT_COPY_DECK.md §Temple Mode default / §Rituals. */
export type RitualId = "candle" | "bell" | "incense" | "lotus" | "reflection";
export type TempleStateId = "default" | RitualId;

export interface TempleState {
  id: TempleStateId;
  label: string;
  eyebrow: string;
  headline: string;
  supporting: string;
}

export const TEMPLE_STATES: Record<TempleStateId, TempleState> = {
  default: {
    id: "default",
    label: "Temple Mode",
    eyebrow: "TEMPLE MODE",
    headline: "Nothing to achieve.",
    supporting: "Stay for one breath or as long as you need.",
  },
  candle: {
    id: "candle",
    label: "Candle",
    eyebrow: "TEMPLE MODE",
    headline: "Light a candle.",
    supporting: "Name one intention without needing to explain it.",
  },
  bell: {
    id: "bell",
    label: "Bell",
    eyebrow: "TEMPLE MODE",
    headline: "Ring the bell.",
    supporting: "Listen until the sound becomes silence.",
  },
  incense: {
    id: "incense",
    label: "Incense",
    eyebrow: "TEMPLE MODE",
    headline: "Offer incense.",
    supporting: "Let gratitude rise without words.",
  },
  lotus: {
    id: "lotus",
    label: "Lotus",
    eyebrow: "TEMPLE MODE",
    headline: "Offer a lotus.",
    supporting: "Open toward what you are ready to receive.",
  },
  reflection: {
    id: "reflection",
    label: "Reflection",
    eyebrow: "TEMPLE MODE",
    headline: "Spirit Guide Reflection",
    supporting: "Write. Observe. Integrate.",
  },
};

export const RITUAL_DOCK_ORDER: readonly RitualId[] = ["candle", "bell", "incense", "lotus", "reflection"];
