import type { Intention, JournalEntry } from "@/lib/storage/localStorageService";

export type GraphNodeKind = "journal" | "intention";

export interface GraphNode {
  id: string;
  kind: GraphNodeKind;
  label: string;
}

export interface GraphEdge {
  sourceId: string;
  targetId: string;
}

function truncate(text: string, max = 60): string {
  const trimmed = text.trim();
  return trimmed.length > max ? `${trimmed.slice(0, max - 1)}…` : trimmed;
}

/**
 * The one place graph relationships are decided (required amendment:
 * "do NOT invent graph relationships inside JournalGraph"). Edges are only
 * ever derived from explicit, user-created tags/links — and no such
 * tagging or linking UI exists yet ("tags" is an explicitly deferred
 * Journal feature, docs/01_SPIRIT_GUIDE_V4_MASTER_BRIEF.md §25 "Future
 * features"). Never infer edges from text similarity, keyword matching,
 * or any other guess. This always returns an empty edge list until a real
 * relationship-creation UI ships — an empty/sparse graph is the correct,
 * honest state, not a bug.
 */
export function deriveGraph(entries: JournalEntry[], intentions: Intention[]): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [
    ...entries.map((entry) => ({ id: entry.id, kind: "journal" as const, label: truncate(entry.text) })),
    ...intentions.map((intention) => ({ id: intention.id, kind: "intention" as const, label: truncate(intention.text) })),
  ];
  const edges: GraphEdge[] = [];
  return { nodes, edges };
}
