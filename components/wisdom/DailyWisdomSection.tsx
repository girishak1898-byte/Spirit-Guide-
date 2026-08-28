"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { TextReveal } from "@/components/motion/TextReveal";
import { WISDOM_ITEMS, WISDOM_PROVENANCE_LABEL } from "./wisdomContent";

/** Manuscript-styled contemplative object (docs/01_SPIRIT_GUIDE_V4_MASTER_BRIEF.md §21), existing tokens only — no dedicated illustration asset exists yet. */
export function DailyWisdomSection() {
  const [index, setIndex] = useState(0);
  const item = WISDOM_ITEMS[index]!;

  const next = () => setIndex((current) => (current + 1) % WISDOM_ITEMS.length);

  return (
    <section id="wisdom" className="border-t border-border-subtle py-24">
      <Container>
        <TextReveal as="h2" className="font-serif text-section-title text-ink-primary">
          Read once.
          <br />
          Sit with it.
        </TextReveal>

        <TextReveal
          delay={0.1}
          className="mt-10 max-w-xl rounded-card border border-gold-primary/20 bg-[var(--surface-elevated-1)] p-8 shadow-elevated"
        >
          <span className="text-eyebrow uppercase tracking-[0.2em] text-gold-primary">
            {WISDOM_PROVENANCE_LABEL[item.provenance]}
          </span>
          <p className="mt-4 font-serif text-card-title text-ink-primary">{item.text}</p>
          <div className="mt-6">
            <Button variant="secondary" onClick={next}>
              Another reflection
            </Button>
          </div>
        </TextReveal>
      </Container>
    </section>
  );
}
