# Spirit Guide V5 — QA and Acceptance Criteria

## Engineering gate for every phase
- TypeScript/typecheck passes.
- Lint passes.
- Relevant automated tests pass.
- Production build passes.
- No unexplained console errors or hydration warnings.
- No broken assets or route errors.
- Cleanup verified for GSAP/audio/timers/listeners.

## Responsive gate
Check at minimum:
- 390px
- 430px
- 768px
- 1024px
- 1280px
- 1440px
- 1728px+

No horizontal overflow. Mobile must be art-directed, not merely scaled desktop.

## Accessibility gate
- Semantic headings and landmarks.
- Keyboard access to every interactive control.
- Visible focus-visible states.
- Correct labels for icon-only controls.
- Touch targets around 44px minimum.
- No autoplay sound.
- Reduced-motion version remains complete and understandable.
- Meditation state understandable without relying solely on animation or colour.

## Hero visual gate
- One obvious focal point.
- Buddha fully visible and unobstructed.
- Left-side copy zone remains readable.
- Gold remains restrained.
- Camera illusion feels like entering the environment, not enlarging a statue.
- There is a meaningful period of visual silence.
- Handoff into Temple Mode feels continuous.

## Motion gate
- No bounce/elastic/cartoon springs.
- Scroll remains under user control.
- Pinning is selective and meaningful.
- Animations do not fight over transforms.
- No excessive blur/filter cost.
- Offscreen ambient effects paused where practical.

## Product/content gate
- No fake statistics.
- No fake social proof.
- No invented quotes attributed to Buddha.
- Journal/intention prototype persistence is clearly local until backend approval.
- No fake auth/payment behaviour.

## Target quality
Aim for 90+ across mobile, accessibility, performance and interaction; 95-level craft for art direction, hero and Temple Mode.
