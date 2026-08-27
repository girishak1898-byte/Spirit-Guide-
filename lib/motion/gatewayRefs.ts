import type { RefObject } from "react";

/** All DOM targets the Temple Gateway's GSAP timeline animates. */
export interface GatewayRefs {
  outerRef: RefObject<HTMLElement>;
  artworkLayerRef: RefObject<HTMLDivElement>;
  vignetteRef: RefObject<HTMLDivElement>;
  illuminationRef: RefObject<HTMLDivElement>;
  eyebrowRef: RefObject<HTMLSpanElement>;
  headlineRef: RefObject<HTMLHeadingElement>;
  supportingRef: RefObject<HTMLParagraphElement>;
  primaryCtaRef: RefObject<HTMLDivElement>;
  secondaryCtaRef: RefObject<HTMLDivElement>;
  spiritualNoteRef: RefObject<HTMLDivElement>;
  templeEyebrowRef: RefObject<HTMLSpanElement>;
  statementRef: RefObject<HTMLDivElement>;
  dockRef: RefObject<HTMLDivElement>;
}
