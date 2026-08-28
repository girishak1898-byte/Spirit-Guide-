interface RitualCardProps {
  title: string;
  subtitle: string;
}

/**
 * Presentation-only per Phase 3 scope (docs/06_PHASE_GATES_AND_PROMPTS.md's
 * Phase 3: "ritual discovery" — not the functional Phase 4 Temple Mode
 * dock). A plain `<article>`, not a button: nothing here is clickable or
 * keyboard-operable yet, so it must not claim interactive semantics.
 *
 * No dedicated ritual object artwork exists yet (docs/ASSET-PLAN.md §D is a
 * future Level-2 deliverable) — logged as an asset gap in
 * docs/ASSET-PLAN-IMPLEMENTATION.md rather than blocking Phase 3. Visual
 * treatment is a restrained CSS glow, never a unicode/emoji icon
 * (docs/03_VISUAL_BIBLE.md's forbidden patterns).
 */
export function RitualCard({ title, subtitle }: RitualCardProps) {
  return (
    <article className="group flex min-w-[240px] shrink-0 flex-col gap-4 rounded-card border border-border-subtle bg-[var(--glass-surface)] p-6 backdrop-blur-[var(--glass-blur)] transition-transform duration-ui ease-premium hover:-translate-y-1 hover:border-gold-primary/40 sm:min-w-0 sm:shrink">
      <div
        aria-hidden="true"
        className="h-10 w-10 rounded-full bg-[radial-gradient(circle,var(--gold-secondary)_0%,transparent_70%)] opacity-70 transition-opacity duration-ui ease-premium group-hover:opacity-100"
      />
      <div className="flex flex-col gap-1">
        <h3 className="font-serif text-card-title text-ink-primary">{title}</h3>
        <p className="text-body text-ink-muted">{subtitle}</p>
      </div>
    </article>
  );
}
