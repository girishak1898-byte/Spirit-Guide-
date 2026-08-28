"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { useScrolled } from "@/hooks/useScrolled";
import { useTempleMode } from "@/components/temple/TempleModeProvider";
import { useMeditationHall } from "@/components/meditation/MeditationHallProvider";
import { MobileNav } from "./MobileNav";
import { NAV_ITEMS, PRIMARY_CTA } from "./navConfig";
import { SpiritGuideMark } from "./SpiritGuideMark";

/**
 * Desktop: nearly transparent over the hero, interpolating to a restrained
 * midnight-glass surface as the visitor scrolls (docs/01_SPIRIT_GUIDE_V4_MASTER_BRIEF.md §5).
 * Mobile: logo + menu trigger, delegating the full-height menu to MobileNav.
 *
 * `data-gateway-nav` is a hook for the Temple Gateway's own GSAP timeline
 * (Phase 2) to animate this header's `opacity` during specific storyboard
 * stages ("Leaving the Website", "Temple Identity") — a property this
 * component itself never touches, so there's no ownership conflict with
 * the `scrolled`-driven background/border/blur above per
 * docs/MOTION-SPEC.md §1.
 */
export function GlobalNav() {
  const scrolled = useScrolled();
  const [mobileOpen, setMobileOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { openTemple } = useTempleMode();
  const { openMeditation } = useMeditationHall();
  const NAV_ACTIONS: Record<string, () => void> = { "#temple": () => openTemple(), "#meditate": () => openMeditation() };

  return (
    <header
      data-gateway-nav
      className={cn(
        "fixed inset-x-0 top-0 z-nav transition-all duration-ui ease-premium",
        scrolled
          ? "border-b border-border-subtle bg-[var(--glass-surface)] shadow-elevated backdrop-blur-[var(--glass-blur)]"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container as="nav" aria-label="Primary" className="flex h-16 items-center justify-between gap-4">
        <a href="#top" className="flex shrink-0 items-center gap-2 text-ink-primary">
          <SpiritGuideMark className="text-gold-primary" />
          <span className="font-serif text-ui-label tracking-[0.08em]">SPIRIT GUIDE</span>
        </a>

        <ul className="hidden items-center gap-4 lg:flex xl:gap-8">
          {NAV_ITEMS.map((item) =>
            NAV_ACTIONS[item.href] ? (
              <li key={item.href}>
                <button
                  type="button"
                  onClick={NAV_ACTIONS[item.href]}
                  className="text-ui-label text-ink-secondary transition-colors duration-micro hover:text-ink-primary"
                >
                  {item.label}
                </button>
              </li>
            ) : (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-ui-label text-ink-secondary transition-colors duration-micro hover:text-ink-primary"
                >
                  {item.label}
                </a>
              </li>
            ),
          )}
        </ul>

        <div className="hidden lg:block">
          <Button variant="primary" onClick={() => openTemple()}>{PRIMARY_CTA.label}</Button>
        </div>

        <button
          ref={triggerRef}
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-panel"
          aria-label="Open navigation"
          className="flex min-h-[44px] min-w-[44px] items-center justify-center text-ink-primary lg:hidden"
        >
          <span aria-hidden="true" className="flex flex-col gap-1.5">
            <span className="block h-px w-6 bg-current" />
            <span className="block h-px w-6 bg-current" />
          </span>
        </button>
      </Container>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} triggerRef={triggerRef} />
    </header>
  );
}
