import { GlobalNav } from "@/components/navigation/GlobalNav";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { TextReveal } from "@/components/motion/TextReveal";

const STUB_CHAPTERS = [
  { id: "temple", label: "Temple" },
  { id: "meditate", label: "Meditate" },
  { id: "wisdom", label: "Wisdom" },
  { id: "rituals", label: "Rituals" },
  { id: "journal", label: "Journal" },
  { id: "sanctuary", label: "My Sanctuary" },
];

/**
 * Phase 1 foundation shell only — tokens, typography, layout, navigation
 * and motion primitives verified in place. The Temple Gateway hero
 * (docs/MOTION-SPEC.md §6) is Phase 2 and is gated on a real hero asset
 * per docs/ASSET-PLAN.md §5; nothing here should be mistaken for it.
 */
export default function HomePage() {
  return (
    <>
      <a
        href="#temple-gateway"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-toast focus:rounded-md focus:bg-gold-primary focus:px-4 focus:py-2 focus:text-bg-primary-1"
      >
        Skip to content
      </a>

      <div id="top" />
      <GlobalNav />

      <main id="temple-gateway" className="pt-32">
        <Container className="flex min-h-[70vh] flex-col justify-center gap-6 py-16">
          <TextReveal as="span" className="block text-eyebrow uppercase tracking-[0.2em] text-gold-primary">
            Phase 1 — Foundation
          </TextReveal>
          <TextReveal as="h1" delay={0.1} className="max-w-3xl font-serif text-hero leading-[1.05] text-ink-primary">
            The sanctuary is being built.
          </TextReveal>
          <TextReveal
            as="p"
            delay={0.2}
            className="max-w-xl text-body text-ink-secondary"
          >
            Design tokens, typography, navigation and motion primitives are in place. The Temple
            Gateway itself — the cinematic entrance — arrives in Phase 2.
          </TextReveal>
          <div className="flex flex-wrap gap-4 pt-2">
            <Button variant="primary">Enter Temple</Button>
            <Button variant="secondary">Begin Meditation</Button>
          </div>
        </Container>

        {STUB_CHAPTERS.map((chapter) => (
          <section
            key={chapter.id}
            id={chapter.id}
            className="border-t border-border-subtle py-24"
          >
            <Container>
              <TextReveal as="h2" className="font-serif text-section-title text-ink-primary">
                {chapter.label}
              </TextReveal>
              <p className="mt-3 max-w-lg text-body text-ink-muted">
                This chapter has not been built yet — it arrives in a later phase per
                docs/IMPLEMENTATION-PLAN.md.
              </p>
            </Container>
          </section>
        ))}
      </main>
    </>
  );
}
