# Spirit Guide V5 — Master Build Directive

## Role
Act as principal front-end engineer, creative technologist, UI/UX architect and motion engineer. Build a production-quality interactive experience, not a generic landing page.

## Product experience
Spirit Guide is a premium digital sanctuary for meditation, rituals, sound, contemplative wisdom, private intentions, journaling and a personal Sanctuary.

The experience progression is:
**Arrive → Enter → Discover → Temple → Breathe → Reflect → Belong → Return.**

## Presentation chapters
1. **Enter** — global nav, Temple Gateway, cinematic entry.
2. **Discover** — Inside the Sanctuary highlights, Guide Me, ritual discovery.
3. **Temple** — immersive Temple Mode and rituals.
4. **Breathe** — Meditation Hall and Sound Sanctuary.
5. **Reflect** — Daily Wisdom, Lotus Garden, Intention Sanctuary.
6. **Belong** — Private Journal, My Sanctuary.
7. **Return** — Support, closing sanctuary, footer.

All functional requirements from the V4 master brief remain in force.

## Apple-class principles in Spirit Guide's own identity
- One dominant idea per major viewport.
- Media and product demonstration lead; copy supports.
- Progressive disclosure instead of exposing everything at once.
- Scroll used as narrative navigation only where meaningful.
- Stillness between active sequences.
- Strong typography and ruthless hierarchy.
- Seamless scene handoffs where possible.
- Performance and accessibility are design requirements.

## Primary tech direction
- Next.js + React + TypeScript.
- Token-driven CSS/Tailwind.
- GSAP + ScrollTrigger for cinematic scroll.
- Motion/Framer Motion only for discrete UI presence/state changes.
- Native Web Audio or Howler for user-triggered audio.
- Three.js/WebGL only later if measurable visual value justifies it.
- Supabase/auth/backend deferred until front-end experience is approved.

## Do not build everything at once
Follow the phase boundaries in `06_PHASE_GATES_AND_PROMPTS.md`.
