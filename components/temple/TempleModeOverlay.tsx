"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { HERO_ALT, HERO_FOCAL_ORIGIN, HERO_HEIGHT, HERO_PUBLIC_PATH, HERO_WIDTH } from "@/lib/content/heroMediaConstants";
import { TEMPLE_STATES, type TempleStateId } from "@/lib/temple/templeContent";
import { RitualDock } from "./RitualDock";
import { TempleStateText } from "./TempleStateText";

interface TempleModeOverlayProps {
  isOpen: boolean;
  activeState: TempleStateId;
  onClose: () => void;
  onSelectRitual: (state: TempleStateId) => void;
  heroAvailable: boolean;
}

function OverlayContent({ activeState, onClose, onSelectRitual, heroAvailable }: Omit<TempleModeOverlayProps, "isOpen">) {
  return (
    <>
      <div className="absolute inset-0">
        {heroAvailable ? (
          <Image
            src={HERO_PUBLIC_PATH}
            alt={HERO_ALT}
            width={HERO_WIDTH}
            height={HERO_HEIGHT}
            sizes="100vw"
            className="h-full w-full object-cover"
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
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--bg-primary-1)_100%)] opacity-30" />
      </div>

      <div className="absolute left-6 top-6 z-content flex items-center gap-2 text-ink-primary">
        <span className="font-serif text-ui-label tracking-[0.08em]">SPIRIT GUIDE</span>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close Temple Mode"
        className="absolute right-6 top-6 z-content flex min-h-[44px] min-w-[44px] items-center justify-center rounded-pill border border-border-subtle bg-[var(--glass-surface)] text-ink-primary backdrop-blur-[var(--glass-blur)]"
      >
        <span aria-hidden="true" className="text-xl leading-none">×</span>
      </button>

      {/* Mobile-only scrim behind the state text — narrow viewports have no
          room to keep this text clear of the Buddha the way the sm:left-16
          column does at wider sizes, so it needs a real backdrop (same
          intent as GatewayCopy's mobile bottom scrim) rather than sitting
          bare over the artwork. Measured against the actual rendered text
          (390px viewport: text spans ~112-294px from the bottom, dock sits
          at 0-78px) so opacity is already >=85% across that whole band, not
          just faded in from a generic bottom gradient that turned out to
          still be near-transparent at the text's actual position. Explicit
          stops rather than Tailwind's via-* modifier, which wasn't emitting
          a middle stop at all here (compare against GatewayCopy: 2-color
          from/to only, same gap — worth a fix there too if it recurs). */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-content h-[420px] bg-[linear-gradient(to_top,rgb(5,9,13)_0%,rgba(5,9,13,0.85)_75%,transparent_100%)] sm:hidden"
      />

      <div className="absolute inset-x-0 bottom-28 left-0 z-content px-6 sm:bottom-32 sm:left-16 sm:max-w-md">
        <TempleStateText stateId={activeState} />
      </div>

      <RitualDock activeState={activeState} onSelect={onSelectRitual} />
    </>
  );
}

export function TempleModeOverlay({ isOpen, activeState, onClose, onSelectRitual, heroAvailable }: TempleModeOverlayProps) {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  useFocusTrap(isOpen, containerRef, onClose);

  const dialogLabel = TEMPLE_STATES[activeState].headline;

  if (reducedMotion) {
    if (!isOpen) return null;
    return (
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label={dialogLabel}
        className="fixed inset-0 z-temple-mode overflow-hidden bg-bg-primary-1"
      >
        <OverlayContent activeState={activeState} onClose={onClose} onSelectRitual={onSelectRitual} heroAvailable={heroAvailable} />
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-label={dialogLabel}
          className="fixed inset-0 z-temple-mode overflow-hidden bg-bg-primary-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <OverlayContent activeState={activeState} onClose={onClose} onSelectRitual={onSelectRitual} heroAvailable={heroAvailable} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
