"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTempleMode } from "@/components/temple/TempleModeProvider";
import { NAV_ITEMS, PRIMARY_CTA } from "./navConfig";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
}

const PANEL_CLASS = "fixed inset-0 z-mobile-menu flex flex-col bg-bg-primary-1 px-6 py-8";

function PanelContent({ onClose }: { onClose: () => void }) {
  const { openTemple } = useTempleMode();

  return (
    <>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation"
          className="flex min-h-[44px] min-w-[44px] items-center justify-center text-ink-primary"
        >
          <span aria-hidden="true" className="text-2xl leading-none">
            ×
          </span>
        </button>
      </div>

      <nav className="mt-12 flex flex-1 flex-col justify-center gap-2">
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) =>
            item.href === "#temple" ? (
              <li key={item.href}>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openTemple();
                  }}
                  className="flex min-h-[44px] items-center font-serif text-section-title text-ink-primary transition-colors duration-micro hover:text-gold-primary"
                >
                  {item.label}
                </button>
              </li>
            ) : (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={onClose}
                  className="flex min-h-[44px] items-center font-serif text-section-title text-ink-primary transition-colors duration-micro hover:text-gold-primary"
                >
                  {item.label}
                </a>
              </li>
            ),
          )}
        </ul>
      </nav>

      <Button
        variant="primary"
        className="w-full"
        onClick={() => {
          onClose();
          openTemple();
        }}
      >
        {PRIMARY_CTA.label}
      </Button>
    </>
  );
}

function usePanelBehavior(open: boolean, onClose: () => void, triggerRef: MobileNavProps["triggerRef"]) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, triggerRef]);

  return panelRef;
}

/**
 * Full-height Midnight Sanctuary navigation layer. Owned by Motion (Framer
 * Motion) per docs/MOTION-SPEC.md §1 — this is a menu open/close presence
 * transition, not scroll choreography, so GSAP never touches it.
 *
 * Reduced motion renders a plain, un-animated panel rather than an
 * accelerated near-zero-duration Motion animation: a genuinely instant
 * show/hide is both the more correct accessible behavior and sidesteps a
 * real crash in Motion's WAAPI-accelerated completion handler that a
 * ~0.01s duration was triggering.
 */
export function MobileNav({ open, onClose, triggerRef }: MobileNavProps) {
  const reducedMotion = useReducedMotion();
  const panelRef = usePanelBehavior(open, onClose, triggerRef);

  if (reducedMotion) {
    if (!open) return null;
    return (
      <div
        ref={panelRef}
        id="mobile-nav-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Spirit Guide navigation"
        className={PANEL_CLASS}
      >
        <PanelContent onClose={onClose} />
      </div>
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          id="mobile-nav-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Spirit Guide navigation"
          className={PANEL_CLASS}
          initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
          animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
          exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <PanelContent onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
