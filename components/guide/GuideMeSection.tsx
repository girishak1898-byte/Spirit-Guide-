"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { TextReveal } from "@/components/motion/TextReveal";
import { MOOD_OPTIONS, buildMeditationHandoff, type MoodId } from "@/lib/guide/moodConfig";
import { MoodButton } from "./MoodButton";
import { GuidanceResult } from "./GuidanceResult";

/**
 * "What do you need today?" (docs/08_CONTENT_COPY_DECK.md §Guide Me). Begin
 * Practice only prepares the Phase 5 Meditation Hall handoff state — it does
 * not open or simulate a meditation session (docs/06_PHASE_GATES_AND_PROMPTS.md
 * Phase 3 scope).
 */
export function GuideMeSection() {
  const [selectedId, setSelectedId] = useState<MoodId | null>(null);
  const [prepared, setPrepared] = useState(false);

  const selectedMood = MOOD_OPTIONS.find((mood) => mood.id === selectedId) ?? null;

  const handleSelect = (id: MoodId) => {
    setSelectedId(id);
    setPrepared(false);
  };

  const handleBeginPractice = () => {
    if (!selectedMood) return;
    const handoff = buildMeditationHandoff(selectedMood);
    // Phase 5 will read this handoff to pre-configure the Meditation Hall.
    // No Meditation Hall UI exists yet, so this only records readiness.
    console.info("[guide-me] meditation handoff prepared", handoff);
    setPrepared(true);
  };

  return (
    <section id="guide-me" className="border-t border-border-subtle py-24">
      <Container>
        <div className="max-w-2xl">
          <TextReveal as="h2" className="font-serif text-section-title text-ink-primary">
            What do you need today?
          </TextReveal>

          <div className="mt-8 flex flex-wrap gap-3" role="group" aria-label="Choose what you need today">
            {MOOD_OPTIONS.map((mood) => (
              <MoodButton
                key={mood.id}
                label={mood.label}
                selected={mood.id === selectedId}
                onSelect={() => handleSelect(mood.id)}
              />
            ))}
          </div>

          <GuidanceResult mood={selectedMood} prepared={prepared} onBeginPractice={handleBeginPractice} />
        </div>
      </Container>
    </section>
  );
}
