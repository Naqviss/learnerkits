# Implementation Status

## Donate + multilingual SEO + translation update

### Donate Now
- Global localized Donate navigation action added.
- Localized donation page for all 9 locales.
- Preset and custom one-time amounts.
- Server-side validation: 1–10,000 currency units.
- Server-created Stripe Checkout session; the Stripe secret is never sent to the client.
- Stripe Checkout uses `mode=payment` and `submit_type=donate`.
- Localized Checkout product name plus localized success/cancel routes.
- Optional `DONATION_HOSTED_URL` fallback.
- `.env.example` documents required production variables.

### International SEO
- Self-canonical URL for each localized page.
- Reciprocal hreflang alternates for `en`, `es`, `zh-Hans`, `ar`, `pt`, `fr`, `ru`, `ja`, `de`, plus `x-default`.
- Localized Open Graph and Twitter metadata with a 1200×630 sharing image.
- Locale-aware `content-language`; Simplified Chinese uses `zh-Hans`.
- Localized `WebSite`, `LearningResource`, and breadcrumb structured data where applicable.
- Multilingual sitemap and robots route remain enabled.
- Utility/private-state pages use `noindex` while educational/content routes remain indexable.

### Translation coverage
- All nine message files share the same 222-key schema.
- All 71 simulation titles/outcomes have translations in each of the eight non-English locales.
- All six subject landing-page content sets are localized.
- Dedicated lab labels and expanded-lab controls are localized at runtime.
- Human-reviewed dictionaries cover technical control labels and result phrases that are unreliable to translate word-by-word.
- Common categorical model outputs (phase/state/geometry/biology/chemistry results) are localized.
- Equations, element symbols, scientific variables and SI units remain unchanged.
- Arabic remains RTL and Chinese emits `lang="zh-Hans"`.

## Latest catalog expansion

The supplied ten-simulation list for each subject has been added **on top of** the two existing labs per subject.

### Catalog totals
- 6 published subject areas (10–13 simulations per subject)
- 71 unique simulation slugs
- 60 newly added simulation routes
- 12 supplied SEO-priority entries flagged as `featured`

### Routing and discovery
- Every catalog entry appears on its subject landing page.
- The global Simulation Library includes all 71 entries grouped by subject.
- A dedicated 12-card priority collection surfaces the strongest supplied SEO opportunities.
- The sitemap automatically includes all 71 simulation paths for all supported locales.
- Generic simulation pages use localized canonical/hreflang metadata and incorporate the supplied SEO target when present.

### Interactive implementation
The original Moon Landing and Orbital Rescue remain the flagship real-time physics engines. The ten previously added focused labs keep their dedicated components.

The 60 new routes now use a shared educational model system with **topic-specific** controls and calculations. They do not render as `coming soon` placeholders. Each route includes:
- live variable controls
- calculated metrics
- a scientific/mathematical relationship or formula
- an explicit learning focus
- Predict / Observe / Explain guidance
- a subject-specific visualization

3D-designated entries use direct Three.js through `ExpandedThreeScene` for a live WebGL educational scene. This is a reusable lightweight visualization layer, not a claim that all 3D entries already have final production art or a bespoke high-fidelity numerical engine.

### Scientific-model scope
Focused equations/relationships are used where a compact model is appropriate, including orbital speed, Kepler period, Newtonian mechanics, momentum conservation, thin lenses, pendulums, wave interference, solenoid field approximation, tsunami shallow-water speed, membrane flux, cardiac output, pH, strong-acid/strong-base titration, stoichiometric limiting reagents, probability, derivatives, Riemann sums and matrix transforms.

More complex systems—such as hurricane intensity, eruption behavior, immune response, river erosion and some educational games—use simplified **learning proxies**. These should be upgraded with deeper domain models before describing them as research-grade or forecasting simulations.

## Validation performed here

- Catalog check: **71 simulations / 71 unique slugs**.
- Published catalog check: **six subject areas; 71 simulations total**.
- Expanded-model coverage check: **60 new configs**, with no missing or extra new slugs.
- Existing coverage: 10 dedicated concept labs + 2 flagship simulations.
- Featured SEO-priority check: **12**.
- TypeScript parser check passed for all `.ts` and `.tsx` source files using the locally available TypeScript compiler.
- Message dictionaries: 222 keys per locale with only legitimate invariant/cognate matches remaining against English (for example brand name, XP, numeric durations).
- Simulation translation catalog: 71 translated entries for each non-English locale.
- Expanded control-label audit: all control labels translate in every locale; unchanged items are scientific invariants/cognates such as `pH`, German `Matrix`, or `Planet`.
- Runtime metric-label audit leaves only scientific notation/symbols or legitimate cognates unchanged.

## Still required locally

Dependency packages are not present in this generation environment, so run the real framework checks after installing packages:

```bash
npm install
npm run typecheck
npm test
npm run build
npm run dev
```

## Recommended production hardening

1. Specialize the reusable Three.js scenes for the highest-priority 3D experiences first: Moon Phases, Earth Tilt/Seasons and Molecular Geometry.
2. Add dedicated mission/game-state logic for Earthquake Epicenter Finder, Cell Membrane Transport and Protein Synthesis.
3. Add charts/measurement tools where the educational goal depends on interpreting a curve or time series.
4. Add native-speaker editorial review for the highest-traffic translated landing pages before large-scale SEO promotion.
5. Add E2E tests that visit all 71 routes and exercise at least one control on every simulation.
6. Add subject-specific localized article/FAQ content clusters around the supplied SEO targets rather than relying on simulation pages alone.
7. Configure Stripe webhook handling if you later need a persistent donation ledger, receipts workflow, or donor analytics.

## Runtime fix — Next.js 16 Server/Client serialization

Fixed a Next.js 16.3.4 runtime error on generic simulation pages where the server passed the full `EducationCopy` object into `ConceptLabClient`. `EducationCopy` contains formatter functions (`library.body`, `subject.ways`, and SEO title/description formatters), which are not serializable across a Server Component → Client Component boundary.

The client now receives only `{ lab: copy.lab }`, a plain-string `LabClientCopy` subset. `ExpandedLabClient` uses the same serializable type. A source audit confirmed no other server-rendered `copy` prop passes function-valued education copy into a client component. All 56 TS/TSX files parse with zero syntax errors after the fix.
