"use client";

import type { MeditationDuration } from "@/lib/meditation/meditationContent";

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

function safeReadObject<T>(key: string, fallback: T, isValid: (value: unknown) => value is T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    return isValid(parsed) ? parsed : fallback;
  } catch {
    // Corrupted/unparsable data — fail safely to the default shape.
    return fallback;
  }
}

function safeWriteObject<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable/full/blocked — fail silently.
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

export interface SessionRecord {
  id: string;
  durationMinutes: MeditationDuration;
  completedAt: string;
}

/**
 * `totalCompleted` is an independent counter, not `records.length` — it
 * keeps incrementing after `records` hits its cap, so My Sanctuary's count
 * stays honest instead of silently freezing at MAX_SESSION_RECORDS.
 */
export interface SessionHistoryV1 {
  totalCompleted: number;
  records: SessionRecord[];
}

const SESSION_HISTORY_KEY = "sg.sessions.v1";
const MAX_SESSION_RECORDS = 50;
const EMPTY_SESSION_HISTORY: SessionHistoryV1 = { totalCompleted: 0, records: [] };

function isSessionRecord(item: unknown): item is SessionRecord {
  return (
    typeof item === "object" &&
    item !== null &&
    typeof (item as { id: unknown }).id === "string" &&
    typeof (item as { durationMinutes: unknown }).durationMinutes === "number" &&
    typeof (item as { completedAt: unknown }).completedAt === "string"
  );
}

function isSessionHistory(value: unknown): value is SessionHistoryV1 {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as { totalCompleted?: unknown; records?: unknown };
  return (
    typeof candidate.totalCompleted === "number" &&
    Number.isFinite(candidate.totalCompleted) &&
    candidate.totalCompleted >= 0 &&
    Array.isArray(candidate.records) &&
    candidate.records.every(isSessionRecord)
  );
}

export function readSessionHistory(): SessionHistoryV1 {
  const history = safeReadObject(SESSION_HISTORY_KEY, EMPTY_SESSION_HISTORY, isSessionHistory);
  // recordCompletedSession always writes within the cap, but a read must
  // stay safe even if storage was edited/tampered with directly — and
  // self-heal storage back to the capped shape rather than re-trimming
  // the same oversized array on every future read.
  if (history.records.length <= MAX_SESSION_RECORDS) return history;
  const capped: SessionHistoryV1 = { ...history, records: history.records.slice(0, MAX_SESSION_RECORDS) };
  safeWriteObject(SESSION_HISTORY_KEY, capped);
  return capped;
}

/**
 * The one place a completed session is ever recorded. Newest-first in
 * `records`, capped at MAX_SESSION_RECORDS; `totalCompleted` always
 * increments regardless of the cap — never reconstructed or estimated.
 */
export function recordCompletedSession(durationMinutes: MeditationDuration): void {
  const current = readSessionHistory();
  const record: SessionRecord = { id: crypto.randomUUID(), durationMinutes, completedAt: new Date().toISOString() };
  const next: SessionHistoryV1 = {
    totalCompleted: current.totalCompleted + 1,
    records: [record, ...current.records].slice(0, MAX_SESSION_RECORDS),
  };
  safeWriteObject(SESSION_HISTORY_KEY, next);
}
