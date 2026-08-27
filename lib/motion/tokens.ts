/**
 * JS-side mirror of the motion tokens in styles/tokens.css.
 * Keep these two files in sync manually — CSS custom properties aren't
 * readable by GSAP tweens, so numeric/string duplicates live here.
 */

export const duration = {
  micro: 0.2,
  ui: 0.35,
  editorial: 0.8,
  cinematic: 1.5,
} as const;

export const easePremium = "cubic-bezier(0.16, 1, 0.3, 1)";

/** GSAP-native equivalents for the same premium feel, no bounce/elastic ever. */
export const gsapEase = {
  out: "power3.out",
  outStrong: "power4.out",
  inOut: "power2.inOut",
} as const;
