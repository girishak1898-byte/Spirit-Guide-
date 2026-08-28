import { Container } from "@/components/ui/Container";
import { TextReveal } from "@/components/motion/TextReveal";
import { RitualCard } from "./RitualCard";
import { RITUAL_CARDS } from "./ritualContent";

/**
 * "Sanctuary Highlights" / ritual discovery (Phase 3 scope). Five
 * presentation-only preview cards — real interaction arrives in Phase 4's
 * Temple Mode ritual dock (docs/IMPLEMENTATION-PLAN.md Phase 4).
 */
export function RitualDiscoverySection() {
  return (
    <section id="sanctuary-highlights" className="border-t border-border-subtle py-24">
      <Container>
        <TextReveal as="h2" className="font-serif text-section-title text-ink-primary">
          Rituals for the inner life.
        </TextReveal>

        <div className="mt-10 flex gap-5 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-5">
          {RITUAL_CARDS.map((ritual, index) => (
            <TextReveal key={ritual.id} delay={index * 0.06}>
              <RitualCard title={ritual.title} subtitle={ritual.subtitle} />
            </TextReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
