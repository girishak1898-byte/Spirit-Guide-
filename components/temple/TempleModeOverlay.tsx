"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
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

const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/** Tab/Shift+Tab containment + Escape + initial focus + body scroll lock while open. */
function useFocusTrap(open: boolean, containerRef: React.RefObject<HTMLDivElement>, onClose: () => void) {
  useEffect(() => {
    if (!open) return;

    const container = containerRef.current;
    container?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !container) return;

      const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => !el.hasAttribute("disabled"),
      );
      if (focusable.length === 0) return;

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, containerRef, onClose]);
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
