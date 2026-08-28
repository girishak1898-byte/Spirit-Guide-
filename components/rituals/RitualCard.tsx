interface RitualCardProps {
  title: string;
  subtitle: string;
  onOpen: () => void;
}

/**
 * Phase 4 (docs/06_PHASE_GATES_AND_PROMPTS.md): now a real trigger into
 * Temple Mode with the matching ritual preselected, so a real `<button>`
 * wrapping the whole card — real keyboard/focus semantics, not a click
 * handler bolted onto a non-interactive element.
 *
 * No dedicated ritual object artwork exists yet (docs/ASSET-PLAN.md §D is a
 * future Level-2 deliverable) — logged as an asset gap in
 * docs/ASSET-PLAN-IMPLEMENTATION.md rather than blocking. Visual treatment
 * is a restrained CSS glow, never a unicode/emoji icon
 * (docs/03_VISUAL_BIBLE.md's forbidden patterns).
 */
export function RitualCard({ title, subtitle, onOpen }: RitualCardProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex min-w-[240px] shrink-0 flex-col gap-4 rounded-card border border-border-subtle bg-[var(--glass-surface)] p-6 text-left backdrop-blur-[var(--glass-blur)] transition-transform duration-ui ease-premium hover:-translate-y-1 hover:border-gold-primary/40 sm:min-w-0 sm:shrink"
    >
      <div
        aria-hidden="true"
        className="h-10 w-10 rounded-full bg-[radial-gradient(circle,var(--gold-secondary)_0%,transparent_70%)] opacity-70 transition-opacity duration-ui ease-premium group-hover:opacity-100"
      />
      <div className="flex flex-col gap-1">
        <h3 className="font-serif text-card-title text-ink-primary">{title}</h3>
        <p className="text-body text-ink-muted">{subtitle}</p>
      </div>
    </button>
  );
}
