/**
 * Client-safe hero constants — no fs/path imports here, so client
 * components (TempleGatewayScene, TempleGatewayStatic) can import
 * HERO_FOCAL_ORIGIN directly without pulling node:fs/node:path into the
 * browser bundle. lib/content/heroMedia.ts (server-only) re-uses these.
 */

export const HERO_PUBLIC_PATH = "/assets/hero/hero-sanctuary-level1-source.png";

// Native generated-source dimensions per public/assets/ASSET_STATUS.json —
// confirmed against the real file (PNG, 1672x941) once it landed.
export const HERO_WIDTH = 1672;
export const HERO_HEIGHT = 941;

export const HERO_ALT =
  "The Spirit Guide sanctuary: a candlelit Buddha shrine deep within a midnight temple, lotus flowers resting on still water.";

/**
 * Buddha's approximate on-image position, measured directly against the
 * real hero artwork (single source of truth — was previously duplicated as
 * an unmeasured "62% 42%" placeholder in two components before the real
 * file existed). The statue's bounding box (head to pedestal base,
 * shoulder to shoulder) runs roughly x:60-94%, y:15-72% of the frame; this
 * is its center. Used for both `object-position` (keeps the figure in
 * frame under object-fit:cover crops) and GSAP `transform-origin` (scaling
 * from this point keeps the subject visually anchored while the
 * environment grows around it, per docs/MOTION-SPEC.md §6).
 */
export const HERO_FOCAL_ORIGIN = "77% 43%";
