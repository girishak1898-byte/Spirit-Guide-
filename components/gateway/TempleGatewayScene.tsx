"use client";

import { useCallback, useMemo, useRef } from "react";
import { ScrollScene } from "@/components/motion/ScrollScene";
import { useTempleMode } from "@/components/temple/TempleModeProvider";
import { useMeditationHall } from "@/components/meditation/MeditationHallProvider";
import type { GatewayRefs } from "@/lib/motion/gatewayRefs";
import { GatewayArtwork } from "./GatewayArtwork";
import { GatewayCopy } from "./GatewayCopy";
import { GatewayRitualDock } from "./GatewayRitualDock";
import { GatewayStillness } from "./GatewayStillness";
import { useGatewayTimeline } from "./useGatewayTimeline";
import type { HeroMediaStatus } from "@/lib/content/heroMedia";
import { HERO_FOCAL_ORIGIN } from "@/lib/content/heroMediaConstants";

/**
 * The full cinematic Temple Gateway — GSAP-driven, scroll-scrubbed. Only
 * rendered for visitors without a reduced-motion preference; see
 * TempleGateway.tsx for the ReducedMotion split.
 */
export function TempleGatewayScene({ media }: { media: HeroMediaStatus }) {
  const outerRef = useRef<HTMLElement>(null);
  const artworkLayerRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const illuminationRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const supportingRef = useRef<HTMLParagraphElement>(null);
  const primaryCtaRef = useRef<HTMLDivElement>(null);
  const secondaryCtaRef = useRef<HTMLDivElement>(null);
  const spiritualNoteRef = useRef<HTMLDivElement>(null);
  const templeEyebrowRef = useRef<HTMLSpanElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  // Stable identity across renders — required so useGatewayTimeline's effect
  // (keyed on this object) doesn't rebuild the ScrollTrigger every render.
  const refs: GatewayRefs = useMemo(
    () => ({
      outerRef,
      artworkLayerRef,
      vignetteRef,
      illuminationRef,
      eyebrowRef,
      headlineRef,
      supportingRef,
      primaryCtaRef,
      secondaryCtaRef,
      spiritualNoteRef,
      templeEyebrowRef,
      statementRef,
      dockRef,
    }),
    [],
  );

  useGatewayTimeline(refs);

  const { openTemple } = useTempleMode();
  const onEnterTemple = useCallback(() => {
    openTemple();
  }, [openTemple]);

  const { openMeditation } = useMeditationHall();
  const onBeginMeditation = useCallback(() => {
    openMeditation();
  }, [openMeditation]);

  return (
    <ScrollScene
      ref={outerRef}
      className="relative h-[150vh] md:h-[190vh] lg:h-[240vh]"
      innerClassName="bg-bg-primary-1"
    >
      <GatewayArtwork
        media={media}
        focalOrigin={HERO_FOCAL_ORIGIN}
        layerRef={artworkLayerRef}
        vignetteRef={vignetteRef}
        illuminationRef={illuminationRef}
      />
      <GatewayCopy
        eyebrowRef={eyebrowRef}
        headlineRef={headlineRef}
        supportingRef={supportingRef}
        primaryCtaRef={primaryCtaRef}
        secondaryCtaRef={secondaryCtaRef}
        spiritualNoteRef={spiritualNoteRef}
        onEnterTemple={onEnterTemple}
        onBeginMeditation={onBeginMeditation}
      />
      <GatewayStillness templeEyebrowRef={templeEyebrowRef} statementRef={statementRef} />
      <GatewayRitualDock dockRef={dockRef} />
    </ScrollScene>
  );
}
