import { cn } from "@/lib/cn";
import type { GraphEdge, GraphNode } from "@/lib/journal/journalGraph";

const KIND_LABEL: Record<GraphNode["kind"], string> = { journal: "Journal", intention: "Intention" };

/**
 * Consumes already-derived nodes/edges — decides no relationships itself
 * (lib/journal/journalGraph.ts owns that). Rendered as a real semantic
 * list first (the "meaningful non-visual representation" this phase
 * requires, and the honest choice while edges are always empty — see
 * journalGraph.ts), with small kind-coded chips as the visual layer
 * rather than a spatial node-link diagram, which would need real edges
 * to justify canvas/SVG complexity that isn't there yet. Never spills off
 * screen: a plain flex-wrap list, no fixed-size canvas.
 */
export function JournalGraph({ nodes, edges }: { nodes: GraphNode[]; edges: GraphEdge[] }) {
  if (nodes.length === 0) {
    return <p className="text-body text-ink-muted">Nothing saved yet — entries and intentions will appear here.</p>;
  }

  return (
    <div>
      <ul className="flex flex-wrap gap-3" aria-label="Your saved entries and intentions">
        {nodes.map((node) => (
          <li
            key={node.id}
            className={cn(
              "max-w-xs rounded-card border px-4 py-3 text-body",
              node.kind === "journal"
                ? "border-gold-primary/30 bg-[var(--surface-elevated-1)] text-ink-primary"
                : "border-jade-primary/30 bg-[var(--surface-elevated-1)] text-ink-primary",
            )}
          >
            <span className="block text-ui-label uppercase tracking-[0.15em] text-ink-muted">
              {KIND_LABEL[node.kind]}
            </span>
            <span className="mt-1 block">{node.label}</span>
          </li>
        ))}
      </ul>
      {edges.length === 0 && (
        <p className="mt-4 text-ui-label text-ink-muted">
          Connections between entries will appear here once you can link them together.
        </p>
      )}
    </div>
  );
}
