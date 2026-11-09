# LearnerKits — Interactive Science Simulation Platform

**Predict. Experiment. Explain.**

A browser-based educational simulation platform built around **learn by experimenting, not memorizing**. The product opens as a general science gateway, then branches into six subject-specific learning areas with a calm academic light/dark theme.

## Current catalog

- **6 published subject areas**
- **71 simulations currently indexable**
- **71 simulations total**
- **16 SEO-priority simulations** surfaced as the first build/promote collection
- Light theme by default, plus Dark and System appearance modes
- Published in English and Spanish (`en`, `es`); other translations remain in the source for later re-enablement

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

The supplied roadmap is represented directly in `lib/subjects/catalog.ts` with `seoTarget`, `opportunity`, and `featured` fields. The 16 published featured simulations are:

1. Moon Phases 3D Simulator
2. Earth Seasons & Tilt Simulator
3. Escape Velocity Simulator
4. Inclined Plane & Friction Simulator
5. Momentum Collision Simulator
6. Earthquake Epicenter Finder
7. Ocean Currents 3D Simulator
8. Greenhouse Effect Simulator
9. Carbon Cycle Simulator
10. Ocean Acidification Simulator
11. Renewable Energy Grid Simulator
12. Molecular Geometry 3D Explorer
13. Molecule Builder 3D
14. Neutralization Station
15. Solubility Curve Simulator
16. Matrix Transformation Visualizer

Subject pages and the global simulation library surface these first while still exposing the complete 71-lab curriculum. Each published priority lab also has an English topic guide at `/en/guides/{slug}` with unique explanation, investigation prompts, model scope, FAQs, and a direct link into the lab. The two molecular labs are additionally grouped at `/en/molecule-kit` as a focused chemistry hub. Generic simulation metadata uses the supplied SEO phrase as a keyword and creates localized canonical/hreflang metadata.

## Search and AI discovery operations

`/robots.txt` explicitly allows Googlebot, bingbot, and OpenAI's OAI-SearchBot while keeping `/api/` private. `/sitemap.xml` includes the localized curriculum plus the English topic-guide hubs, and `/llms.txt` exposes a concise machine-readable catalog for AI systems.

After deployment, verify the production property in Google Search Console and Bing Webmaster Tools, submit `https://www.learnerkits.com/sitemap.xml`, and configure IndexNow. The helper submits the current sitemap after the key file is published:

```bash
INDEXNOW_KEY=your-key NEXT_PUBLIC_SITE_URL=https://www.learnerkits.com npm run indexnow
```

Use `INDEXNOW_URLS=https://www.learnerkits.com/en/guides/moon-phases-3d` when only a small set of changed URLs needs to be submitted.

Set `NEXT_PUBLIC_CONTENT_UPDATED_AT=YYYY-MM-DD` whenever indexed educational content changes so sitemap `lastmod` values remain accurate.

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

The site includes About, Contact, Privacy, Cookie, Terms, Disclaimer, Editorial Policy, FAQ, and Accessibility pages in the global footer. Google Analytics and Microsoft Clarity are consent-gated and do not load when a visitor selects essential storage only.

Set the following production variables before requesting review:

```bash
NEXT_PUBLIC_CONTACT_EMAIL=contact@your-domain.com
ADSENSE_PUBLISHER_ID=pub-0000000000000000
```

`NEXT_PUBLIC_ADSENSE_ADS_ENABLED` defaults to disabled. Set it to `true` only after configuring the advertising consent flow and audience settings in AdSense; the analytics banner is not an advertising CMP.

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
- Subject catalogs with priority/high-opportunity callouts
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

## Deploy (Cloudflare Workers, static)

The site is a static export (`output: "export"`). `npm run build` writes every page to `out/`, and Cloudflare serves those files as static assets, which are free and never count toward Worker request limits. `worker/index.ts` runs only when no file matches: `POST /api/donate`, `POST /api/contact`, locale-less paths such as `/about` (redirected to the visitor's language), and 404s.

```bash
npm run preview   # build + wrangler dev on http://localhost:8787 (test production API handling locally)
npm run deploy    # build + wrangler deploy
```

`npm run build` uses `https://www.learnerkits.com` for `NEXT_PUBLIC_SITE_URL` unless the shell sets another origin, so the `localhost` value in `.env.local` never reaches a deploy. Everything read from the environment at build time (site URL, contact email, AdSense ID) is baked into the HTML, so rebuild after changing it. `STRIPE_SECRET_KEY`, `DONATION_CURRENCY` and `DONATION_HOSTED_URL` stay runtime secrets on the Worker. `next dev` includes the contact API but has no locale redirects or donation API; use `npm run preview` for those.

The English homepage stays at `/` for every browser language. Cloudflare's `public/_redirects` sends `/en` and `/en/` permanently to `/`. After export cleanup, the build verifies that every sitemap page has HTML, allows indexing, and has a matching canonical on the production host. A failed check stops deployment.

Language publication is controlled by `locales` in `lib/i18n/config.ts`, currently `["en", "es"]`. The selector lists only published languages. Unpublished translations are not exported or listed in the sitemap/hreflang, and the Worker temporarily redirects their old URLs to the equivalent English URL (307, preserving query strings). Restore selected languages in `locales`, or set it to `supportedLocales`, then rebuild and deploy to enable them again. Keep the translation dictionaries intact. Existing language cookies cannot select an unpublished language.

The apex domain (`learnerkits.com`) must redirect to `https://www.learnerkits.com` using a Cloudflare domain redirect rule that preserves the path and query string. Workers static-asset `_redirects` does not support domain-level redirects. Configure this at the edge rather than running every static request through the Worker.

## Science learning articles

`/en/articles` contains sixteen original, AI-assisted educational articles: six in AI in Education, seven in Educational Technology, and three in Science Concepts (all 1,500+ words; the five added on 2026-09-27 are 2,700+ words with FAQ sections). Each includes practical situations and activities; selected articles also contain original explanatory WebP diagrams. Categories are grouped on the article index. Each article has individual publication and modification dates. Article pages are prerendered with visible source links, worked examples, a table of contents, related labs, and Article/Breadcrumb structured data. The practice article includes native expandable answer keys. Navigation search loads only the lightweight article index.

- Edit titles, descriptions, audiences, related articles, and simulation links in `lib/articles/catalog.ts`.
- Edit article bodies in `lib/articles/content/` and register new bodies in `lib/articles/index.ts`.
- Supported body syntax: paragraphs, `##` sections, `###` subheadings, Markdown links, `-` lists, `>` prompts, `:::answer Title` / `:::` disclosures, and registered `:::figure figure-id` diagrams. Raw HTML is escaped.
- Keep sources close to the claims they support. Verify numerical examples against both the relevant science reference and the actual lab controls. Do not claim human or expert review unless it has happened.
- Articles are English-only until translated. Do not add duplicate English pages under other locales. The sitemap, existing `llms.txt` discovery file, search, and lab backlinks use the article catalog.
- Each article has an original illustration in `public/images/articles/`: a 1200×800 WebP, a 640×427 responsive version, and a 1200×630 social preview. Alt text and captions live in `lib/articles/images.ts`; generation prompts and provenance are recorded in `docs/article-image-prompts.json` and `docs/educational-technology-images.json`. Illustrations were generated with the built-in image tool, then resized and encoded as WebP with Sharp. They are conceptual editorial art, not scientific measurements or simulation screenshots.
- The five articles added on 2026-09-27 use original diagram-style hero illustrations instead: SVG sources in `output/article-images/` (plus `moon-phase-geometry` and `carbon-stock-flow` figures in `output/article-figures/`), rendered with headless Chrome and encoded as WebP with Pillow. Their captions say "Original explanatory illustration."
- Image filenames use topic descriptions without an `ai` label. Each article has a distinct fictional person and setting: an attic bedroom, school makerspace, reference library, science classroom, or home dining room. The illustration disclosure remains in the captions and editorial policy.
- Student illustrations also use distinct compositions: a straight-down desk view, a close over-the-shoulder view, a table-height side profile, and a wide view from a doorway. Image filenames include the viewpoint so revised assets have fresh URLs in cards, sharing metadata, and the sitemap.
- Article SEO includes unique titles and descriptions, canonical and English alternate links, indexing/snippet directives, author/publisher metadata, Open Graph article fields and image dimensions, Twitter large-image cards and alt text, Article/ImageObject/Breadcrumb structured data, and image sitemap entries. Metadata references the same images shown on the pages. No invented reviews, credentials, social accounts, or licensing claims are added.
- Run `npm test` and `npm run build` after changes. Article checks cover length, internal destinations, rendering, schema, canonical URLs, discovery, and missing-page handling.

After deployment, confirm the production canonical host and inspect the article URLs and sitemap in Search Console. Ranking, indexing, and AdSense approval are external decisions; word count is not an approval threshold. Google documents [people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [AI search eligibility](https://developers.google.com/search/docs/appearance/ai-features), and [AdSense eligibility](https://support.google.com/adsense/answer/9724). The existing `llms.txt` is a discovery aid, not a requirement or guarantee for AI search inclusion.


## Contact form and Supabase

The contact form at `/{locale}/contact` calls `POST /api/contact`. Next.js handles this in development via `app/api/contact/route.ts`. The existing static Cloudflare deployment handles the same URL in `worker/index.ts`; both call `lib/contact/submit.ts`. No Supabase credentials are sent to the browser. Messages are stored, not automatically emailed to the owners.

1. Create or select a Supabase project and apply `supabase/migrations/202610030001_contact_messages.sql` in its SQL Editor (or use `supabase db push` with a linked project).
2. Set `SUPABASE_URL` and `SUPABASE_SECRET_KEY` in `.env.local` for `npm run dev`. A legacy `SUPABASE_SERVICE_ROLE_KEY` is supported instead. Use a server secret key, never a public/anon key.
3. Set the same variables in a local `.dev.vars` file for Wrangler preview, and set production secrets with `wrangler secret put SUPABASE_URL` and `wrangler secret put SUPABASE_SECRET_KEY`.
4. Submit a test enquiry, verify it appears in `public.contact_messages` in the Supabase Table Editor, and delete the test row. Restrict dashboard access to people handling enquiries. Review messages there and reply through the published contact mailbox.

The table has row-level security and no anonymous/authenticated access policies. Only the server role can call the submission function. The endpoint validates all fields, requires privacy acknowledgement, rejects cross-origin browser requests, limits request size, hides upstream errors, and includes a honeypot. The database enforces three messages per email address per 15 minutes, including concurrent requests. This limit is not a full bot-defense service: configure a Cloudflare rate-limiting rule for `/api/contact` if traffic warrants it. The form uses a Clarity masking marker and does not store IP addresses or user agents with messages.

Without configured credentials or the migration, the form returns an honest unavailable/error message and offers the public email address. No live Supabase connection is bundled. Review old correspondence and remove it when no longer needed; no automatic retention period or cleanup job is configured. Handle deletion requests in both the database and relevant mailbox.

## Google sign-in

The header shows an optional **Sign in with Google** button (`components/navigation/AuthButton.tsx`). Production is a static export with no Next.js server, so sign-in runs in the browser through Supabase Auth using the PKCE flow. Google redirects back to Supabase, which returns the browser to the page where the user clicked. supabase-js is only downloaded when the visitor clicks the button or already has a session, so other visitors don't load it. Signing in currently only identifies the user; progress and settings still stay in local storage.

1. In Google Cloud Console, open **APIs & Services → OAuth consent screen**, then configure the app name, support email, logo, and links to `/en/privacy` and `/en/terms`. Request only the default `openid`, `email`, and `profile` scopes.
2. Under **Credentials**, create an **OAuth client ID** of type *Web application*. Add `https://<project-ref>.supabase.co/auth/v1/callback` as an authorized redirect URI. You can copy the exact URL from the Supabase Google provider page.
3. In Supabase, go to **Authentication → Sign In / Providers → Google**, enable it, and paste the client ID and secret. The Google client secret lives only in Supabase.
4. In **Authentication → URL Configuration**, set the Site URL to `https://www.learnerkits.com`. Add these redirect URLs: `https://www.learnerkits.com/**`, `http://localhost:3000/**` for `npm run dev`, and `http://localhost:8787/**` for Wrangler preview.
5. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (Supabase **Project Settings → API Keys**, publishable key) in `.env.local`. They are inlined at build time, so set them wherever `npm run build` runs. They are not Wrangler secrets. If either is unset, the button is hidden.

The publishable key is designed to be public. It only grants what row-level security allows, and the existing `contact_messages` table has no anon/authenticated policies, so signed-in users cannot read it. Before storing any per-user data, add tables with RLS policies scoped to `auth.uid()`. Review the Privacy Policy's "Optional Google sign-in" section against your actual settings. Because many learners are children, check Google's and your local rules on accounts for users under 13 before promoting sign-in.

## LearnerKits Premium (Paddle + AI tutor)

Premium is an optional $10/month subscription, sold at $4.90/month with a 51% launch discount. Paddle sells it as merchant of record, so it handles sales tax and VAT. Everything educational stays free, including all simulations, the molecule builder, and the molecule kit. Premium adds:

- an **AI science tutor** on every simulation page (`components/premium/SimulationAssistant.tsx`),
- **no ads**: `components/premium/AdsLoader.tsx` skips AdSense for subscribers,
- **no upgrade reminders**. Free visitors see the Premium dialog once per browser session, after 30 seconds of visible time on a simulation.

How it works: subscribing requires Google sign-in. `POST /api/billing/checkout` verifies the user's Supabase session and creates a Paddle transaction on the server, with the user's id in `custom_data` and the discount applied. The browser loads Paddle.js only at that moment and opens the checkout overlay for that transaction. Paddle then calls `POST /api/billing/webhook`. The handler verifies the `Paddle-Signature` HMAC and records `subscription.*` events in `public.subscriptions`, ordered by `updated_at` so out-of-order deliveries are harmless. `transaction.completed` also links the new subscription to the user as a fallback. Browsers can read only their own rows. `POST /api/billing/portal` returns a fresh Paddle customer-portal link for cancelling or updating the card. `POST /api/ai/tutor` re-checks the subscription and a per-user daily limit before calling the model. `worker/index.ts` serves these routes in production, and `app/api/**` serves them under `npm run dev`.

Setup (everything is configured in `.env.local`; `npm run deploy` uploads it to Cloudflare):

1. Apply `supabase/migrations/202611090001_premium_subscriptions.sql` and then `202611100001_subscription_environment.sql` in the Supabase SQL Editor.
2. In **each** Paddle account, sandbox (sandbox-vendors.paddle.com) and live (vendors.paddle.com):
   - **Catalog → Products**: create **LearnerKits Premium** with a **$10.00 USD monthly** price and no trial. Copy the price id (`pri_…`).
   - **Catalog → Discounts**: create a **51% percentage** discount, recurring for as many billing periods as `lib/premium/copy.ts` says (currently 6), restricted to that price. Copy the id (`dsc_…`).
   - **Checkout → Checkout settings**: set the default payment link to `https://www.learnerkits.com/en`. In live mode, also approve `learnerkits.com` and `www.learnerkits.com` under website approval.
   - **API keys**: create a key with Transactions *write*, Subscriptions *read*, Customers *read*, and Customer portal sessions *write*. Also create a client-side token.
   - **Events → Notifications**: add `https://www.learnerkits.com/api/billing/webhook` with usage type **Platform**, every `subscription.*` event, and `transaction.completed`. Copy its secret key (`pdl_ntfset_…`).
3. Fill in `PADDLE_SANDBOX_*` and `PADDLE_LIVE_*` in `.env.local` (see `.env.example`), plus `SUPABASE_URL` and `SUPABASE_SECRET_KEY`.
4. Choose the mode with **`PADDLE_TEST_MODE=true`** (sandbox: test card `4242 4242 4242 4242`, any future date, CVC `100`) or **`false`** (live: real payments). Run `npm run check:paddle` to verify the selected set against Paddle, or `npm run check:paddle live` to check the other set.
5. Set `NEXT_PUBLIC_PREMIUM_ENABLED=true` to show Premium, then run `npm run deploy`. It prints the mode and refuses to deploy with Premium on if the selected set is incomplete or uses keys from the wrong environment. It builds the site, uploads both Paddle sets and the Supabase secrets with the Worker version, and passes `PADDLE_TEST_MODE`.

How the switch works: only the Worker decides the mode. The browser gets the matching client token from `/api/billing/config` and `/api/billing/checkout`, so a visitor cannot force test mode. In live mode, sandbox webhooks are rejected. Every subscription row records its `environment`, and only rows from the active mode grant Premium, so test purchases never unlock the live site. While the sandbox is active, the Premium dialog shows a "Test mode" note with the test card.

AI tutor: production uses the Workers AI binding (`"ai"` in `wrangler.jsonc`) with `@cf/qwen/qwen3-30b-a3b-fp8`. No API key is needed. Every Cloudflare account gets 10,000 free Neurons per day, roughly 1,000 short tutor answers with this model. Above that, Workers AI needs the Workers Paid plan and costs about $0.05 per million input tokens and $0.34 per million output tokens. Subscribers get 40 questions per UTC day, which `AI_DAILY_LIMIT` can change. `AI_MODEL` switches the model. Workers AI always runs on Cloudflare, so `wrangler dev` requires `wrangler login`. `npm run dev` cannot use the binding: set `AI_BASE_URL`, `AI_API_KEY`, and `AI_MODEL` for any OpenAI-compatible provider (OpenAI, Qwen/DashScope, OpenRouter) to try the tutor locally, or to replace Workers AI in production. If you change provider, update the Privacy Policy's "AI science tutor" section, which names Cloudflare Workers AI.

Keep the prices in `lib/premium/copy.ts` in sync with Paddle. Have the owners review the Premium sections of the Terms and Privacy Policy before launch, including the discount duration and refund handling.


Publisher readiness also requires account-side work: verify the public contact mailbox, configure AdSense Privacy & messaging (including a Google-certified CMP where applicable), review child-directed treatment settings, and review the policies against actual operations. These pages and tests do not guarantee AdSense approval. Google's [publisher policies](https://support.google.com/adsense/answer/10502938) and [consent requirements](https://support.google.com/adsense/answer/13554116) explain those obligations.
