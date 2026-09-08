import type { SessionHistoryV1 } from "@/lib/storage/localStorageService";

export interface PracticeSummary {
  totalCompleted: number;
  lastPracticedAt: string | null;
  lastDurationMinutes: number | null;
}

/**
 * Real data only, mirroring journalGraph.ts's derivation pattern.
 * `totalCompleted` is the honest running count (never `records.length`,
 * which is capped). Last-practice info comes straight from the newest
 * record — no streaks, goals, or estimated activity are ever derived here.
 */
export function derivePracticeSummary(history: SessionHistoryV1): PracticeSummary {
  const latest = history.records[0] ?? null; // records is newest-first (see recordCompletedSession).
  return {
    totalCompleted: history.totalCompleted,
    lastPracticedAt: latest?.completedAt ?? null,
    lastDurationMinutes: latest?.durationMinutes ?? null,
  };
}
