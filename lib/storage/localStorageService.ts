"use client";

/**
 * Single encapsulated localStorage abstraction (docs/10_ARCHITECTURE_CONSTRAINTS.md
 * §Persistence) — components never call window.localStorage directly.
 *
 * SSR/hydration safety: every read/write no-ops safely when `window` is
 * unavailable (server render) rather than throwing. Callers must still
 * initialize React state to a fixed empty default and only call read*()
 * inside a useEffect (after mount) — reading synchronously during the
 * component's first render would make the client's initial render differ
 * from the server-rendered (necessarily empty) HTML and trigger a
 * hydration mismatch. This module only guarantees it won't crash on the
 * server; the mount-effect discipline is the caller's responsibility.
 *
 * Versioned keys (`sg.<domain>.v1`) rather than a version field inside the
 * payload — bumping the suffix on a future breaking schema change simply
 * orphans the old key (still safely ignored) instead of requiring an
 * in-place migration function that doesn't exist yet.
 */

const isBrowser = () => typeof window !== "undefined";

function safeReadArray<T>(key: string, isValid: (value: unknown) => value is T[]): T[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return isValid(parsed) ? parsed : [];
  } catch {
    // Corrupted/unparsable data — fail safely to empty rather than throwing.
    return [];
  }
}

function safeWriteArray<T>(key: string, value: T[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable/full/blocked — fail silently; in-memory state
    // for this session still works, it just won't persist across reload.
  }
}

export interface JournalEntry {
  id: string;
  text: string;
  createdAt: string;
}

export interface Intention {
  id: string;
  text: string;
  createdAt: string;
}

function isRecordEntry(item: unknown): item is { id: unknown; text: unknown; createdAt: unknown } {
  return typeof item === "object" && item !== null;
}

function isEntryArray(value: unknown): value is Array<{ id: string; text: string; createdAt: string }> {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isRecordEntry(item) &&
        typeof item.id === "string" &&
        typeof item.text === "string" &&
        typeof item.createdAt === "string",
    )
  );
}

const JOURNAL_KEY = "sg.journal.v1";
const INTENTION_KEY = "sg.intentions.v1";

export function readJournalEntries(): JournalEntry[] {
  return safeReadArray<JournalEntry>(JOURNAL_KEY, isEntryArray);
}

export function writeJournalEntries(entries: JournalEntry[]): void {
  safeWriteArray(JOURNAL_KEY, entries);
}

export function readIntentions(): Intention[] {
  return safeReadArray<Intention>(INTENTION_KEY, isEntryArray);
}

export function writeIntentions(intentions: Intention[]): void {
  safeWriteArray(INTENTION_KEY, intentions);
}
