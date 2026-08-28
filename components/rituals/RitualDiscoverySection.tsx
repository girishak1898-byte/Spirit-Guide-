"use client";

import { Container } from "@/components/ui/Container";
import { TextReveal } from "@/components/motion/TextReveal";
import { useTempleMode } from "@/components/temple/TempleModeProvider";
import { RitualCard } from "./RitualCard";
import { RITUAL_CARDS } from "./ritualContent";

/**
 * "Sanctuary Highlights" / ritual discovery. Each card opens Temple Mode
 * (Phase 4) preselected to the matching ritual state — the visitor never
 * selects the same ritual twice.
 */
export function RitualDiscoverySection() {
  const { openTemple } = useTempleMode();

  return (
    <section id="sanctuary-highlights" className="border-t border-border-subtle py-24">
      <Container>
        <TextReveal as="h2" className="font-serif text-section-title text-ink-primary">
          Rituals for the inner life.
        </TextReveal>

        <div className="mt-10 flex gap-5 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-5">
          {RITUAL_CARDS.map((ritual, index) => (
            <TextReveal key={ritual.id} delay={index * 0.06}>
              <RitualCard title={ritual.title} subtitle={ritual.subtitle} onOpen={() => openTemple(ritual.id)} />
            </TextReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
