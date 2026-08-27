import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Server-only. Resolves whether the Level-1 hero asset physically exists in
 * the repo and returns everything the client artwork layer needs to render
 * it — or nothing, if it's still missing.
 *
 * This is the single isolation point docs/06_PHASE_GATES_AND_PROMPTS.md's
 * Phase 2 prompt requires: when the real file lands at the canonical path
 * below and the app rebuilds, `available` flips to true automatically. No
 * component changes, no fallback prop to flip, nothing to rewrite.
 *
 * Canonical path per docs/05_ASSET_PLAN.md / public/assets/ASSET_STATUS.json.
 */

const HERO_PUBLIC_PATH = "/assets/hero/hero-sanctuary-level1-source.png";
const HERO_FS_PATH = path.join(process.cwd(), "public", "assets", "hero", "hero-sanctuary-level1-source.png");

// Native generated-source dimensions per public/assets/ASSET_STATUS.json.
const HERO_WIDTH = 1672;
const HERO_HEIGHT = 941;

export interface HeroMediaStatus {
  available: boolean;
  src: string;
  width: number;
  height: number;
  alt: string;
}

export function getHeroMediaStatus(): HeroMediaStatus {
  return {
    available: existsSync(HERO_FS_PATH),
    src: HERO_PUBLIC_PATH,
    width: HERO_WIDTH,
    height: HERO_HEIGHT,
    alt: "The Spirit Guide sanctuary: a candlelit Buddha shrine deep within a midnight temple, lotus flowers resting on still water.",
  };
}
