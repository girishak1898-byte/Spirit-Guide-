import { cn } from "@/lib/cn";
import { RITUAL_DOCK_ORDER, TEMPLE_STATES, type TempleStateId } from "@/lib/temple/templeContent";

interface RitualDockProps {
  activeState: TempleStateId;
  onSelect: (state: TempleStateId) => void;
}

/**
 * Functional dock (distinct from Phase 3's presentation-only RitualCard):
 * real buttons that swap TempleStateText. Translucent midnight glass per
 * docs/01_SPIRIT_GUIDE_V4_MASTER_BRIEF.md §13. No unicode/emoji icons — a
 * restrained label + accent treatment, same as Phase 3's deferred-asset
 * approach (logged in docs/ASSET-PLAN-IMPLEMENTATION.md).
 */
export function RitualDock({ activeState, onSelect }: RitualDockProps) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-content flex justify-center px-4 pb-4"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex gap-2 rounded-card border border-border-subtle bg-[var(--glass-surface)] px-3 py-2 backdrop-blur-[var(--glass-blur)] sm:gap-3 sm:px-5">
        {RITUAL_DOCK_ORDER.map((ritualId) => {
          const state = TEMPLE_STATES[ritualId];
          const selected = activeState === ritualId;
          return (
            <button
              key={ritualId}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(ritualId)}
              className={cn(
                "min-h-[44px] rounded-pill px-3 text-ui-label transition-colors duration-ui ease-premium sm:px-4",
                selected ? "bg-gold-primary text-bg-primary-1" : "text-ink-secondary hover:text-ink-primary",
              )}
            >
              {state.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
