# Abide Booklet Launch — Design Spec

**Date:** 2026-06-21
**Status:** Approved (brainstorm) → implementing via autopilot
**Author:** Joel + Claude

## Goal

Launch the second product — **Abide – Spiritual Practices Booklet** (by Annabelle McLennan, $20 NZD) —
both as a sellable product and as something *advertised* on the storefront. The store was built
single-flagship (the whole homepage is a bespoke showcase for the Prayer Cards), so the booklet
needs its own presence.

The booklet carries its own brand identity ("Abide") that is distinct from the My Living Hope
storefront look. The promo surfaces and the booklet's own product page lean into the Abide look;
the rest of the site stays MLH-styled.

## Product facts

- Firestore doc: `storeProducts/2FsLT36JM7wVUkkq4dof`
- slug: `abide-spiritual-practices-booklet`
- title: `Abide - Spiritual Practices Booklet`
- subtitle: `Spiritual Practice For Day To Day Life`
- price: `2000` cents ($20 NZD)
- 12 practices: Solitude · Rest · Reading the Bible · Prayer · Service · Generosity · Fasting ·
  Community · Witness · Simplicity · Worship · Stewardship
- Part of Beyond Experience Kindred, a ministry of Scripture Union NZ.
- Currently **draft**, empty `seo`, one-line description.

## Abide brand kit (from Abide-StyleGuide-26.pdf)

- **Header font:** BorisBlackBoxx (chunky display) — NOT a Google Font, needs the file.
- **Body font:** Inter.
- **Core colours** (white text on these): Malibu `#61BFE3`, Bad Boy Blue `#0F197C`.
- **Pastels** (black text on these): Romantic `#FFD5B3`, Chiara `#FFF4B1`, Lilac `#D3D3FF`,
  Andrea `#CEEAF8`, Cute Lavender `#EAD6FF`.
- **Mascot:** "Obi" — hand-drawn line figure. Only core colours or black; do not recolour/distort.
  Asset must be supplied by Joel; treated as an optional accent with graceful fallback.

## Scope (6 pieces)

### 1. Copy + SEO (booklet)
Production values to set in the portal / Firestore (autopilot can't write to the live DB, so these
are documented here and seeded into a DEV-only preview — see piece 3):

- **description** (plain text, `whitespace-pre-line`; no HTML entities; stop-slop'd):

  > Spiritual practices for day-to-day life, by Annabelle McLennan.
  >
  > Abide is a guided booklet for anyone who has felt a gap between their faith and their ordinary
  > week. It walks you through twelve spiritual practices, the everyday rhythms Jesus lived out in the
  > gospels. Each one is small enough to start this week.
  >
  > Every practice gives you the why behind it, scripture to sit with, a simple way to begin, and
  > honest questions to make it your own:
  >
  > Solitude · Rest · Reading the Bible · Prayer · Service · Generosity · Fasting · Community ·
  > Witness · Simplicity · Worship · Stewardship
  >
  > Come as you are. You can't make God love you any more than He already does, but you can grow
  > closer to Him. Abide gives you a gentle place to start, on your own, in a youth group, or across a
  > whole ministry.
  >
  > Part of Beyond Experience Kindred, a ministry of Scripture Union New Zealand.

- **seo.title:** `Abide — Spiritual Practices Booklet | My Living Hope`
- **seo.description:** `A guided booklet of 12 spiritual practices for everyday faith: solitude, prayer, rest, generosity and more. Simple ways to walk with God day to day.`
- **theme:** `abide`  (new optional field; drives the themed product page — see piece 4)

### 2. Sell it
Flip `status: draft → published`. Cart + Stripe checkout already handle any published product
generically (line-item array re-priced server-side). No commerce code changes.
**Go-live action for Joel** (not done in autopilot — it's a live DB write + makes it buyable).

### 3. DEV preview seed
`src/lib/previewProducts.js` exports the booklet with the copy/SEO/theme above and the existing
Firestore image URLs. `useProducts` merges any preview product (by slug) that isn't already present
**only when `import.meta.env.DEV`**. This lets localhost render the /shop page, band, popup target,
and themed product page without publishing to the live DB. Dead code in production builds.

### 4. Abide-themed product page
`ProductPage` detects `product.theme === 'abide'` (fallback: slug starts with `abide`) and applies an
Abide skin via a `theme` object (colours/fonts/classes) rather than forking the component:
- Bad Boy Blue headings in BorisBlackBoxx/Archivo Black; Inter body.
- Pastel section background (Andrea / Lilac), Malibu + navy accents.
- "Add to cart" button in Abide blue (navy), white text.
- Optional Obi accent if the asset exists.
Prayer Cards page and all other products keep the MLH look (default theme).

**SEO wiring (applies to every product page):** set `document.title` from `product.seo.title`
(fallback `${title} — My Living Hope`) and inject/update `<meta name="description">` from
`product.seo.description` (fallback `subtitle`). Restore on unmount. NB: client-side only — fine for
Google (renders JS) but social/OG scrapers won't see per-product tags without prerender (out of scope).

### 5. First-visit whisper popup
`src/components/AbidePromoPopup.jsx`, mounted in `App`:
- Small card, fixed bottom-left, slides up ~2.5s after load. Not a full-screen blocker.
- Abide-styled (pastel bg, navy text, chunky heading), optional Obi peeking.
- Copy: "Psst — something new" / "Come meet Abide, our booklet of spiritual practices for everyday
  life." + button **"Explore the booklet →"** → `/shop/abide-spiritual-practices-booklet`.
- Shows **once per visitor** (localStorage `mlh_abide_promo_seen_v1`). Dismiss (X / Esc) sets the flag.
- Never renders on the booklet product page itself. Respects `prefers-reduced-motion`.

### 6. "Our latest product" band
`src/components/sections/LatestProduct.jsx`, added as the **last** section of `Home` (after `CTA`,
before the global footer):
- Thin, full-width, Abide core-colour background (Malibu) with white text, or a pastel — chosen for
  contrast and tested.
- Eyebrow "Our latest product", booklet title, one-line tagline, `$20 NZD`, "View product →" button,
  booklet image + optional Obi.
- Finds the booklet via `useProducts` by slug; renders nothing if absent (so prod is safe pre-publish).

## Architecture notes / isolation
- Theme is data-driven (`product.theme`) so future Abide products opt in by setting one field.
- Abide palette added once to `index.css @theme`; reused by popup, band, product page.
- Preview seed is the single source of truth for localhost; production reads the real Firestore doc.
- Each new surface is its own component with one job (popup, band, shop index), wired at the edges
  (`App`, `Home`, `Header`).

## Out of scope / later
- Portal CMS: a `theme` selector + SEO fields editor (currently set directly in Firestore).
- Server-side render / prerender for per-product OG tags.
- Obi mascot animation; bulk/wholesale pricing.

## Go-live checklist for Joel (production)
1. In the portal Store CMS (or Firestore) set on the booklet: the **description**, **seo.title**,
   **seo.description**, and **theme: `abide`** exactly as above.
2. **Publish** the booklet (`status: published`).
3. Drop the real **BorisBlackBoxx** web font into `storefront.mylivinghope/public/fonts/` (see the
   README there) — until then it falls back to Archivo Black.
4. (Optional) Export **Obi** asset(s) to `public/images/abide/` for the popup/band/product page.
5. Deploy storefront. The DEV preview seed is inert in production.
