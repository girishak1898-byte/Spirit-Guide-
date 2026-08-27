# DESIGN-SYSTEM.md — Midnight Sanctuary

All values below become CSS custom properties in `styles/tokens.css`. No component may hard-code
a raw hex, px spacing, or duration that duplicates a token — if a value is needed twice, it
belongs here.

Confirmed against the official `03_VISUAL_BIBLE.md`: palette, typography scale, and the corrected
card radius (20–28px, §4 below) all match exactly. No rework needed from that cross-check.

## 1. Color Tokens

```css
:root {
  /* Backgrounds — subtle tonal variation, never pure black */
  --bg-primary-1: #05090D;
  --bg-primary-2: #071019;
  --bg-primary-3: #0A121A;
  --surface-elevated-1: #0D1720;
  --surface-elevated-2: #111D26;

  /* Text */
  --ink-primary: #F4EFE5;   /* warm ivory */
  --ink-secondary: #E9E0D1;
  --ink-muted: color-mix(in srgb, var(--ink-secondary) 55%, var(--bg-primary-2)); /* derived, never a generic grey */

  /* Champagne gold — SCARCE. Borders, active controls, major CTA highlight, ritual symbols, tiny decorative details. */
  --gold-primary: #D7AE68;
  --gold-secondary: #E5C184;

  /* Jade — EVEN SCARCER. Guidance state, spiritual symbol accents, selected status, success feedback. */
  --jade-primary: #4C8B78;
  --jade-secondary: #6BA58E;

  /* Semantic (derived from the above, not generic red/green) */
  --state-success: var(--jade-primary);
  --state-error: #B4644F; /* muted warm red, never bright/alarm red */

  /* Borders / glass */
  --border-subtle: rgba(244, 239, 229, 0.08);
  --border-gold: rgba(215, 174, 104, 0.35);
  --glass-surface: rgba(13, 23, 32, 0.6);
  --glass-blur: 16px;
}
```

**Usage discipline (hard rule):** gold covers at most one focal element per viewport — a CTA
border, one active state, one small symbol. If more than ~5% of a scene's visible surface reads
as gold, that scene fails visual QA. Jade appears even more rarely than gold — treat it as an
accent reserved for guidance/success moments, never a background wash.

## 2. Typography

Two families:
- **Editorial serif** — emotional statements, hero copy, major section statements, contemplative
  wisdom. Feeling: quiet, timeless, editorial, sophisticated. (Exact typeface selection happens
  in Phase 1 implementation — candidates: a licensed or variable serif with genuine old-style
  figures, not a default system serif.)
- **Modern sans** — navigation, body, labels, buttons, timers, forms, metadata, controls.

```css
:root {
  --font-serif: "TBD-Editorial-Serif", Georgia, serif;
  --font-sans: "TBD-Modern-Sans", -apple-system, "Segoe UI", sans-serif;

  --text-eyebrow: clamp(11px, 0.9vw, 13px);
  --text-ui-label: clamp(13px, 1vw, 15px);
  --text-body: clamp(16px, 1.1vw, 18px);
  --text-card-title: clamp(20px, 2vw, 26px);
  --text-section-title: clamp(42px, 5vw, 56px);
  --text-hero: clamp(64px, 7.5vw, 82px);

  /* mobile hero override applied via matchMedia / container query, target ~36–48px */
}
```

Rule: hero and section-title sizes always use `clamp()` — never a fixed px value duplicated per
breakpoint. Never scale a heading above the `--text-hero` ceiling regardless of viewport width
(ultrawide must not produce a 140px headline).

## 3. Spacing

Base scale (functional UI): `4, 8, 12, 16, 24, 32, 48, 64, 96, 128` → tokens `--space-1` …
`--space-10` in that order. Cinematic/full-bleed sections may use fluid values derived from
viewport height (`clamp()`/`svh`-based), but functional UI (forms, controls, cards) always pulls
from this fixed scale — never an arbitrary one-off value.

## 4. Radius, Shadow, Glass

Corrected against `01_SPIRIT_GUIDE_V4_MASTER_BRIEF.md` §62 — the official brief specifies a
larger, more deliberate radius system than Phase 1 shipped with (see §10 gap note below):

```css
:root {
  --radius-button: 16px;   /* or 999px for a pill CTA — brief allows either per §62 */
  --radius-button-pill: 999px;
  --radius-input: 16px;    /* 14–18px range */
  --radius-card: 24px;     /* 20–28px range */
  --radius-environment: 32px; /* 28–36px range, large cinematic containers */
  --shadow-elevated: 0 8px 24px rgba(0,0,0,0.35);
  --shadow-focus: 0 0 0 2px var(--bg-primary-1), 0 0 0 4px var(--gold-primary);
}
```

**Resolved:** `Button.tsx` now uses `rounded-button` (16px, `--radius-button`);
`tailwind.config.ts` and `styles/tokens.css` expose the full named scale
(`focus`/`button`/`pill`/`input`/`card`/`environment`). `Container.tsx` intentionally has no
radius — it's a full-bleed layout wrapper, not a card. Re-verified with typecheck/lint/tests/
build/responsive/keyboard/reduced-motion after the change — all still pass.

Glassmorphism is restrained and purposeful: only the navigation bar (post-scroll), Temple Mode's
ritual dock, and modal/menu surfaces use `--glass-surface` + `--glass-blur`. It is never a default
card treatment — the brief explicitly rejects "excessive glassmorphism" and "generic wellness
templates."

## 5. Motion Tokens

Duration and easing tokens are defined once here and consumed by both `lib/motion` (GSAP) and
Framer Motion config — see `MOTION-SPEC.md` for the full ownership rules and the hero storyboard.
Summary:

```css
:root {
  --duration-micro: 200ms;   /* 150–250ms range */
  --duration-ui: 350ms;      /* 250–450ms range */
  --duration-editorial: 800ms; /* 600–1000ms range */
  --duration-cinematic: 1500ms; /* 1000–1800ms / 1200-2200ms range */
  --ease-premium: cubic-bezier(0.16, 1, 0.3, 1);
}
```

## 6. Z-Index Scale

```css
:root {
  --z-base: 0;
  --z-ambient: 10;      /* atmospheric overlays within a scene */
  --z-content: 20;       /* normal in-flow content */
  --z-nav: 100;
  --z-mobile-menu: 200;
  --z-temple-mode: 300;  /* immersive overlay */
  --z-modal: 400;
  --z-toast: 500;
}
```

## 7. Component Token Notes

- **Buttons:** primary CTA = gold border/fill treatment (scarce, one per view), secondary = ivory
  text on transparent/outline, no bright fill colors outside the gold/jade/ivory system.
- **Focus states:** always visible, always uses `--shadow-focus` — never suppressed for aesthetic
  reasons.
- **Icons/ritual objects:** never Unicode/emoji; purpose-built SVG or image assets living under
  `public/assets/`, sized and colored via tokens.

## 8. Reject List (design-level, mirrors `01_SPIRIT_GUIDE_V4_MASTER_BRIEF.md` §59)

Muddy brown overlays · bright yellow buttons · gold covering large surface areas · purple SaaS
gradients · neon · generic glassmorphism as a default card style · stock yoga/wellness imagery ·
cartoon spirituality · fake glowing magical objects · excessive particles · excessive rounded
"bubbly" containers · gradients added purely to fill empty space.
