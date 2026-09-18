# LearnerKits — Interactive Science Simulation Platform

A browser-based educational simulation platform built around **learn by experimenting, not memorizing**. The product opens as a general science gateway, then branches into six subject-specific learning areas with a calm academic light/dark theme.

## Current catalog

- **6 published subject areas**
- **71 simulations currently indexable**
- **71 simulations total**
- **12 SEO-priority simulations** surfaced as the first build/promote collection
- Light theme by default, plus Dark and System appearance modes
- Locale-aware routing for `en`, `es`, `zh`, `ar`, `pt`, `fr`, `ru`, `ja`, `de`

The original labs are retained. The published catalog currently contains 71 indexable simulations; verify the catalog count when adding or removing a lab.

## Subjects

### Space & Astronomy — 12 labs
Existing Moon Landing and Orbital Rescue plus Moon Phases 3D, Solar Eclipse 3D, Escape Velocity, Gravity Slingshot, Kepler's Laws Orbit, Earth Seasons & Tilt, Satellite Orbit Builder, Planet Size Comparison 3D, Black Hole Orbit and Mars Landing Challenge.

### Physics & Engineering — 12 labs
Existing Projectile Lab and Circuit Builder plus Inclined Plane & Friction, Momentum Collision, Ray Optics & Lens, Newton's Laws Force Lab, Simple Machines, Wave Interference, Pendulum Physics, Energy Track, Electromagnet 3D and Bridge Builder.

### Geography & Earth — 12 labs
Existing Seismic Wave Lab and Plate Motion Lab plus Volcano Eruption 3D, Earthquake Epicenter Finder, Plate Tectonics 3D, Tsunami 3D, Hurricane, Weather Fronts, River Erosion, Rock Cycle, Water Cycle and Ocean Currents 3D.

### Environmental Science & Climate — 10 labs
Greenhouse Effect, Carbon Cycle, Sea Level Rise, Ocean Acidification, Renewable Energy Grid, Air Pollution & Smog, Deforestation & Water Cycle, Biodiversity & Habitat Fragmentation, Urban Heat Island, and Climate Resilience City Builder.

### Chemistry — 13 labs
Existing Gas Law and Reaction Rate labs plus Molecular Geometry 3D, Molecule Builder 3D, Chemical Bonding, Acid–Base & pH, Neutralization Station, Titration, States of Matter 3D, Solubility Curve, Limiting Reagent, Balance the Equation and Periodic Table Element Hunt.

### Mathematics — 12 labs
Existing Vector Playground and Function Explorer plus 3D Geometry Slice, Pythagorean Puzzle, Unit Circle, Quadratic Transformations, Slope Intercept, Geometry Transformations, Probability Experiment, Derivative & Tangent, Area Under Curve and Matrix Transformation.

## SEO-priority collection

The supplied roadmap is represented directly in `lib/subjects/catalog.ts` with `seoTarget`, `opportunity`, and `featured` fields. The 12 featured simulations are:

1. Moon Phases 3D Simulator
2. Earth Seasons & Tilt Simulator
3. Escape Velocity Simulator
4. Inclined Plane & Friction Simulator
5. Momentum Collision Simulator
6. Earthquake Epicenter Finder
7. Ocean Currents 3D Simulator
8. Cell Membrane Transport Lab
9. Protein Synthesis Game
10. Molecular Geometry 3D Explorer
11. Solubility Curve Simulator
12. Matrix Transformation Visualizer

Subject pages and the global simulation library surface these first while still exposing the complete 71-lab curriculum. Generic simulation metadata uses the supplied SEO phrase as a keyword and creates localized canonical/hreflang metadata.

## Donate Now

A localized **Donate** action is present in the global navigation and opens `/{locale}/donate`. The page supports preset and custom one-time amounts.

The recommended production flow uses **Stripe-hosted Checkout** created by the server route `POST /api/donate`:

- the browser sends only the selected amount and locale
- the server validates a minimum of 1 and maximum of 10,000 currency units
- `STRIPE_SECRET_KEY` remains server-only
- Checkout uses `mode=payment` and `submit_type=donate`
- success and cancel URLs preserve the active locale
- the checkout product name is localized
- an optional `DONATION_HOSTED_URL` can be used as a hosted-payment fallback

Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
STRIPE_SECRET_KEY=sk_live_...
DONATION_CURRENCY=usd
# Optional fallback instead of API-created Checkout:
# DONATION_HOSTED_URL=https://buy.stripe.com/...
```

`NEXT_PUBLIC_SITE_URL` must be the real production origin before deployment because it is also used for canonical URLs, hreflang URLs, sitemap entries, JSON-LD URLs, and donation redirects.

## AdSense and publisher readiness

The site includes About, Contact, Privacy, Cookie, Terms, Disclaimer, and Editorial Policy pages in the global footer. Google Analytics and Microsoft Clarity are consent-gated and do not load when a visitor selects essential storage only.

Set the following production variables before requesting review:

```bash
NEXT_PUBLIC_CONTACT_EMAIL=contact@your-domain.com
ADSENSE_PUBLISHER_ID=pub-0000000000000000
```

`ADSENSE_PUBLISHER_ID` automatically publishes the AdSense account verification meta tag and a matching `/ads.txt` authorized-seller record. Ad units are intentionally not inserted by this setup; configure Google's certified Privacy & Messaging consent flow and child-directed treatment settings, where applicable, before serving ads.

## Multilingual translation

The platform now translates the full educational experience across the required nine locales:

- English `en`
- Spanish `es`
- Simplified Chinese `zh` (`zh-Hans` in HTML/SEO language tags)
- Arabic `ar` with RTL layout
- Portuguese `pt`
- French `fr`
- Russian `ru`
- Japanese `ja`
- German `de`

Translation coverage includes navigation, homepage, settings, missions, progress, donation copy, subject landing pages, all **71 simulation titles and learning outcomes**, simulation concepts/types, scientific-method guidance, dedicated lab controls, expanded-lab controls, select options, chart labels, live metric labels, common categorical results, accessibility labels, and SEO copy. Equations, chemical symbols, variable names, and scientific units remain mathematically/scientifically unchanged. English is still the safe missing-key fallback in development.

## International SEO

Every indexable localized page uses:

- a self-referencing localized canonical URL
- reciprocal hreflang alternates for all 9 languages
- `zh-Hans` for Simplified Chinese and `x-default` pointing to English
- localized page title and meta description
- localized Open Graph locale/title/description
- Twitter large-card metadata
- a 1200×630 Open Graph image
- `index,follow` directives on public learning pages
- `noindex` on settings, progress, teacher preview, and donation result pages
- localized `LearningResource`, `WebSite`, and breadcrumb JSON-LD where relevant
- a multilingual sitemap covering the subject and simulation catalog
- `robots.txt` pointing to the sitemap

The 71 simulation pages use localized simulation names, outcomes, concepts, and subject terminology in metadata; the English-only SEO target phrase is only injected as a keyword on the English variant rather than leaking into translated pages.

## Simulation implementation

### Flagship real-time engines
- Moon Landing uses independent lunar physics, thrust, fuel mass flow, changing mass and landing classification.
- Orbital Rescue uses Newtonian two-body gravity, orbital energy, delta-v, finite burns and rendezvous telemetry.

### Existing focused labs
Projectile motion, Ohm's law, seismic travel time, plate displacement, logistic population growth, Lotka–Volterra dynamics, ideal gas law, Arrhenius/first-order kinetics, vector algebra and quadratic functions retain their existing dedicated interactive components.

### 60 newly added labs
All 60 new routes are operational variable-driven educational models rather than empty cards. `ExpandedLabClient` supplies topic-specific controls, formulas, measured outputs and learning prompts. Examples include:

- escape and circular velocity
- Kepler period and eccentricity
- incline friction and 1D collision restitution
- thin-lens equation and pendulum period
- tsunami shallow-water speed and earthquake S–P distance
- membrane diffusion, cardiac output and natural selection
- VSEPR geometry, pH, titration mole balance and limiting reagents
- unit-circle coordinates, Riemann sums, derivatives and matrix determinants

Complex systems such as hurricanes, volcanoes, immune response and river erosion currently use clearly presented educational proxy models rather than claiming to be full scientific forecasting systems.

Entries marked as 3D use a reusable direct-Three.js learning scene so the route contains an actual WebGL model. These scenes are intentionally lightweight and should be specialized further for production-grade subject realism.

## Educational UX

- General, subject-neutral homepage
- Subject-specific landing pages with learning objectives and inquiry questions
- Predict → Experiment → Observe → Explain learning cycle
- Grade bands, concepts and learning outcomes on lab cards
- 12-lab subject catalogs with priority/high-opportunity callouts
- Light academic theme by default; dark theme remains available
- Subject visual identity is layered onto the academic shell rather than making the whole website look like a space game

## Core stack

- Next.js 16 App Router
- React 19
- strict TypeScript
- direct Three.js
- local progress/settings architecture
- multilingual routing and Arabic RTL support
- dynamic sitemap containing every subject and simulation route

## Run locally

Requires Node.js 20.9+ (Node 22+ recommended).

```bash
npm install
npm run typecheck
npm test
npm run build
npm run dev
```

Open `http://localhost:3000`; the root route resolves to a locale and `/en` is the English general entry page.
