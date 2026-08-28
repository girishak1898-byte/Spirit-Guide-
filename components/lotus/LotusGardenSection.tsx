import { Container } from "@/components/ui/Container";
import { TextReveal } from "@/components/motion/TextReveal";

/**
 * "A cinematic environmental transition... slow down the scrolling
 * experience" (docs/01_SPIRIT_GUIDE_V4_MASTER_BRIEF.md §23) — deliberately
 * NOT a pinned/scrubbed scene: this phase forbids new GSAP/ScrollTrigger,
 * and the brief's own intent ("slow down") is served just as well by a
 * quiet in-flow section with generous vertical space and a single
 * unhurried reveal. No dedicated night-garden artwork exists yet —
 * restrained CSS/token treatment, same pattern as every other deferred
 * scene this project.
 */
export function LotusGardenSection() {
  return (
    <section
      id="lotus-garden"
      className="relative flex min-h-[70vh] items-center justify-center overflow-hidden border-t border-border-subtle bg-bg-primary-1 py-32"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, var(--surface-elevated-2) 0%, var(--bg-primary-1) 70%)",
        }}
      />
      <Container className="relative z-content flex flex-col items-center gap-4 text-center">
        <TextReveal as="h2" className="font-serif text-section-title text-ink-primary">
          Return to stillness.
        </TextReveal>
        <TextReveal delay={0.15} as="p" className="max-w-md text-body italic text-ink-secondary">
          What are you ready to let settle?
        </TextReveal>
      </Container>
    </section>
  );
}
