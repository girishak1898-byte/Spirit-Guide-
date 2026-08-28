"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { TextReveal } from "@/components/motion/TextReveal";
import { cn } from "@/lib/cn";

const AMOUNTS = [5, 10, 25] as const;

/**
 * "Help keep the sanctuary open." (docs/01_SPIRIT_GUIDE_V4_MASTER_BRIEF.md
 * §29) — presentation only. No payment API/checkout exists, so the final
 * action is an explicitly disabled button rather than a CTA that silently
 * does nothing; the selected amount is local component state only, never
 * transmitted anywhere.
 */
export function SupportSection() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section id="support" className="border-t border-border-subtle py-24">
      <Container className="max-w-xl">
        <TextReveal as="h2" className="font-serif text-section-title text-ink-primary">
          Help keep the sanctuary open.
        </TextReveal>

        <div className="mt-8 flex flex-wrap gap-3" role="group" aria-label="Choose an offering amount">
          {AMOUNTS.map((amount) => (
            <button
              key={amount}
              type="button"
              aria-pressed={selected === amount}
              onClick={() => setSelected(amount)}
              className={cn(
                "min-h-[44px] min-w-[44px] rounded-pill border px-5 text-ui-label transition-colors duration-ui ease-premium",
                selected === amount
                  ? "border-gold-primary text-gold-primary"
                  : "border-border-subtle text-ink-secondary hover:text-ink-primary",
              )}
            >
              £{amount}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <Button variant="primary" disabled aria-disabled="true">
            Support isn&rsquo;t available yet
          </Button>
          <p className="mt-3 text-ui-label text-ink-muted">Payments aren&rsquo;t connected yet — no charge will occur.</p>
        </div>
      </Container>
    </section>
  );
}
