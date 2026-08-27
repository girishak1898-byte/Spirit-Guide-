"use client";

import Image from "next/image";
import type { Ref } from "react";
import type { HeroMediaStatus } from "@/lib/content/heroMedia";

interface GatewayArtworkProps {
  media: HeroMediaStatus;
  /** Transform-origin target (approximate on-image position of the Buddha), e.g. "62% 42%". Scaling from this point keeps the subject visually anchored while the environment around it grows — see docs/MOTION-SPEC.md §6 design intent. */
  focalOrigin: string;
  layerRef: Ref<HTMLDivElement>;
  vignetteRef: Ref<HTMLDivElement>;
  illuminationRef: Ref<HTMLDivElement>;
}

/**
 * The single Level-1 artwork layer plus two CSS-only lighting/vignette
 * overlays (gradient masks, not photographic layers — explicitly sanctioned
 * for Level-1 depth per docs/01_SPIRIT_GUIDE_V4_MASTER_BRIEF.md's "Image
 * limitation" guidance and docs/ASSET-PLAN-IMPLEMENTATION.md §2). No
 * Level-2 separated planes here.
 *
 * When `media.available` is false (the real asset hasn't landed in the
 * repo yet), renders a CSS gradient placeholder instead of attempting to
 * load a path known not to exist — this keeps the console/network clean
 * rather than triggering a 404. The moment the file exists at build time,
 * `media.available` flips to true automatically (see lib/content/heroMedia.ts)
 * and this component needs no changes.
 */
export function GatewayArtwork({ media, focalOrigin, layerRef, vignetteRef, illuminationRef }: GatewayArtworkProps) {
  return (
    <div
      ref={layerRef}
      className="absolute inset-0"
      style={{ transformOrigin: focalOrigin, willChange: "transform" }}
    >
      {media.available ? (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: focalOrigin }}
        />
      ) : (
        <div
          aria-hidden="true"
          className="h-full w-full"
          style={{
            background: `radial-gradient(circle at ${focalOrigin}, var(--gold-primary) 0%, transparent 28%), radial-gradient(circle at ${focalOrigin}, var(--surface-elevated-2) 0%, var(--bg-primary-1) 60%)`,
            opacity: 0.5,
          }}
        />
      )}

      {/* Vignette — edges darken as the sequence progresses. */}
      <div
        ref={vignetteRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, var(--bg-primary-1) 100%)",
        }}
      />

      {/* Illumination — central light strengthens through Focus / Leaving the Website. */}
      <div
        ref={illuminationRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{
          background: `radial-gradient(circle at ${focalOrigin}, var(--gold-secondary) 0%, transparent 35%)`,
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}
