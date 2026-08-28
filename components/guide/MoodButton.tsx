import { cn } from "@/lib/cn";

interface MoodButtonProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

/** Real button semantics, ≥44px touch target, selected state via aria-pressed + visible styling. */
export function MoodButton({ label, selected, onSelect }: MoodButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "min-h-[44px] rounded-pill border px-5 text-ui-label font-medium tracking-wide transition-colors duration-ui ease-premium",
        selected
          ? "border-gold-primary bg-gold-primary text-bg-primary-1"
          : "border-border-subtle bg-transparent text-ink-primary hover:border-ink-primary",
      )}
    >
      {label}
    </button>
  );
}
