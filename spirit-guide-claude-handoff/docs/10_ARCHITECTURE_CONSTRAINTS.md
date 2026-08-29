# Spirit Guide V5 — Architecture Constraints

## Suggested source structure
- `app/`
- `components/navigation/`
- `components/gateway/`
- `components/highlights/`
- `components/rituals/`
- `components/guide/`
- `components/temple/`
- `components/meditation/`
- `components/wisdom/`
- `components/journal/`
- `components/intention/`
- `components/sanctuary/`
- `components/motion/`
- `components/ui/`
- `lib/motion/`
- `lib/audio/`
- `lib/storage/`
- `lib/content/`
- `hooks/`
- `types/`
- `styles/`

## State domains
Keep state deliberate:
- Navigation.
- Guide Me selection.
- Meditation configuration/timer.
- Temple ritual state.
- Sound state.
- Journal prototype state.
- Intention prototype state.
- Sanctuary preview state.

Use local React state for local concerns. Use Context/Zustand only when cross-component state genuinely requires it. Do not introduce Redux without demonstrated need.

## Persistence
Prototype journal/intention/preferences may use localStorage, but only behind a storage/service abstraction in `lib/storage`. Do not scatter direct localStorage calls throughout presentation components.

## Media
Use Next/Image/responsive media where appropriate. Keep real HTML/UI separate from image artwork. Hero should support later replacement of a flat Level-1 image with Level-2 planes without redesigning the whole component.

## Performance
Prioritise transform/opacity. Avoid layout-thrashing scroll animation. Keep dynamic imports for expensive experiences. Preload hero only. Pause ambient work offscreen where practical.

## Audio
Never autoplay. Explicit user interaction required. Ensure teardown when leaving relevant experience. Timer/audio state must behave sensibly across visibility changes.

## Future backend
Supabase/auth/CMS/Stripe are intentionally deferred. Do not create fake cloud persistence, fake login or fake payments in front-end phases.
