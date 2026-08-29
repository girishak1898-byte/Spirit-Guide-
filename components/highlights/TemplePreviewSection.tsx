import Image from "next/image";
import { getHeroMediaStatus } from "@/lib/content/heroMedia";
import { HERO_FOCAL_ORIGIN } from "@/lib/content/heroMediaConstants";
import { TemplePreviewCta } from "./TemplePreviewCta";

/**
 * "Temple Experience preview" (docs/01_SPIRIT_GUIDE_V4_MASTER_BRIEF.md §12
 * — not restated in the copy deck, not contradicted by it either, same
 * precedent as the Gateway's spiritual note). Preview/teaser only: the CTA
 * scrolls to the existing "Temple" stub section, it does not open Temple
 * Mode (Phase 4).
 *
 * Reuses the same real hero artwork rather than inventing new stock/AI
 * imagery for a scene that doesn't have its own asset yet (CLAUDE.md scope
 * discipline) — also honors the storyboard's own continuity requirement
 * that Temple Mode's look picks up where the Gateway's handoff leaves off.
 * Non-priority/lazy: this is below the fold, must never compete with the
 * hero's LCP image.
 */
export function TemplePreviewSection() {
  const media = getHeroMediaStatus();

  return (
    <section id="temple-preview" className="border-t border-border-subtle">
      <div className="relative flex min-h-[60vh] items-center overflow-hidden bg-bg-primary-1 py-24">
        {media.available ? (
          <Image
            src={media.src}
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            className="object-cover opacity-55"
            style={{ objectPosition: HERO_FOCAL_ORIGIN }}
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-50"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, var(--surface-elevated-2) 0%, var(--bg-primary-1) 70%)",
            }}
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-bg-primary-1 via-bg-primary-1/45 to-bg-primary-1/10"
        />

        <div className="relative z-content mx-auto flex w-full max-w-2xl flex-col items-center gap-4 px-5 text-center">
          <span className="text-eyebrow uppercase tracking-[0.2em] text-gold-primary">Temple Mode</span>
          <h2 className="font-serif text-section-title text-ink-primary">Enter the sanctuary.</h2>
          <p className="max-w-md text-body text-ink-secondary">
            A private space for ritual, stillness and reflection.
          </p>
          <div className="pt-2">
            <TemplePreviewCta />
          </div>
        </div>
      </div>
    </section>
  );
}
