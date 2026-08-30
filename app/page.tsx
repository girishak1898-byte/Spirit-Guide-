import { GlobalNav } from "@/components/navigation/GlobalNav";
import { TempleGateway } from "@/components/gateway/TempleGateway";
import { RitualDiscoverySection } from "@/components/rituals/RitualDiscoverySection";
import { GuideMeSection } from "@/components/guide/GuideMeSection";
import { TemplePreviewSection } from "@/components/highlights/TemplePreviewSection";
import { DailyWisdomSection } from "@/components/wisdom/DailyWisdomSection";
import { LotusGardenSection } from "@/components/lotus/LotusGardenSection";
import { IntentionSanctuarySection } from "@/components/intention/IntentionSanctuarySection";
import { JournalSection } from "@/components/journal/JournalSection";
import { MySanctuarySection } from "@/components/sanctuary/MySanctuarySection";
import { SupportSection } from "@/components/support/SupportSection";
import { ClosingSection } from "@/components/closing/ClosingSection";
import { Footer } from "@/components/navigation/Footer";

/**
 * Phase 2's Temple Gateway (docs/MOTION-SPEC.md §6) is followed by Phase 3's
 * Discover chapter — ritual discovery, Guide Me, Temple Experience preview
 * (docs/06_PHASE_GATES_AND_PROMPTS.md's Phase 3).
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

        <MySanctuarySection />
        <SupportSection />
        <ClosingSection />
      </main>

      <Footer />
    </>
  );
}
