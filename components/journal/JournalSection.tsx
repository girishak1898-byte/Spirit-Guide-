"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { TextReveal } from "@/components/motion/TextReveal";
import {
  readIntentions,
  readJournalEntries,
  writeJournalEntries,
  type Intention,
  type JournalEntry,
} from "@/lib/storage/localStorageService";
import { deriveGraph } from "@/lib/journal/journalGraph";
import { JournalGraph } from "./JournalGraph";

/**
 * "Write without performing." (docs/01_SPIRIT_GUIDE_V4_MASTER_BRIEF.md
 * §25). State starts empty on every render (server and the client's first
 * hydration pass alike) and is only populated from storage in a
 * mount-effect, so the two never disagree — no hydration mismatch.
 */
export function JournalSection() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [intentions, setIntentions] = useState<Intention[]>([]);
  const [draft, setDraft] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setEntries(readJournalEntries());
    setIntentions(readIntentions());
    setHydrated(true);
  }, []);

  const handleSave = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    const entry: JournalEntry = { id: crypto.randomUUID(), text: trimmed, createdAt: new Date().toISOString() };
    const next = [entry, ...entries];
    setEntries(next);
    writeJournalEntries(next);
    setDraft("");
  };

  const wordCount = draft.trim() ? draft.trim().split(/\s+/).length : 0;
  const { nodes, edges } = deriveGraph(entries, intentions);

  return (
    <section id="journal" className="border-t border-border-subtle py-24">
      <Container className="max-w-2xl">
        <TextReveal as="h2" className="font-serif text-section-title text-ink-primary">
          Write without performing.
        </TextReveal>

        <div className="mt-8 flex flex-col gap-3">
          <label htmlFor="journal-input" className="sr-only">
            Journal entry
          </label>
          <textarea
            id="journal-input"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={8}
            className="rounded-card border border-border-subtle bg-[var(--glass-surface)] p-4 text-body text-ink-primary focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
          />
          <div className="flex items-center justify-between">
            <span className="text-ui-label text-ink-muted">
              {wordCount} {wordCount === 1 ? "word" : "words"} · {draft.length} characters
            </span>
            <Button variant="primary" onClick={handleSave} disabled={!draft.trim()}>
              Save Reflection
            </Button>
          </div>
        </div>

        <div className="mt-16">
          {!hydrated ? null : entries.length === 0 ? (
            <div>
              <p className="font-serif text-card-title text-ink-primary">Nothing written yet.</p>
              <p className="mt-1 text-body text-ink-muted">Begin with one honest sentence.</p>
            </div>
          ) : (
            <>
              <h3 className="text-ui-label uppercase tracking-[0.15em] text-ink-muted">Your entries</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {entries.map((entry) => (
                  <li
                    key={entry.id}
                    className="rounded-card border border-border-subtle bg-[var(--surface-elevated-1)] p-4 text-body text-ink-primary"
                  >
                    {entry.text}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {hydrated && (
          <div className="mt-16">
            <h3 className="text-ui-label uppercase tracking-[0.15em] text-ink-muted">Connections</h3>
            <div className="mt-4">
              <JournalGraph nodes={nodes} edges={edges} />
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
