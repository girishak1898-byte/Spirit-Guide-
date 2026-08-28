import { GlobalNav } from "@/components/navigation/GlobalNav";
import { Container } from "@/components/ui/Container";
import { TextReveal } from "@/components/motion/TextReveal";
import { TempleGateway } from "@/components/gateway/TempleGateway";
import { RitualDiscoverySection } from "@/components/rituals/RitualDiscoverySection";
import { GuideMeSection } from "@/components/guide/GuideMeSection";
import { TemplePreviewSection } from "@/components/highlights/TemplePreviewSection";
import { DailyWisdomSection } from "@/components/wisdom/DailyWisdomSection";
import { LotusGardenSection } from "@/components/lotus/LotusGardenSection";
import { IntentionSanctuarySection } from "@/components/intention/IntentionSanctuarySection";
import { JournalSection } from "@/components/journal/JournalSection";

const STUB_CHAPTERS = [
  { id: "rituals", label: "Rituals" },
  { id: "sanctuary", label: "My Sanctuary" },
];

/**
 * Phase 2's Temple Gateway (docs/MOTION-SPEC.md §6) is followed by Phase 3's
 * Discover chapter — ritual discovery, Guide Me, Temple Experience preview
 * (docs/06_PHASE_GATES_AND_PROMPTS.md's Phase 3). Everything in
 * STUB_CHAPTERS below that remains an unbuilt placeholder for later phases.
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
        <RitualDiscoverySection />
        <GuideMeSection />
        <TemplePreviewSection />
        <DailyWisdomSection />
        <LotusGardenSection />
        <IntentionSanctuarySection />
        <JournalSection />

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
