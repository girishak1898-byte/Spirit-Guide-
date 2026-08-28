import { cn } from "@/lib/cn";
import { MEDITATION_DURATIONS, type MeditationDuration } from "@/lib/meditation/meditationContent";

interface DurationPickerProps {
  selected: MeditationDuration | null;
  onSelect: (duration: MeditationDuration) => void;
  disabled: boolean;
}

/** docs/01_SPIRIT_GUIDE_V4_MASTER_BRIEF.md §18: selected duration gets a champagne ring, others stay dark. */
export function DurationPicker({ selected, onSelect, disabled }: DurationPickerProps) {
  return (
    <div className="flex flex-wrap gap-3" role="group" aria-label="Choose a duration">
      {MEDITATION_DURATIONS.map((duration) => (
        <button
          key={duration}
          type="button"
          disabled={disabled}
          aria-pressed={selected === duration}
          onClick={() => onSelect(duration)}
          className={cn(
            "min-h-[44px] min-w-[44px] rounded-pill border px-4 text-ui-label transition-colors duration-ui ease-premium disabled:opacity-40",
            selected === duration
              ? "border-gold-primary text-gold-primary"
              : "border-border-subtle text-ink-secondary hover:text-ink-primary",
          )}
        >
          {duration} min
        </button>
      ))}
    </div>
  );
}
