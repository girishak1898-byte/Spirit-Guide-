"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { TextReveal } from "@/components/motion/TextReveal";
import { readIntentions, readJournalEntries, type Intention, type JournalEntry } from "@/lib/storage/localStorageService";

interface SanctuaryObject {
  id: string;
  title: string;
  body: string;
}

function truncate(text: string, max = 60): string {
  const trimmed = text.trim();
  return trimmed.length > max ? `${trimmed.slice(0, max - 1)}…` : trimmed;
}

function buildObjects(entries: JournalEntry[], intentions: Intention[]): SanctuaryObject[] {
  const latestIntention = intentions[intentions.length - 1] ?? null;
  const latestEntry = entries[0] ?? null; // JournalSection prepends, so index 0 is most recent.

  return [
    {
      id: "practice",
      title: "Practice",
      // Phase 5 sessions aren't persisted (no session history exists yet) —
      // an honest empty state, never a fabricated streak or last-practice date.
      body: "No practice recorded yet.",
    },
    {
      id: "intention",
      title: "Intention",
      body: latestIntention ? truncate(latestIntention.text) : "No intention placed yet.",
    },
    {
      id: "journal-object",
      title: "Journal",
      body:
        entries.length === 0
          ? "No entries saved yet."
          : `${entries.length} ${entries.length === 1 ? "entry" : "entries"} saved. Most recent: “${truncate(latestEntry!.text)}”`,
    },
    {
      id: "wisdom-object",
      title: "Wisdom",
      // No reading history is persisted — never invent saved contemplations.
      body: "No saved contemplations yet.",
    },
  ];
}

/**
 * "Your personal spiritual home" (docs/01_SPIRIT_GUIDE_V4_MASTER_BRIEF.md
 * §26) — object-based cards, not KPI/dashboard tiles, no streaks or
 * progress pressure. No real authentication exists, so there is no
 * loggedIn state to simulate: the logged-out message is simply always
 * true, and the local-device preview below it uses only real persisted
 * data (or an honest empty state where none exists).
 */
export function MySanctuarySection() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [intentions, setIntentions] = useState<Intention[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setEntries(readJournalEntries());
    setIntentions(readIntentions());
    setHydrated(true);
  }, []);

  const objects = buildObjects(entries, intentions);

  return (
    <section id="sanctuary" className="border-t border-border-subtle py-24">
      <Container>
        <TextReveal as="h2" className="font-serif text-section-title text-ink-primary">
          Your personal spiritual home.
        </TextReveal>

        <div className="mt-6 flex flex-col gap-4 rounded-card border border-border-subtle bg-[var(--glass-surface)] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-serif text-card-title text-ink-primary">Create your Sanctuary</p>
            <p className="mt-1 text-body text-ink-muted">Accounts aren&rsquo;t available yet — coming in a later phase.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="primary" disabled aria-disabled="true">
              Create account
            </Button>
            <Button variant="secondary" disabled aria-disabled="true">
              Sign in
            </Button>
          </div>
        </div>

        {hydrated && (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {objects.map((object) => (
              <div
                key={object.id}
                className="rounded-card border border-border-subtle bg-[var(--surface-elevated-1)] p-5"
              >
                <span className="text-ui-label uppercase tracking-[0.15em] text-gold-primary">{object.title}</span>
                <p className="mt-2 text-body text-ink-primary">{object.body}</p>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
