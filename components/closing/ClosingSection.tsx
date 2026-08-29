import Image from "next/image";
import { getHeroMediaStatus } from "@/lib/content/heroMedia";
import { HERO_FOCAL_ORIGIN } from "@/lib/content/heroMediaConstants";
import { ClosingCta } from "./ClosingCta";

/**
 * Closing cinematic scene (docs/01_SPIRIT_GUIDE_V4_MASTER_BRIEF.md §31):
 * "The door stays open." / "Return whenever you need." Reuses the real
 * hero artwork (same precedent as the Temple Experience preview) rather
 * than fabricating a dedicated closing-scene asset. No pinned scroll
 * scene, no new GSAP — a quiet in-flow section.
 */
export function ClosingSection() {
  const media = getHeroMediaStatus();

  return (
    <section id="closing" className="border-t border-border-subtle">
      <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-bg-primary-1 py-24">
        {media.available ? (
          <Image
            src={media.src}
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            className="object-cover opacity-45"
            style={{ objectPosition: HERO_FOCAL_ORIGIN }}
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, var(--surface-elevated-2) 0%, var(--bg-primary-1) 70%)",
            }}
          />
        )}
        <div aria-hidden="true" className="absolute inset-0 bg-bg-primary-1/35" />

        <div className="relative z-content mx-auto flex w-full max-w-xl flex-col items-center gap-4 px-5 text-center">
          <h2 className="font-serif text-section-title text-ink-primary">The door stays open.</h2>
          <p className="max-w-md text-body text-ink-secondary">Return whenever you need.</p>
          <div className="pt-2">
            <ClosingCta />
          </div>
        </div>
      </div>
    </section>
  );
}
