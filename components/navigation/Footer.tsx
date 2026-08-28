"use client";

import { useTempleMode } from "@/components/temple/TempleModeProvider";
import { useMeditationHall } from "@/components/meditation/MeditationHallProvider";
import { SpiritGuideMark } from "./SpiritGuideMark";

const LEGAL_LABELS = ["Privacy", "Terms"] as const;

/**
 * docs/01_SPIRIT_GUIDE_V4_MASTER_BRIEF.md §32 — logo, statement, nav
 * (Temple/Meditate/Wisdom/Journal/My Sanctuary; Rituals is omitted here
 * per the brief's own footer list, which doesn't include it), legal.
 * Temple/Meditate route through the existing canonical open APIs, not a
 * second overlay; Wisdom/Journal/My Sanctuary are real in-page anchors.
 * No Privacy/Terms pages exist — rendered as plain non-link labels rather
 * than a fake href="#" or invented legal copy.
 */
export function Footer() {
  const { openTemple } = useTempleMode();
  const { openMeditation } = useMeditationHall();

  const navLinks: Array<{ label: string; href?: string; onClick?: () => void }> = [
    { label: "Temple", onClick: () => openTemple() },
    { label: "Meditate", onClick: () => openMeditation() },
    { label: "Wisdom", href: "#wisdom" },
    { label: "Journal", href: "#journal" },
    { label: "My Sanctuary", href: "#sanctuary" },
  ];

  return (
    <footer className="border-t border-border-subtle py-16">
      <div className="mx-auto flex w-full max-w-[1728px] flex-col gap-8 px-5 md:px-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-ink-primary">
            <SpiritGuideMark className="text-gold-primary" />
            <span className="font-serif text-ui-label tracking-[0.08em]">SPIRIT GUIDE</span>
          </div>
          <p className="text-body text-ink-muted">A digital sanctuary for modern life.</p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-3">
          {navLinks.map((item) =>
            item.href ? (
              <a key={item.label} href={item.href} className="text-ui-label text-ink-secondary hover:text-ink-primary">
                {item.label}
              </a>
            ) : (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                className="text-ui-label text-ink-secondary hover:text-ink-primary"
              >
                {item.label}
              </button>
            ),
          )}
        </nav>

        <div className="flex gap-6">
          {LEGAL_LABELS.map((label) => (
            <span key={label} className="text-ui-label text-ink-muted">
              {label}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
