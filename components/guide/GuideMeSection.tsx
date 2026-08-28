"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { TextReveal } from "@/components/motion/TextReveal";
import { useMeditationHall } from "@/components/meditation/MeditationHallProvider";
import { MOOD_OPTIONS, buildMeditationHandoff, type MoodId } from "@/lib/guide/moodConfig";
import { MoodButton } from "./MoodButton";
import { GuidanceResult } from "./GuidanceResult";

/** "What do you need today?" (docs/08_CONTENT_COPY_DECK.md §Guide Me). Begin Practice opens Meditation Hall preselected to the recommended duration. */
export function GuideMeSection() {
  const [selectedId, setSelectedId] = useState<MoodId | null>(null);
  const [prepared, setPrepared] = useState(false);
  const { openMeditation } = useMeditationHall();

  const selectedMood = MOOD_OPTIONS.find((mood) => mood.id === selectedId) ?? null;

  const handleSelect = (id: MoodId) => {
    setSelectedId(id);
    setPrepared(false);
  };

  const handleBeginPractice = () => {
    if (!selectedMood) return;
    setPrepared(true);
    openMeditation(buildMeditationHandoff(selectedMood));
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
