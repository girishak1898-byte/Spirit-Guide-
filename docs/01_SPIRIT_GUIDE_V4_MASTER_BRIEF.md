# Spirit Guide V4 — Midnight Sanctuary

## Master UI/UX + Functional Website Brief

### 1. Core product vision

**Spirit Guide** will be positioned as a premium digital sanctuary for meditation, reflection, rituals, contemplative wisdom and personal spiritual practice.

The visitor should not feel:

> “I opened another meditation website.”

The intended feeling is:

> “I entered somewhere.”

That distinction will drive every design decision.

The site will combine three qualities:

**Apple-level product polish** in spacing, animation, typography, transitions and confidence.

**Cinematic spiritual art direction** using immersive Buddha/shrine imagery, light, water, candles, incense, lotus flowers and temple architecture.

**Useful interactive product features** including meditation, rituals, wisdom, private intentions, journal and My Sanctuary.

The overall experience should feel **premium, calm, sacred, sophisticated and modern**, never cheap, cartoonish, overloaded with gold, or generic “wellness app”.

---

# 2. Final approved art direction

The approved design system is:

## A — Midnight Sanctuary

The base will be an almost-black **midnight navy**, not flat pure black and definitely not the current muddy brown.

Primary background tones will sit roughly around:

`#05090D`

`#071019`

`#0A121A`

These are blue-black midnight tones.

Large elevated surfaces will use slightly lighter values such as:

`#0D1720`

`#111D26`

The primary text will be **warm ivory rather than pure white**:

`#F4EFE5`

`#E9E0D1`

Champagne gold becomes an accent rather than the entire UI:

`#D7AE68`

`#E5C184`

Gold will primarily appear in borders, icons, active controls, focal CTAs and small decorative elements.

The secondary spiritual accent will be a restrained **jade / emerald**:

`#4C8B78`

`#6BA58E`

Jade will appear very sparingly in things such as guidance indicators, success states, lotus motifs and selected spiritual symbols.

Supporting neutrals will include slate, smoky blue and cool glass.

**No large brown surfaces.**

**No bright yellow buttons.**

**No gold on everything.**

Gold should feel expensive because it is scarce.

---

# 3. Typography system

Typography is one of the biggest things I am changing from V3.

The current site uses too much huge serif text.

The V4 system will use an elegant editorial serif for emotional statements and a refined modern sans-serif for product/UI information.

### Display typography

Used for major spiritual/emotional statements:

**Examples**

-  “A sanctuary for the inner life.” 
-  “Time becomes spacious again.” 
-  “Return to yourself.” 
-  “Nothing to achieve.” 

These headings will have generous letter spacing, controlled line heights and smaller sizes than V3.

Desktop hero headline will generally sit around **64–82 px**, not 100–120 px.

Section headings around **42–56 px**.

Mobile headings around **36–48 px**.

### UI typography

Used for navigation, buttons, timers, labels, meditation controls, profile details, journal metadata and cards.

It will be cleaner, smaller and more modern.

The hierarchy will roughly be:

Eyebrow: 11–13 px

Body: 16–18 px

UI label: 13–15 px

Card title: 20–26 px

Section heading: 42–56 px

Hero: 64–82 px

The result should feel **editorial + product-grade**, not like a giant poster.

---

# 4. Overall page structure

The website will be designed as a continuous spiritual journey rather than a collection of unrelated sections.

The sequence will be:

1.  Temple Gateway / Hero 
2.  Ritual Actions 
3.  Guide Me 
4.  Temple Experience 
5.  Meditation Hall 
6.  Sound Sanctuary 
7.  Daily Wisdom 
8.  Reflection / Lotus Garden 
9.  Intention Sanctuary 
10.  Private Journal 
11.  My Sanctuary 
12.  Support the Sanctuary 
13.  Closing temple scene 
14.  Footer / trust / legal navigation 

Each section needs its own visual identity while still feeling like one environment.

---

# 5. Navigation

The desktop navigation will use a dark translucent midnight glass bar.

Left:

**Spirit Guide symbol + SPIRIT GUIDE**

The logo will be larger and more authoritative than the V3 logo.

Center/right navigation:

**Temple**

**Meditate**

**Wisdom**

**Rituals**

**Journal**

**My Sanctuary**

Primary CTA:

**Enter Temple**

The button will use champagne-gold illumination rather than bright yellow.

The navigation will have a subtle border and glass blur.

On scroll, it will become slightly more opaque.

Active sections can receive a small champagne or jade indicator.

### Mobile navigation

Mobile will not simply shrink desktop navigation.

It will contain:

Spirit Guide logo

hamburger icon

Opening the menu will reveal a full-height elegant midnight navigation panel with:

Temple

Meditate

Wisdom

Rituals

Journal

My Sanctuary

and a prominent:

**Enter Temple**

button.

---

# 6. Hero — Temple Gateway

This is the most important part of the entire website.

We will reproduce the structure and feeling of the approved **Midnight Sanctuary concept**, but improve it further.

The hero scene will use a purpose-built cinematic image featuring:

-  centred Buddha 
-  dark temple architecture 
-  deep perspective 
-  candlelight 
-  lotus flowers 
-  subtle water reflection 
-  warm light behind the Buddha 
-  darker foreground 
-  small jade accents 
-  incense smoke 
-  distant hanging lanterns 
-  architectural columns 
-  subtle depth haze 
-  premium film-like contrast 

The Buddha must remain clearly visible and should never be awkwardly cropped.

The image should ideally be generated/rendered around **3000–4000 px wide** so it remains sharp on Retina displays.

### Hero composition

Left side:

Small eyebrow:

**WELCOME HOME**

Main title:

**A sanctuary**
**
for the inner life.**

Supporting copy:

Something along the lines of:

“Ancient wisdom for modern life. Rituals, meditation and reflection designed to help you return to what is real.”

Primary CTA:

**Enter Temple**

Secondary CTA:

**Begin Meditation**

The text will occupy approximately 35–40% of the hero.

The Buddha and temple remain the focal point in the centre.

### Right-side spiritual note

Instead of the large clunky Daily Wisdom box from V3, there will be a smaller elegant floating glass element.

Potential content:

small jade spiritual symbol

“May all beings be happy and at peace.”

or an original contemplative line.

This element should feel decorative and atmospheric rather than like an advert panel.

---

# 7. Hero environmental effects

The hero will not be a static image only.

Very subtle effects will include:

floating dust particles

slow incense smoke

very small candle flame movement

gentle light shimmer

extremely subtle mouse/parallax depth on desktop

slow reflection movement on water

possibly lantern glow breathing

The motion must remain extremely slow.

The goal is atmosphere, not a video game.

Visitors with **Reduce Motion** enabled will receive a static experience.

---

# 8. Hero loading behaviour

We will avoid the image problems seen previously.

The hero artwork will use proper image assets, not giant base64 CSS backgrounds.

We will provide:

WebP/AVIF versions

JPEG fallback

responsive `srcset`

mobile crop

desktop crop

2× Retina image

A blurred low-resolution placeholder can appear for a fraction of a second and transition into the high-resolution image.

The full-resolution file will never be stretched beyond its intended size.

---

# 9. Ritual Actions

Immediately beneath the main scene we will place five ritual cards.

These will not use basic unicode symbols.

Each receives a purpose-designed visual object.

### Light a Candle

Visual:

premium ivory candle

dark brass candle holder

small flame

lotus-shaped base

warm glow

Title:

**Light a Candle**

Subtitle:

“Bring light to your intention.”

Interaction:

click → small ritual experience.

User may type or silently choose an intention.

The candle ignites.

A short glow animation appears.

Optional subtle chime.

---

### Ring the Bell

Visual:

antique bronze temple bell.

Title:

**Ring the Bell**

Subtitle:

“Awaken presence and clarity.”

Interaction:

click bell.

Physical bell animation.

Real audio sample or premium synthesised bell.

Reverberation fades naturally.

---

### Offer Incense

Visual:

dark bronze incense bowl.

Thin curling smoke.

Title:

**Offer Incense**

Subtitle:

“Purify the space within.”

Interaction:

incense smoke increases slightly.

Reflection text appears.

---

### Offer Lotus

Visual:

white/ivory lotus with soft champagne centre.

Title:

**Offer Lotus**

Subtitle:

“Open the heart.”

Interaction:

lotus subtly opens.

A reflection or intention prompt appears.

---

### Reflection

Visual:

dark leather spiritual journal / engraved card / sacred manuscript rather than a crystal-ball aesthetic.

Title:

**Reflection**

Subtitle:

“Write. Observe. Integrate.”

Clicking takes the visitor to Daily Wisdom or Journal.

---

# 10. Ritual card styling

Cards will use:

deep navy-black

very subtle glass

1 px champagne border at low opacity

soft internal shadows

25–30 px corner radius

premium 3D objects

slow hover elevation

Hover behaviour:

object shifts upward 2–4 px

border becomes slightly brighter

light glow increases

CTA arrow moves a few pixels

No excessive glow.

---

# 11. Guide Me

This section asks:

**What do you need today?**

Instead of an overwhelming grid, users can choose:

Restless

Anxious

Heavy

Scattered

Seeking Clarity

Each card will have a cinematic miniature environment.

For example:

Restless → moon/clouds

Anxious → mist/rain

Heavy → low stormy landscape

Scattered → forest light

Seeking Clarity → sunrise / mountains

Clicking one changes a guidance card beneath it.

Example:

**Restless**

Recommended:

**7-minute Longer Exhale**

Description:

“Slow the nervous system with a longer outward breath.”

CTA:

**Begin practice**

Choosing it automatically prepares the corresponding meditation duration.

---

# 12. Temple Experience preview

Section heading:

**Enter the sanctuary.**

The current “A place, not a dashboard” phrase can be removed.

This section will feature a wide cinematic temple image.

The image will show the sanctuary from the visitor's perspective.

Overlay content:

**Temple Mode**

“A private space for ritual, stillness and reflection.”

CTA:

**Enter Temple Mode**

Secondary text:

“No account required.”

---

# 13. Full-screen Temple Mode

Temple Mode will become the signature experience.

This is where Spirit Guide should become memorable.

The screen becomes completely immersive.

### Visual composition

Top-left:

Spirit Guide logo.

Top-right:

**Close ×**

Center:

Buddha sanctuary unobstructed.

Left/lower-left:

Current ritual title and guidance.

Bottom:

Floating ritual dock.

### Ritual dock

Four/five elegant buttons:

Candle

Bell

Incense

Lotus

Reflection

Icons will match the objects used elsewhere.

The dock will have translucent midnight glass.

---

# 14. Temple Mode atmosphere

Potential subtle animations:

candle flames

incense trails

floating particles

very slight shrine light pulses

water reflection

soft vignette

Temple audio can be optional.

We will never auto-play sound.

A small sound control can appear:

Sound On / Off.

---

# 15. Temple Mode states

Default:

**Nothing to achieve.**

Supporting:

“Stay for one breath or as long as you need.”

Candle:

**Light a candle.**

“Name one intention without needing to explain it.”

Bell:

**Ring the bell.**

“Listen until the sound becomes silence.”

Incense:

**Offer incense.**

“Let gratitude rise without words.”

Lotus:

**Offer a lotus.**

“Open toward what you are ready to receive.”

Reflection:

original reflection appears.

No invented quote will be attributed to Buddha.

---

# 16. Meditation Hall

The visual should be significantly stronger than V3.

The main image will be a dark midnight temple hall with:

circular meditation platform

mandala flooring

Buddha in background

candle pathways

soft jade plants

deep blue atmospheric lighting

The breathing visual sits in the centre.

---

# 17. Meditation breathing interface

Instead of a simple white circle, we will use a layered breathing mandala.

Structure:

outer circular halo

champagne ring

faint jade ring

inner midnight sphere

Breath state:

**INHALE**

4

**HOLD**

2

**EXHALE**

6

The circle expands slowly on inhale.

Stops during hold.

Contracts during exhale.

---

# 18. Meditation durations

Controls:

3 min

7 min

12 min

20 min

Potential later additions:

30 min

Custom

The selected duration gets a champagne ring.

Others stay dark.

Primary CTA:

**Begin Meditation**

During meditation:

button becomes **Pause**

Timer visible.

Example:

`06:42`

Progress ring gradually completes.

---

# 19. Meditation types

Eventually users should be able to select:

Breath awareness

Body scan

Stillness

Compassion

Sleep

Clarity

Anxiety relief

Morning practice

Evening practice

Version 1 does not need every category fully populated, but the architecture should support them.

---

# 20. Sound Sanctuary

The visitor can choose an optional ambient soundscape.

Choices:

Temple

Rain

Forest

Singing bowls

River

Silence

Each option receives a small illustrated thumbnail.

Controls:

volume

play/pause

sound selector

Audio should loop smoothly.

No sound starts automatically.

---

# 21. Daily Wisdom

This section should no longer look like an ordinary card.

We will design it like an illuminated contemplative object.

Possible implementation:

dark ivory manuscript

antique paper

soft gold edge

floating page

subtle glow

Headline:

**Read once.**
**
Sit with it.**

Below:

daily contemplation.

CTA:

**Another reflection**

or

**Read today’s wisdom**

---

# 22. Wisdom content policy

We must be careful about religious authenticity.

Original reflections will be labelled something such as:

**Spirit Guide Reflection**

Verified Buddhist teachings may be labelled:

**Teaching**

If a quote is attributed to Buddha, a reputable source must be verified.

We will not publish invented Buddha quotations.

---

# 23. Lotus Garden / Reflection Space

A cinematic environmental transition.

Visual:

night garden

dark water

lotus flowers

stone path

small lanterns

distant temple

subtle emerald foliage

Purpose:

slow down the scrolling experience.

Copy may be minimal.

For example:

**Return to stillness.**

The section may provide one reflective question.

---

# 24. Intention Sanctuary

The intention section should feel ceremonial.

Headline:

**Place one thing here with care.**

Input placeholder:

“May I meet today with…”

Character limit:

180.

CTA:

**Place Intention**

On save:

small lotus/light animation.

Feedback:

**Your intention has been placed.**

In prototype mode, it remains local to the browser.

Once accounts exist, it can be securely saved to the user profile.

---

# 25. Private Journal

This section should be more editorial than Intention Sanctuary.

Visual inspiration:

dark leather notebook

ivory paper surface

warm lamp

small jade bookmark

Headline:

**Write without performing.**

Textarea:

large and comfortable.

Word/character count.

CTA:

**Save Reflection**

Future features:

journal archive

search

favourite entries

tags

mood

private encryption strategy

---

# 26. My Sanctuary

This is a major feature.

It should no longer resemble a spreadsheet/dashboard.

It will feel like the user's **private spiritual room**.

Headline:

**Your personal spiritual home.**

The interface can show four visual objects.

### Practice

Meditation symbol.

Displays:

last practice

minutes

recent streak only if we decide not to use anxiety-inducing streaks.

I currently recommend **no traditional streak pressure**.

### Intention

Lantern / scroll symbol.

Displays active intention.

### Journal

Book symbol.

Displays:

recent reflection

entries saved.

### Wisdom

Lotus/manuscript.

Displays saved contemplations.

---

# 27. My Sanctuary account states

Logged out:

**Create your Sanctuary**

Supporting text explaining benefits.

Buttons:

Create account

Sign in

Logged in:

avatar / initials

practice summary

saved intentions

journal

saved teachings

---

# 28. Authentication

Future production accounts can support:

Email

Google

Apple

Possibly magic-link login.

No unnecessary onboarding.

User flow:

Create account → email confirmation → optional display name → sanctuary.

---

# 29. Support the Sanctuary

Instead of aggressive donation UI, this will be respectful.

Headline:

**Help keep the sanctuary open.**

Options could include:

One-time offering

£5

£10

£25

Custom

Later:

monthly sanctuary supporter membership.

We must clearly separate voluntary support from access to essential spiritual content.

Payments would likely use Stripe.

No fake payments will be shown during prototype testing.

---

# 30. Membership concept

Possible future membership:

**Sanctuary Member**

May include:

full guided meditation library

saved cross-device journal

saved intentions

premium soundscapes

longer meditation programmes

offline audio

exclusive teachings

live events

Core free access should still include meaningful value.

---

# 31. Closing scene

The page should not simply stop after a card.

It will end with another beautiful cinematic sanctuary environment.

Possible image:

Buddha/shrine reflected in dark water.

Copy:

**The door stays open.**

or

**You are always welcome here.**

Supporting:

“Return whenever you need.”

CTA:

**Enter Temple**

---

# 32. Footer

The footer will remain subtle.

Left:

Spirit Guide logo.

Statement:

“A digital sanctuary for modern life.”

Navigation:

Temple

Meditate

Wisdom

Journal

My Sanctuary

Legal:

Privacy

Terms

Accessibility

Cookies

Contact

Copyright.

No clutter.

---

# 33. Microinteraction system

Interactions will be extremely refined.

Buttons:

1–2 px elevation

slight highlight

subtle gold shift

Cards:

tiny perspective/depth response.

Navigation:

smooth active indicator.

Images:

very slight scale only when useful.

Ritual objects:

small physical motion.

Page transitions:

slow fade / translate.

Scroll reveals:

250–500 ms.

Nothing should bounce or feel playful.

---

# 34. Cursor effects

Desktop may include an extremely subtle pointer enhancement over immersive areas.

For example:

small champagne ring.

But it should never interfere with standard cursor usability.

On buttons, keep the standard pointer.

---

# 35. Scroll behaviour

Scroll will remain natural.

No aggressive scroll-jacking.

Cinematic sections may use sticky positioning selectively.

Example:

Meditation Hall visual remains fixed while the practice explanation moves.

Temple Gateway may contain subtle parallax.

---

# 36. Mobile UX

Mobile is a first-class design.

Hero becomes:

image

headline

description

two CTAs

Ritual cards become horizontally scrollable or a 2-column layout.

Temple Mode becomes full-screen.

Ritual dock can become bottom-fixed.

Meditation ring becomes smaller but remains fully visible.

Journal becomes single-column.

My Sanctuary becomes stacked cards.

Touch targets minimum approximately 44 px.

---

# 37. Tablet UX

Tablet gets its own breakpoint.

Not simply desktop shrunk.

The navigation may become compact.

Hero can retain two-column composition at larger tablet sizes.

Cards will move into 2–3 column grids depending on width.

---

# 38. Accessibility

We will build toward WCAG AA.

Requirements include:

keyboard navigation

visible focus states

proper labels

semantic HTML

alt text

sufficient contrast

reduced motion support

screen-reader announcements

touch-friendly controls

no audio autoplay

Meditation animation must still be understandable without visual motion.

---

# 39. Image production pipeline

All important images will be purpose-created.

We will not randomly pull unrelated temple photos again.

The image library will include:

Hero Sanctuary

Temple Mode

Meditation Hall

Lotus Garden

Journal scene

Wisdom manuscript

My Sanctuary room

Support scene

Individual ritual assets:

Candle

Bell

Incense bowl

Lotus

Journal / reflection object

---

# 40. Image quality standards

Hero:

\~3000–4000 px.

Full-screen Temple:

\~3000–4000 px.

Section imagery:

\~2000–3000 px.

Cards:

\~1000–1600 px.

Formats:

AVIF preferred

WebP fallback

JPEG fallback where necessary

Responsive image loading.

No massive uncompressed PNGs in production unless transparency is needed.

---

# 41. Performance

Despite being image-rich, the site should feel fast.

Strategies:

image compression

responsive sources

lazy loading

preload hero only

defer below-fold assets

code splitting

minimal JavaScript

CDN delivery

font subsetting/loading optimisation

Target goals:

LCP ideally under 2.5 seconds on good connections.

Minimal layout shift.

Smooth 60 fps animations where possible.

---

# 42. Technology architecture

For production I recommend moving beyond a single HTML prototype.

Frontend:

**Next.js + React**

Styling:

CSS modules / Tailwind or a carefully structured design token system.

Animation:

Framer Motion and CSS.

Selective advanced scenes:

Three.js only if the added value justifies the performance cost.

I do **not** recommend building the entire website as WebGL.

---

# 43. Real 3D strategy

There are two types of “3D” we can use.

Most pages:

high-quality rendered 3D visuals.

Temple Mode:

possibly real selective 3D/WebGL enhancements.

For example:

particle depth

light movement

small foreground lotus layers

camera parallax

Full real-time 3D Buddha rendering would significantly increase complexity and performance requirements.

I recommend **cinematic rendered 3D + selective WebGL enhancement**.

That gives approximately 90% of the visual effect with far less risk.

---

# 44. Backend architecture

When we reach backend development we will create a dedicated Spirit Guide environment.

Likely services:

Supabase or equivalent.

Tables could include:

users

profiles

meditations

meditation\_sessions

journal\_entries

intentions

wisdom\_content

saved\_wisdom

subscriptions

donations

Nothing will reuse unrelated databases.

---

# 45. Content management system

An admin CMS will eventually allow us to manage:

meditations

wisdom posts

reflections

audio

featured practices

daily guidance

homepage content

ritual messages

Admin roles:

Owner

Editor

Content Manager

---

# 46. Admin dashboard

Potential sections:

Dashboard

Meditations

Wisdom

Audio

Users

Supporters

Content

Analytics

This will be private and separate from the main sanctuary UI.

---

# 47. Meditation content model

Each meditation should include:

title

slug

description

duration

category

difficulty

audio file

narrator

background sound

transcript

image

benefits

tags

published status

---

# 48. Audio system

Guided meditation audio should be real high-quality audio.

Player controls:

play

pause

seek

volume

elapsed time

remaining time

background ambience

Potential voice option:

guided / silent.

---

# 49. Search

Later, Meditation and Wisdom areas can include search.

Search fields:

title

topic

duration

mood

Filters:

3–5 min

5–10 min

10–20 min

20+ min

---

# 50. Analytics

We should measure meaningful behaviour rather than vanity metrics.

Examples:

Temple entries

meditation starts

meditation completions

duration selected

ritual used

journal saved

intention saved

return visits

account creation

support conversion

We should avoid invasive tracking.

---

# 51. Privacy

Journal and intention data are highly personal.

We must treat them carefully.

Prototype:

localStorage only.

Production:

secure authenticated storage.

Privacy documentation should explicitly state:

what is stored

why

where

how long

how deletion works

Journal content should never be used casually for advertising or unrelated profiling.

---

# 52. SEO

Public pages will include:

structured metadata

semantic titles

OG images

canonical URLs

XML sitemap

robots directives

structured data

Potential public content:

Meditation library

Wisdom articles

About Spirit Guide

Private Sanctuary content will not be indexed.

---

# 53. PWA capability

Later Spirit Guide could function like an app.

Features:

Add to Home Screen

offline shell

saved recent meditations

push reminders if explicitly enabled

But I would not put this ahead of core quality.

---

# 54. Error handling

404 page will remain spiritual rather than technical.

Example:

**This path has gone quiet.**

CTA:

Return to Sanctuary.

Offline message:

**The sanctuary is temporarily unreachable.**

Retry button.

---

# 55. Loading experience

Instead of generic spinning circles, loading states can use:

small lotus

soft breathing ring

minimal golden line

Loading should never delay content unnecessarily.

---

# 56. Empty states

Examples:

No journal entries:

**Nothing written yet.**

“Begin with one honest sentence.”

No intention:

**No intention placed.**

“Place what matters here.”

No saved wisdom:

**Your collection is quiet.**

“Save a reflection when one speaks to you.”

---

# 57. Notifications

No aggressive popups.

Potential notifications:

Meditation complete

Reflection saved

Intention placed

These should be small, elegant toast messages.

---

# 58. Content tone

Tone must be:

calm

intelligent

warm

respectful

concise

grounded

Avoid:

fake mysticism

overpromising

“transform your life instantly”

religious manipulation

gamification pressure

---

# 59. Things we are deliberately removing from V3

The following are **not carrying forward**:

muddy brown overlay everywhere

oversized typography

random temple photography

bright yellow-gold buttons

basic unicode ritual icons

flat generic cards

Temple Mode text covering the Buddha

cheap-looking breathing circle

identical Journal/Intentions cards

conventional dashboard-like My Sanctuary

fake statistics

unverified Buddha quotations

huge empty dark areas without purpose

---

# 60. Design token system

We will formalise the design into reusable tokens.

Tokens will cover:

background colours

surface colours

text colours

champagne accent

jade accent

error/success colours

border opacity

blur

shadow

radius

spacing

typography

animation timing

This ensures the site remains visually consistent.

---

# 61. Spacing system

Instead of arbitrary spacing, we will use a controlled scale.

Example:

4

8

12

16

24

32

48

64

96

128 px

Large cinematic sections get more spacing.

Functional sections get tighter spacing.

---

# 62. Border-radius system

Buttons:

999 px or 14–18 px depending type.

Cards:

20–28 px.

Large environments:

28–36 px.

Input fields:

14–18 px.

We will reduce the “everything is rounded” effect.

---

# 63. Shadow system

Shadows will be mostly dark atmospheric shadows.

Gold glow is used only on selected elements.

Typical card:

large soft black shadow.

Active CTA:

small champagne halo.

No neon.

---

# 64. Glass system

Glass is part of Midnight Sanctuary but used selectively.

Good places:

navigation

wisdom floating element

Temple Mode dock

modal overlays

Not every card should use heavy blur.

Otherwise the whole site becomes muddy again.

---

# 65. QA standards

Before I ask you to approve the final website, I would test:

Desktop Safari

Desktop Chrome

Desktop Edge

iPhone Safari

Android Chrome

Tablet layouts

And widths approximately:

390

430

768

1024

1280

1440

1728+ px

---

# 66. Interaction QA

Every action will be tested:

navigation

Temple Mode

close Temple Mode

candle ritual

bell

incense

lotus

reflection

Guide Me

meditation duration

start

pause

completion

sound selection

journal save

intention save

My Sanctuary updates

login state eventually

support flow eventually

---

# 67. Visual approval process

You will approve the project in stages.

**Stage 1 — visual system**

Colour

Typography

Hero

Navigation

**Stage 2 — core sanctuary**

Temple Mode

Rituals

Meditation

**Stage 3 — personal experience**

Wisdom

Journal

Intentions

My Sanctuary

**Stage 4 — responsive**

Desktop

Tablet

Mobile

Only after you approve these do we call the UI **final**.

---

# 68. Development sequence

The implementation should happen in this order:

**Phase 1 — Design system**

Midnight palette

typography

spacing

buttons

cards

navigation

**Phase 2 — Cinematic environments**

Hero

Temple Mode

Meditation Hall

Lotus Garden

**Phase 3 — Core interactions**

Rituals

breathing

meditation timer

audio

**Phase 4 — Personal tools**

Guide Me

Wisdom

Journal

Intentions

My Sanctuary

**Phase 5 — Responsive polish**

Desktop

mobile

tablet

**Phase 6 — Backend**

accounts

storage

CMS

audio management

**Phase 7 — Monetisation**

payments

support

memberships

**Phase 8 — Launch QA**

performance

accessibility

SEO

security

analytics

---

# 69. Quality bar

I do not want to call the next build finished just because it works.

For final approval, Spirit Guide should achieve approximately:

| AreaTarget         |               |
| ------------------ | ------------- |
| Art direction      | **95/100**    |
| Colour system      | **95/100**    |
| Typography         | **92/100**    |
| Hero experience    | **95/100**    |
| Temple Mode        | **95/100**    |
| Meditation UX      | **92/100**    |
| Mobile design      | **90+/100**   |
| Interaction polish | **90+/100**   |
| Performance        | **90+/100**   |
| Accessibility      | **90+/100**   |
| Overall UI/UX      | **90–95/100** |