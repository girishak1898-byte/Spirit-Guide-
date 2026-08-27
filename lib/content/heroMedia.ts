import { existsSync } from "node:fs";
import path from "node:path";
import { HERO_ALT, HERO_HEIGHT, HERO_PUBLIC_PATH, HERO_WIDTH } from "./heroMediaConstants";

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
 *
 * Deliberately kept separate from heroMediaConstants.ts: this module
 * imports node:fs/node:path, so it must never be imported by a "use
 * client" component — doing so once already broke the production build
 * (webpack refuses to bundle node:fs for the browser). Client components
 * needing HERO_FOCAL_ORIGIN or similar import heroMediaConstants.ts
 * directly instead.
 */

const HERO_FS_PATH = path.join(process.cwd(), "public", "assets", "hero", "hero-sanctuary-level1-source.png");

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
    alt: HERO_ALT,
  };
}
