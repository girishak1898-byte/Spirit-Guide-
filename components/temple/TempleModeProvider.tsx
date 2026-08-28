"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import type { TempleStateId } from "@/lib/temple/templeContent";
import { TempleModeOverlay } from "./TempleModeOverlay";

interface TempleModeContextValue {
  isOpen: boolean;
  activeState: TempleStateId;
  openTemple: (initialState?: TempleStateId) => void;
  closeTemple: () => void;
  setActiveState: (state: TempleStateId) => void;
}

const TempleModeContext = createContext<TempleModeContextValue | null>(null);

/** Every Temple Mode entry point (Gateway CTA, ritual cards, Temple preview CTA) calls this. */
export function useTempleMode(): TempleModeContextValue {
  const ctx = useContext(TempleModeContext);
  if (!ctx) throw new Error("useTempleMode must be used within TempleModeProvider");
  return ctx;
}

/**
 * Canonical Temple Mode state/open API (docs/06_PHASE_GATES_AND_PROMPTS.md
 * Phase 4). Mounted once in app/layout.tsx so the overlay itself is a
 * single DOM instance regardless of how many entry points exist. Tracks the
 * exact trigger element so closing restores focus to it, not just "the
 * previously focused element" generically.
 */
export function TempleModeProvider({ children, heroAvailable }: { children: ReactNode; heroAvailable: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeState, setActiveState] = useState<TempleStateId>("default");
  const triggerRef = useRef<HTMLElement | null>(null);

  const openTemple = useCallback((initialState: TempleStateId = "default") => {
    triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setActiveState(initialState);
    setIsOpen(true);
  }, []);

  const closeTemple = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  const value = useMemo(
    () => ({ isOpen, activeState, openTemple, closeTemple, setActiveState }),
    [isOpen, activeState, openTemple, closeTemple],
  );

  return (
    <TempleModeContext.Provider value={value}>
      {children}
      <TempleModeOverlay
        isOpen={isOpen}
        activeState={activeState}
        onClose={closeTemple}
        onSelectRitual={setActiveState}
        heroAvailable={heroAvailable}
      />
    </TempleModeContext.Provider>
  );
}
