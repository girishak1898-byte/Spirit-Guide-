"use client";

import type { Ref } from "react";
import { Button } from "@/components/ui/Button";
import { GATEWAY_CONTENT } from "./gatewayContent";

interface GatewayCopyProps {
  /** Optional — the reduced-motion static variant renders this component with no refs, since nothing animates it. */
  eyebrowRef?: Ref<HTMLSpanElement>;
  headlineRef?: Ref<HTMLHeadingElement>;
  supportingRef?: Ref<HTMLParagraphElement>;
  primaryCtaRef?: Ref<HTMLDivElement>;
  secondaryCtaRef?: Ref<HTMLDivElement>;
  spiritualNoteRef?: Ref<HTMLDivElement>;
  onEnterTemple: () => void;
  onBeginMeditation: () => void;
}

/**
 * Real semantic HTML — never baked into the artwork. Desktop/tablet: left
 * column, ~35-40% of the scene per docs/01_SPIRIT_GUIDE_V4_MASTER_BRIEF.md
 * §6. Mobile: bottom-anchored with a scrim gradient so copy never sits
 * directly over the Buddha (brief §36's stacked mobile hero, adapted to the
 * sticky scene this storyboard requires).
 *
 * Each ref is a separate GSAP target because the storyboard retires these
 * pieces on different schedules (eyebrow/secondary CTA gone by Focus;
 * headline/primary CTA gone by Crossing) — see docs/MOTION-SPEC.md §6.
 */
export function GatewayCopy({
  eyebrowRef,
  headlineRef,
  supportingRef,
  primaryCtaRef,
  secondaryCtaRef,
  spiritualNoteRef,
  onEnterTemple,
  onBeginMeditation,
}: GatewayCopyProps) {
  return (
    <>
      <div
        className="absolute inset-x-0 bottom-0 z-content flex flex-col gap-4 bg-gradient-to-t from-bg-primary-1 via-bg-primary-1/80 to-transparent px-5 pb-10 pt-32 md:inset-y-0 md:left-0 md:right-auto md:w-full md:max-w-xl md:justify-center md:gap-5 md:bg-none md:px-8 md:pb-0 md:pt-0 lg:px-16"
      >
        <span
          ref={eyebrowRef}
          className="block text-eyebrow uppercase tracking-[0.2em] text-gold-primary"
        >
          {GATEWAY_CONTENT.eyebrow}
        </span>

        <h1 ref={headlineRef} className="font-serif text-hero leading-[1.05] text-ink-primary">
          {GATEWAY_CONTENT.headlineLines.map((line) => (
            <span key={line} className="gateway-headline-line block">
              {line}
            </span>
          ))}
        </h1>

        <p ref={supportingRef} className="max-w-md text-body text-ink-secondary">
          {GATEWAY_CONTENT.supporting}
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <div ref={primaryCtaRef}>
            <Button variant="primary" onClick={onEnterTemple}>
              {GATEWAY_CONTENT.primaryCta}
            </Button>
          </div>
          <div ref={secondaryCtaRef}>
            <Button variant="secondary" onClick={onBeginMeditation}>
              {GATEWAY_CONTENT.secondaryCta}
            </Button>
          </div>
        </div>
      </div>

      {/* Positioned below the statue rather than at top-1/3: the real hero
          artwork's Buddha occupies roughly x:60-94%, y:15-72% (see
          HERO_FOCAL_ORIGIN in lib/content/heroMediaConstants.ts), so a
          right-aligned panel anywhere in that vertical band sits across the
          shoulder/mandala — violating CLAUDE.md's "Buddha remains visually
          unobstructed" non-negotiable. Below y:72% is clear water/candles. */}
      <div
        ref={spiritualNoteRef}
        className="absolute bottom-10 right-8 z-content hidden max-w-xs rounded-card border border-border-subtle bg-[var(--glass-surface)] p-4 text-ui-label italic text-ink-secondary backdrop-blur-[var(--glass-blur)] lg:block"
      >
        {GATEWAY_CONTENT.spiritualNote}
      </div>
    </>
  );
}
