"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { TextReveal } from "@/components/motion/TextReveal";
import {
  readIntentions,
  readJournalEntries,
  readSessionHistory,
  type Intention,
  type JournalEntry,
  type SessionHistoryV1,
} from "@/lib/storage/localStorageService";
import { derivePracticeSummary } from "@/lib/sanctuary/sessionHistory";

interface SanctuaryObject {
  id: string;
  title: string;
  body: string;
}

function truncate(text: string, max = 60): string {
  const trimmed = text.trim();
  return trimmed.length > max ? `${trimmed.slice(0, max - 1)}…` : trimmed;
}

function formatPracticeDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
}

function buildObjects(entries: JournalEntry[], intentions: Intention[], sessionHistory: SessionHistoryV1): SanctuaryObject[] {
  const latestIntention = intentions[intentions.length - 1] ?? null;
  const latestEntry = entries[0] ?? null; // JournalSection prepends, so index 0 is most recent.
  const practice = derivePracticeSummary(sessionHistory);

  return [
    {
      id: "practice",
      title: "Practice",
      // v1.1: real session history now exists (sg.sessions.v1) — an honest
      // empty state below when none has been recorded, real data above.
      // No streak, goal, or percentage language — an object, not a KPI tile.
      body:
        practice.totalCompleted === 0 || !practice.lastPracticedAt
          ? "No practice recorded yet."
          : `${practice.totalCompleted} ${practice.totalCompleted === 1 ? "session" : "sessions"} completed. Last practice: ${formatPracticeDate(practice.lastPracticedAt)}${practice.lastDurationMinutes ? ` (${practice.lastDurationMinutes} min)` : ""}.`,
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
  const [sessionHistory, setSessionHistory] = useState<SessionHistoryV1>({ totalCompleted: 0, records: [] });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setEntries(readJournalEntries());
    setIntentions(readIntentions());
    setSessionHistory(readSessionHistory());
    setHydrated(true);
  }, []);

  const objects = buildObjects(entries, intentions, sessionHistory);

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
