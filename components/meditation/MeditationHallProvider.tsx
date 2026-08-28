"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import type { MeditationHandoff } from "@/lib/guide/moodConfig";
import { MeditationHallOverlay } from "./MeditationHallOverlay";

interface MeditationHallContextValue {
  openMeditation: (handoff?: MeditationHandoff) => void;
  closeMeditation: () => void;
}

const MeditationHallContext = createContext<MeditationHallContextValue | null>(null);

/** Every Meditation Hall entry point (Guide Me, Gateway CTA, nav) calls this. */
export function useMeditationHall(): MeditationHallContextValue {
  const ctx = useContext(MeditationHallContext);
  if (!ctx) throw new Error("useMeditationHall must be used within MeditationHallProvider");
  return ctx;
}

/**
 * Canonical Meditation Hall state/open API (docs/06_PHASE_GATES_AND_PROMPTS.md
 * Phase 5), mirroring TempleModeProvider's shape. Mounted once in
 * app/layout.tsx — a single overlay instance regardless of how many entry
 * points exist. `openMeditation()` with no handoff is the generic entry
 * (no preselected duration); `openMeditation(handoff)` is Guide Me's
 * mood-specific entry (preselects handoff.recommendedDuration).
 */
export function MeditationHallProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [handoff, setHandoff] = useState<MeditationHandoff | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const openMeditation = useCallback((nextHandoff?: MeditationHandoff) => {
    triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setHandoff(nextHandoff ?? null);
    setIsOpen(true);
  }, []);

  const closeMeditation = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  const value = useMemo(() => ({ openMeditation, closeMeditation }), [openMeditation, closeMeditation]);

  return (
    <MeditationHallContext.Provider value={value}>
      {children}
      <MeditationHallOverlay isOpen={isOpen} handoff={handoff} onClose={closeMeditation} />
    </MeditationHallContext.Provider>
  );
}
