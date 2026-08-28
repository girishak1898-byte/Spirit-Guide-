"use client";

import { useId, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { TextReveal } from "@/components/motion/TextReveal";
import { readIntentions, writeIntentions, type Intention } from "@/lib/storage/localStorageService";

const MAX_LENGTH = 180;

/** "Place one thing here with care." (docs/01_SPIRIT_GUIDE_V4_MASTER_BRIEF.md §24) — local-only, no accounts/backend. */
export function IntentionSanctuarySection() {
  const [text, setText] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const counterId = useId();

  const remaining = MAX_LENGTH - text.length;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value.slice(0, MAX_LENGTH));
    setSavedMessage("");
  };

  const handlePlace = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const intention: Intention = { id: crypto.randomUUID(), text: trimmed, createdAt: new Date().toISOString() };
    writeIntentions([...readIntentions(), intention]);
    setText("");
    setSavedMessage("Your intention has been placed.");
  };

  return (
    <section id="intention" className="border-t border-border-subtle py-24">
      <Container className="max-w-xl">
        <TextReveal as="h2" className="font-serif text-section-title text-ink-primary">
          Place one thing here with care.
        </TextReveal>

        <div className="mt-8 flex flex-col gap-3">
          <label htmlFor="intention-input" className="sr-only">
            Your intention
          </label>
          <textarea
            id="intention-input"
            value={text}
            onChange={handleChange}
            maxLength={MAX_LENGTH}
            aria-describedby={counterId}
            placeholder="May I meet today with…"
            rows={3}
            className="rounded-card border border-border-subtle bg-[var(--glass-surface)] p-4 text-body text-ink-primary placeholder:text-ink-muted focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
          />
          <div className="flex items-center justify-between">
            <span id={counterId} className="text-ui-label text-ink-muted">
              {text.length}/{MAX_LENGTH}
            </span>
            <div aria-live="polite" className="sr-only">
              {remaining === 0 ? "Character limit reached." : ""}
            </div>
            <Button variant="primary" onClick={handlePlace} disabled={!text.trim()}>
              Place Intention
            </Button>
          </div>
          <div aria-live="polite" className="min-h-[24px] text-ui-label text-jade-primary">
            {savedMessage}
          </div>
        </div>
      </Container>
    </section>
  );
}
