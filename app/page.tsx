import { GlobalNav } from "@/components/navigation/GlobalNav";
import { Container } from "@/components/ui/Container";
import { TextReveal } from "@/components/motion/TextReveal";
import { TempleGateway } from "@/components/gateway/TempleGateway";

const STUB_CHAPTERS = [
  { id: "temple", label: "Temple" },
  { id: "meditate", label: "Meditate" },
  { id: "wisdom", label: "Wisdom" },
  { id: "rituals", label: "Rituals" },
  { id: "journal", label: "Journal" },
  { id: "sanctuary", label: "My Sanctuary" },
];

/**
 * Phase 2: the Temple Gateway is the real cinematic entrance
 * (docs/MOTION-SPEC.md §6, docs/04_HERO_MOTION_STORYBOARD.md). Everything
 * below it remains a Phase 1 placeholder stub — later phases build those
 * chapters; nothing here should be mistaken for them.
 */
export default function HomePage() {
  return (
    <>
      <a
        href="#temple-gateway"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-toast focus:rounded-button focus:bg-gold-primary focus:px-4 focus:py-2 focus:text-bg-primary-1"
      >
        Skip to content
      </a>

      <div id="top" />
      <GlobalNav />

      <main id="temple-gateway">
        <TempleGateway />

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
