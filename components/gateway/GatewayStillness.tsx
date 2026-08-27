"use client";

import type { Ref } from "react";
import { GATEWAY_CONTENT } from "./gatewayContent";

interface GatewayStillnessProps {
  templeEyebrowRef: Ref<HTMLSpanElement>;
  statementRef: Ref<HTMLDivElement>;
}

/**
 * The "Temple Identity" + "Stillness Statement" stages (docs/04_HERO_MOTION_STORYBOARD.md
 * §78–95%). Centered, quiet, deliberately smaller than the opening headline
 * — "elegant, smaller than an advertising billboard" per the storyboard.
 */
export function GatewayStillness({ templeEyebrowRef, statementRef }: GatewayStillnessProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-content flex flex-col items-center justify-center gap-4 px-6 text-center">
      <span
        ref={templeEyebrowRef}
        className="opacity-0 block text-eyebrow uppercase tracking-[0.2em] text-gold-primary"
        style={{ textShadow: "0 2px 20px rgba(5, 9, 13, 0.85)" }}
      >
        {GATEWAY_CONTENT.templeEyebrow}
      </span>
      {/* Subtle text-shadow, not a background card — keeps legibility over the
          figure without introducing a visible UI panel across this cinematic
          reveal (docs/04_HERO_MOTION_STORYBOARD.md's Handoff stage). */}
      <div ref={statementRef} className="flex flex-col gap-3 opacity-0">
        <h2
          className="font-serif text-section-title text-ink-primary"
          style={{ textShadow: "0 4px 32px rgba(5, 9, 13, 0.85)" }}
        >
          {GATEWAY_CONTENT.stillnessHeadline}
        </h2>
        <p className="text-body text-ink-secondary" style={{ textShadow: "0 2px 20px rgba(5, 9, 13, 0.85)" }}>
          {GATEWAY_CONTENT.stillnessSupport}
        </p>
      </div>
    </div>
  );
}
