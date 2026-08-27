import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-primary-1": "var(--bg-primary-1)",
        "bg-primary-2": "var(--bg-primary-2)",
        "bg-primary-3": "var(--bg-primary-3)",
        "surface-elevated-1": "var(--surface-elevated-1)",
        "surface-elevated-2": "var(--surface-elevated-2)",
        "ink-primary": "var(--ink-primary)",
        "ink-secondary": "var(--ink-secondary)",
        "ink-muted": "var(--ink-muted)",
        "gold-primary": "var(--gold-primary)",
        "gold-secondary": "var(--gold-secondary)",
        "jade-primary": "var(--jade-primary)",
        "jade-secondary": "var(--jade-secondary)",
        "state-success": "var(--state-success)",
        "state-error": "var(--state-error)",
        "border-subtle": "var(--border-subtle)",
        "border-gold": "var(--border-gold)",
      },
      fontFamily: {
        serif: ["var(--font-serif)"],
        sans: ["var(--font-sans)"],
      },
      fontSize: {
        eyebrow: "var(--text-eyebrow)",
        "ui-label": "var(--text-ui-label)",
        body: "var(--text-body)",
        "card-title": "var(--text-card-title)",
        "section-title": "var(--text-section-title)",
        hero: "var(--text-hero)",
      },
      spacing: {
        1: "var(--space-1)",
        2: "var(--space-2)",
        3: "var(--space-3)",
        4: "var(--space-4)",
        5: "var(--space-5)",
        6: "var(--space-6)",
        7: "var(--space-7)",
        8: "var(--space-8)",
        9: "var(--space-9)",
        10: "var(--space-10)",
      },
      borderRadius: {
        focus: "var(--radius-focus)",
        button: "var(--radius-button)",
        pill: "var(--radius-button-pill)",
        input: "var(--radius-input)",
        card: "var(--radius-card)",
        environment: "var(--radius-environment)",
      },
      boxShadow: {
        elevated: "var(--shadow-elevated)",
        focus: "var(--shadow-focus)",
      },
      transitionTimingFunction: {
        premium: "var(--ease-premium)",
      },
      transitionDuration: {
        micro: "var(--duration-micro)",
        ui: "var(--duration-ui)",
      },
      zIndex: {
        base: "var(--z-base)",
        ambient: "var(--z-ambient)",
        content: "var(--z-content)",
        nav: "var(--z-nav)",
        "mobile-menu": "var(--z-mobile-menu)",
        "temple-mode": "var(--z-temple-mode)",
        modal: "var(--z-modal)",
        toast: "var(--z-toast)",
      },
    },
  },
  plugins: [],
};

export default config;
