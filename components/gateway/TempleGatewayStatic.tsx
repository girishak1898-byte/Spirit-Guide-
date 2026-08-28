"use client";

import Image from "next/image";
import type { HeroMediaStatus } from "@/lib/content/heroMedia";
import { HERO_FOCAL_ORIGIN } from "@/lib/content/heroMediaConstants";
import { useTempleMode } from "@/components/temple/TempleModeProvider";
import { GatewayCopy } from "./GatewayCopy";
import { GATEWAY_CONTENT } from "./gatewayContent";

function StaticArtwork({ media }: { media: HeroMediaStatus }) {
  return (
    <div className="absolute inset-0">
      {media.available ? (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: HERO_FOCAL_ORIGIN }}
        />
      ) : (
        <div
          aria-hidden="true"
          className="h-full w-full"
          style={{
            background: `radial-gradient(circle at ${HERO_FOCAL_ORIGIN}, var(--gold-primary) 0%, transparent 28%), radial-gradient(circle at ${HERO_FOCAL_ORIGIN}, var(--surface-elevated-2) 0%, var(--bg-primary-1) 60%)`,
            opacity: 0.5,
          }}
        />
      )}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, var(--bg-primary-1) 100%)",
          opacity: 0.2,
        }}
      />
    </div>
  );
}

/**
 * Reduced-motion alternative: premium static hero, no scrubbed camera
 * movement, no parallax, no long pinned sequence — a genuinely different,
 * simpler subtree from TempleGatewayScene, per
 * components/motion/ReducedMotion.tsx's guidance for cases like this one.
 * Below it, a simple non-scrubbed transition into the Temple Mode
 * statement, in normal document flow.
 */
export function TempleGatewayStatic({ media }: { media: HeroMediaStatus }) {
  const { openTemple } = useTempleMode();

  return (
    <>
      <section className="relative h-[100svh] w-full overflow-hidden">
        <StaticArtwork media={media} />
        <GatewayCopy
          onEnterTemple={() => openTemple()}
          onBeginMeditation={() => {
            document.getElementById("meditate")?.scrollIntoView({ behavior: "auto" });
          }}
        />
      </section>

      <section
        id="temple-mode-statement"
        className="flex flex-col items-center gap-4 border-t border-border-subtle bg-bg-primary-1 px-6 py-24 text-center"
      >
        <span className="block text-eyebrow uppercase tracking-[0.2em] text-gold-primary">
          {GATEWAY_CONTENT.templeEyebrow}
        </span>
        <h2 className="font-serif text-section-title text-ink-primary">
          {GATEWAY_CONTENT.stillnessHeadline}
        </h2>
        <p className="max-w-md text-body text-ink-secondary">{GATEWAY_CONTENT.stillnessSupport}</p>
        <div className="mt-4 flex gap-4 rounded-card border border-border-subtle bg-[var(--glass-surface)] px-5 py-2 backdrop-blur-[var(--glass-blur)]">
          {GATEWAY_CONTENT.ritualLabels.map((label) => (
            <span key={label} className="px-2 text-ui-label text-ink-secondary">
              {label}
            </span>
          ))}
        </div>
      </section>
    </>
  );
}
