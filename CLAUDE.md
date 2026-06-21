# My Living Hope

## Overview
- **Client**: My Living Hope (greeting card business, Jesse Major founder)
- **Type**: Headless storefront (React/Vite) + Firebase Admin Portal — migrating commerce off Shopify to Stripe
- **Status**: Portal functional; storefront LIVE at mylivinghope.org.nz on **Stripe Checkout** (Firebase Hosting, DNS via Cloudflare). **Phase 5 cutover done 2026-06-19** — Shopify Buy Button removed, live Stripe keys + webhook active, client made a successful live purchase. Phase 4 (transactional emails) still pending Jesse's Resend account.

## ⚠️ Where We Are (read this first)
- **NEW (2026-06-21): 2nd product — Abide booklet — built & on localhost for review.** A full launch (copy/SEO, /shop index page, Abide-themed product page, first-visit "whisper" popup, bottom-of-home "latest product" band) was built this session via autopilot. **It is NOT live** — the booklet is still a Firestore draft; localhost uses a DEV-only preview seed. See the "Abide booklet launch" go-live checklist in Next Steps. Dev server runs at `http://localhost:3854/`. Spec: `docs/superpowers/specs/2026-06-21-abide-booklet-launch-design.md`.
- **Resend is now READY (Joel, 2026-06-21).** Phase 4 (transactional emails) is unblocked — deprioritised behind the booklet launch this session.
- **Home branch: `main`.** All real dev lives here. `sidequest-backup` is an auto-backup branch *behind* main — **do not develop on it.**
- **Local `main` is ~60 commits ahead of `origin/main`** — committed but NOT pushed. Pushing is the main housekeeping debt.
- **Commerce migration (off Shopify → Stripe) is LIVE.** Phases 1–3 + **Phase 5 cutover done & deployed** — storefront checks out via live Stripe; client made a real purchase. **Phase 4 (transactional emails) is the remaining build**, blocked on Jesse's Resend account.
- **Two Jesse to-dos:** (1) **enable Stripe payouts** — the live account has `charges_enabled=true` but `payouts_enabled=false`, so money sits in the Stripe balance until he finishes bank verification; (2) create a **Resend account** + verify sending-domain DNS for Phase 4 emails.

## Project Structure
- `mylivinghope/` — legacy Shopify theme (Liquid templates) — being decommissioned at cutover
- `portal.mylivinghope/` — React admin portal (Vite + Firebase); also hosts the Cloud Functions (`functions/`)
- `storefront.mylivinghope/` — React + Vite storefront (LIVE on Stripe Checkout; Shopify Buy Button removed at the 2026-06-19 cutover)

## Playbooks In Use
Read from Brain at session start. Do not copy into this project.
Brain path: `D:/Sidequest Digital/Dev Projects/Brain/playbooks/`

### Always (load every session)
- `playbooks/JoelTempero.md` — working profile
- `playbooks/TokenDiscipline.md` — token hygiene

### Current phase: 2 — Build (CRUD, UI, features)
- `playbooks/CMS-Portal-Backend.md` — portal build workflow
- `playbooks/DesignSystem.md` — design contract workflow

### Available (load when phase changes)
- `playbooks/Accessibility.md` — phases 2-6
- `playbooks/ErrorHandling.md` — phase 5
- `playbooks/Testing.md` — phase 6
- `playbooks/Security.md` — phase 7
- `playbooks/Deployment.md` — phase 8
- `playbooks/CLAUDE-WebsiteInstructions.md` — Shopify theme reference
- `playbooks/SEO.md` — storefront SEO
- `playbooks/Analytics.md` — storefront analytics

## Tech Stack
- **Storefront (new)**: React 19 + Vite 7 + Tailwind CSS v4 + Stripe Checkout (Buy Button live in prod until Phase 5 cutover)
- **Commerce**: Stripe Checkout Sessions (hosted) via Cloud Functions; Firestore = catalog source of truth
- **Email**: Resend (transactional — Phase 4, pending Jesse's account)
- **Storefront (legacy)**: Shopify Liquid theme — being decommissioned at cutover
- **Portal Frontend**: React 19 + Vite 7 + Tailwind CSS v4
- **Portal State**: Zustand
- **Portal Forms**: React Hook Form + Zod validation
- **Portal Tables**: TanStack React Table
- **Portal Routing**: React Router v7
- **Backend/DB**: Firebase (Firestore) — project `my-living-hope`
- **Auth**: Firebase Auth
- **Icons**: Lucide React
- **AI Context**: Firebase Storage sync + Firestore MCP server + CLI scripts

## Shared Business Context
Read these files at session start for business context (run `npm run sync-context -- pull` first in `portal.mylivinghope/`):
- `portal.mylivinghope/shared/CLAUDE-JOEL.md` — Joel's session logs and dev notes
- `portal.mylivinghope/shared/CLAUDE-JESSE.md` — Jesse's session logs and business notes
- `portal.mylivinghope/shared/MLH-SHARED.md` — Brand overview, priorities, key decisions

To query live Firestore data during a session, use the mlh-firestore MCP tools or run:
- `node portal.mylivinghope/scripts/query-firestore.js <collection>` — query any collection
- `node portal.mylivinghope/scripts/query-firestore.js --list` — see available collections

## MCP Server Setup
Add to `.claude/settings.json` on each machine:
```json
{
  "mcpServers": {
    "mlh-firestore": {
      "command": "node",
      "args": ["<absolute-path-to>/portal.mylivinghope/mcp-server/index.js"],
      "env": {
        "FIREBASE_STORAGE_BUCKET": "my-living-hope.firebasestorage.app",
        "GOOGLE_APPLICATION_CREDENTIALS": "<absolute-path-to>/portal.mylivinghope/firebase-service-key.json"
      }
    }
  }
}
```

## Build & Dev Commands
- Dev server: `cd portal.mylivinghope && npm run dev`
- Build: `cd portal.mylivinghope && npm run build`
- Lint: `cd portal.mylivinghope && npm run lint`
- Deploy: `cd portal.mylivinghope && firebase deploy --only hosting --project my-living-hope`
- Deploy storage rules: `cd portal.mylivinghope && firebase deploy --only storage --project my-living-hope`
- Sync context: `cd portal.mylivinghope && npm run sync-context -- pull`

## Build & Dev Commands (Storefront)
- Dev server: `cd storefront.mylivinghope && npm run dev`
- Build: `cd storefront.mylivinghope && npm run build`
- Lint: `cd storefront.mylivinghope && npm run lint`
- Deploy: `cd storefront.mylivinghope && npm run deploy`
- Hosting site: `mylivinghope` (mylivinghope.web.app → mylivinghope.org.nz)

## Code Conventions
- **Portal**: JSX (not TSX), plain JavaScript with JSX
- **Storefront**: JSX (not TSX), plain JavaScript — same as portal
- Component structure: `components/ui/` (primitives), `components/layout/` (shell)
- Both projects: pages in `src/pages/`
- Shared pattern: `hooks/`, `stores/`, `lib/` in both projects

## Current Progress
- Shopify theme built with custom sections (hero, cards, testimonials, etc.)
- Portal fully functional — all 12 pages with working Firestore CRUD
- UI component library: Button, Card, Modal, Table, Input, Select, Badge
- Firebase integration with auth hook and useCollection hook
- Shared AI context layer complete (scripts, MCP server, Cloud Function, portal Claude page)
- Context files populated with real business data + Jesse's setup guide
- Storage rules and CORS configured for shared context files
- Deployed to my-living-hope.web.app
- **Storefront rebuilt** — pivoted from Next.js + Shopify Storefront API to React + Vite + Buy Buttons
  - 3 pages: Home (hero + product showcase + about + how it works + testimonials + CTA), About, Contact
  - Shopify Buy Button for commerce (no API token needed, no GraphQL, no cart management)
  - All design work carried over from previous Next.js build (TSX → JSX conversion)
  - Fast Vite dev server, Joel's standard stack (JSX, not TypeScript)
  - Build clean (1.75s), lint clean, 177 npm packages (vs ~800+ with Next.js)
- **Design audit complete** — 20 issues identified and fixed (contrast, accessibility, structure, touch targets)
- **Creative council audit complete** — 10 design-focused members reviewed the storefront for creative direction
  - CREATIVE.md and DESIGN.md created in `storefront.mylivinghope/`
  - Unanimous verdict: functional but generic, needs soul and visual identity
  - Key themes: lead with emotion not product, card shape as brand motif, break the template rhythm, show the actual product
- **Mobile polish pass complete** — scripture interlude responsive, footer redesigned, card drag, cart button fixed
- **Header cart button working** — Shopify SDK overlay was blocking clicks; fixed with z-[99999] + stopPropagation on mouseDown/touchStart/click
- **Storefront polish & deploy complete:**
  - Contact form wired to FormSubmit.co (free, no backend)
  - Privacy Policy + Terms & Conditions pages (NZ legal compliance)
  - Favicon generated from lantern icon
  - SEO: sitemap, robots.txt, OG tags updated for mylivinghope.org.nz
  - Hero image: 1220px fixed width with JS-driven responsive right-slide
  - Instagram URL corrected, dev artifacts cleaned up
  - Deployed to Firebase Hosting (mylivinghope.web.app), DNS pending for custom domain
- **Mobile card expand+flip** — single-element animation: tap card → transforms to viewport center while flipping to show scripture, tap to flip back, X to close. Pure CSS transforms, no portals or position:fixed.
- **Image compression** — all images resized + optimized via sharp (6MB → 420KB total, 93% reduction). 3 PNGs converted to WebP (Jesse01, full-logo, icon).
- **Sticky parallax mobile disabled** — wrapped sticky-stack CSS in `@media (min-width: 768px)`
- **Custom domain live** — mylivinghope.org.nz pointing to Firebase Hosting via Cloudflare DNS (grey cloud / DNS-only)
- **Instagram feed section** — `InstagramFeed.jsx` component with 4 embedded posts from @mylivinghopenz on Home (above CTA) and About (above footer). Uses Instagram embed.js, no API keys.
- **Hero image responsive fix** — JS positioning formula starts shifting at 2190px viewport width for earlier text/image separation
- **CTA mobile image uncropped** — removed fixed height, object-cover, and scale transform so full image displays naturally
- **Commerce migration started (off Shopify → Stripe + own CMS)** — branch `feature/commerce-migration`
  - Spec: `docs/superpowers/specs/2026-06-09-commerce-migration-design.md` (full 5-phase plan: Catalog CMS → Cart+Checkout+Stripe → Order mgmt → Tracking+emails → Cutover)
  - Decisions: Stripe **Checkout Sessions** (hosted), Firestore = catalog source of truth / Stripe = money, guest checkout + email tracking, **Resend** for email, flat-rate shipping (provisional), launch flagship product (data-driven for more)
  - **Phase 1 (Catalog CMS) — DONE + verified live by Joel:** `storeProducts` collection + rules + composite index (status+sortOrder) deployed; portal "Store" CMS page (`StoreProducts.jsx`) with image upload/draft-publish; storefront reads flagship from Firestore (`useProducts.js`, `InteractiveCards.jsx`) with fallback to static markup; Buy Button left intact. Storefront gained read-only Firebase client. Joel confirmed: created/published a product in the portal, text rendered on the storefront.
  - **Phase 2 (Buy Now + Payments) — DONE + E2E verified (test mode):** `createCheckoutSession` + `stripeWebhook` Cloud Functions deployed; orders/counters rules deployed; storefront Buy Now → Stripe Checkout + `/checkout/success` + `/checkout/cancel` pages built (NOT yet deployed to hosting). Test purchase verified: order `MLH-1001` written, idempotency + inventory decrement confirmed. Secrets per env: `STRIPE_SECRET_KEY` (test key, v2) + `STRIPE_WEBHOOK_SECRET` (v3) in Secret Manager. Live keys + Shopify/BuyButton removal come in Phase 5 cutover.
  - **Phase 5 (Cutover to LIVE) — DONE + verified (2026-06-19):** live Stripe keys in Secret Manager (`STRIPE_SECRET_KEY` v3, `STRIPE_WEBHOOK_SECRET` v4); **live** webhook endpoint `we_1Tjt63JVPadVHiFfO05FmDOK` registered (3 checkout events) → functions redeployed + bound. Storefront deployed to prod: `BuyButton.jsx` deleted, Hero/CTA/About moved off Shopify `addToCart` to a `goToShop()` helper (`lib/shop.js`), Privacy/Terms rewritten Shopify→Stripe. **Client made a successful live purchase.** Live account `acct_1TgG3NJVPadVHiFf` (NZ), `charges_enabled` ✓ but `payouts_enabled=false` (Jesse to finish bank verification).
  - **Product image management (2026-06-19):** storefront `ProductPage` now shows a full gallery (main + clickable thumbnails) instead of only `images[0]`; portal `StoreProducts` got a "Set main" button on non-primary thumbnails (promotes to `images[0]`, the primary used everywhere). Also fixed a Storage-rules gap: added a `storeProducts/` rule (public read, auth write) — uploads were 403ing because no match block existed.
  - **Free Christchurch pickup (2026-06-19):** `createCheckoutSession` offers two shipping options — Standard NZ ($7) + Pickup in Christchurch (free, $0). Order webhook records whatever shipping is returned, so pickup = `shippingNZD:0` with no other change. Cart notes pickup is available at checkout.

## Next Steps

### 🟡 Abide booklet launch — go-live (Joel review + publish)
Built 2026-06-21 (autopilot), running on localhost `:3854`, **not yet live**. To ship:
- [x] **Review on localhost** — `cd storefront.mylivinghope && npm run dev` → check `/shop`, the Abide-themed `/shop/abide-spiritual-practices-booklet`, the first-visit popup (always shows in DEV), and the navy "latest product" band at the bottom of home.
- [x] **Set the booklet fields + publish** (done 2026-06-21 via Firestore MCP): `description` (stop-slop'd), `seo.title`, `seo.description`, `theme: "abide"`, `status: published`. ⚠️ Booklet is now **buyable by direct URL on production** (`/shop/abide-spiritual-practices-booklet`) but undiscoverable until the new storefront is deployed (old prod bundle has no /shop index, popup, or band).
- [ ] **Drop `BorisBlackBoxx.woff2`** into `storefront.mylivinghope/public/fonts/` (falls back to Archivo Black until then) — see the README there.
- [ ] (Optional) Export **Obi** mascot asset(s) to wire into the popup/band/product page.
- [ ] **Deploy storefront** once happy.
- [ ] Later (portal): add a `theme` selector + SEO fields to the Store CMS so this isn't set by hand in Firestore.

### 🔴 With Jesse — remaining go-live items
- [ ] **Enable Stripe payouts** — live account has `charges_enabled=true` but `payouts_enabled=false`. Jesse must finish bank verification in the Stripe dashboard or payments accumulate in the Stripe balance (won't reach his bank).
- [ ] **Resend account (Phase 4)** — Jesse creates a Resend account + verifies the sending-domain DNS, so confirmation/shipped emails can send.
- [ ] **Jesse: activate FormSubmit.co** — first contact-form submission triggers a verification email to prayerprompts@outlook.com; must click to confirm.
- [ ] **Decommission Shopify** — storefront no longer references it; cancel the Shopify store / Buy Button product once Jesse confirms.

### Phase 4 — Tracking + emails (after Resend)
- [ ] Confirmation email on paid, shipped email on tracking entry, storefront `/track-order` + `trackOrder` function.

### Down the track
- [ ] **Bulk buy** — quantity-tier / wholesale pricing (client asked 2026-06-19; explore later).

### Maintenance / misc
- [ ] **Push local `main` to origin** — currently ~60 commits ahead, unpushed
- [ ] Functions runtime Node 20 deprecated (decommission 2026-10-30) — bump to 22
- [ ] Portal has 16 pre-existing lint errors (useAuth/useTheme fast-refresh, useCollection set-state-in-effect, unused vars in old pages)
- [ ] **Add www.mylivinghope.org.nz** — CNAME in Cloudflare, also needs adding as a custom domain in the Firebase Hosting console
- [ ] Wire MCP server into Joel's `.claude/settings.json` for native Firestore tools
- [ ] Help Jesse get Claude Code set up on his machine
- [ ] Joel to review portal Claude page live and fix any issues

## Session Log
### 2026-06-21 — Autopilot: Abide booklet (2nd product) launch build
- **Goal:** add the 2nd product (Abide – Spiritual Practices Booklet, by Annabelle McLennan, $20) — both sellable and *advertised* on the single-flagship storefront. Brainstormed + scoped with Joel, then built autonomously (autopilot) for him to review on localhost.
- **Spec:** `docs/superpowers/specs/2026-06-21-abide-booklet-launch-design.md`. **9/9 tasks done. Build + lint clean** (1 pre-existing warning in ScriptureInterlude). All commits local on `main` (unpushed). Dev server live `:3854`, routes 200.
- **Constraint:** autopilot can't write to the live DB, so the booklet stays a Firestore draft. Built a **DEV-only preview seed** (`src/lib/previewProducts.js` merged into `useProducts` under `import.meta.env.DEV`) so localhost shows everything without touching prod. Inert in production builds.
- **Built:**
  - **Copy/SEO** for the booklet (description + SEO title/description) — written from the raw booklet text; documented in the spec + seeded for preview.
  - **Abide brand foundation** — palette (Malibu/Bad Boy Blue + 5 pastels) + fonts (Inter, Archivo Black as BorisBlackBoxx fallback w/ `@font-face` pointing at `public/fonts/BorisBlackBoxx.woff2`) added to `index.css`/`index.html`. README in `public/fonts/`.
  - **/shop index page** (`Shop.jsx`, route + nav desktop/mobile→`/shop`) — uniform MLH-styled grid of all published products, loading/empty states.
  - **Per-product theming + SEO on `ProductPage`** — `theme: 'abide'` (or `abide-*` slug) → Abide skin (navy/malibu/pastel, chunky display font, navy CTA); default products unchanged. `usePageMeta` (`lib/seo.js`) sets `document.title` + meta description from the product's `seo` fields (previously dead).
  - **First-visit "whisper" popup** (`AbidePromoPopup.jsx`, mounted in `App`) — small Abide card slides up bottom-left ~2.5s, once-per-visitor in prod (localStorage), always shows in DEV, Esc/X dismiss, never on the booklet page, only if booklet is live → links to booklet page.
  - **"Our latest product" band** (`LatestProduct.jsx`) — thin navy Abide band, last section of home; renders nothing if booklet absent (prod-safe pre-publish).
- **Self-critique fix:** popup now always shows in DEV (was once-per-visitor → would look broken when previewing).
- **Needs Joel:** review on localhost, then the go-live checklist (set fields + publish in portal, add the real BorisBlackBoxx font, optional Obi asset, deploy). See Next Steps "🟡 Abide booklet launch".

### 2026-06-19 (PM) — Phase 5 LIVE cutover + image management + pickup option
- **Went live on Stripe.** Jesse activated the live account; loaded live `STRIPE_SECRET_KEY` (v3, no-newline file trick), registered the **live** webhook endpoint `we_1Tjt63JVPadVHiFfO05FmDOK` via Stripe API (3 checkout events), captured signing secret → `STRIPE_WEBHOOK_SECRET` (v4), redeployed functions. Verified: live account `acct_1TgG3NJVPadVHiFf` (NZ) `charges_enabled` ✓, single enabled live endpoint, secrets bound.
- **Storefront cutover deployed to prod** (the irreversible flip). Found the cutover half-wired: `BuyButton.jsx` (Shopify) was unused as a component but Hero/CTA/About still imported its `addToCart` (which only scroll-to-shop'd since the SDK never loaded — About's was a dead no-op). Replaced with a shared `goToShop()` helper (`lib/shop.js`); Home scrolls to `#shop` on hash so About's cross-page CTA lands. Deleted `BuyButton.jsx` + dead CSS. Privacy/Terms rewritten Shopify→Stripe (+ dropped GST claim, cart = local storage). Build + lint clean, all routes 200. **Client then made a successful live purchase.**
- **Storage rules fix:** product image uploads were 403ing (`storage/unauthorized`) — no `storeProducts/` match block existed (deny-by-default). Added public-read / auth-write rule, deployed. Joel uploaded 7 images to the flagship after.
- **Image management:** storefront `ProductPage` now a gallery (main + thumbnails, was `images[0]` only); portal `StoreProducts` got a "Set main" button on non-primary thumbnails. Both apps redeployed.
- **Free Christchurch pickup:** `createCheckoutSession` now offers Standard NZ ($7) + Pickup (free) shipping options; cart notes it. Function redeployed.
- **Payouts gap flagged:** `payouts_enabled=false` — Jesse to finish bank verification. Commits `ea8416f`, `10f6e65`, `348e442`, `4287d82` on main (unpushed).

### 2026-06-19 (AM) — Branch consolidation, checkout security hardening, product page + cart
- **Branch confusion resolved:** session opened on `sidequest-backup` (auto-backup branch *behind* main) which lacked all the commerce/Stripe work → it looked "missing". Switched to `main` (home), refreshed this file + added auto-memory so it can't recur.
- **Checkout security review + hardening** (`portal.mylivinghope/functions/index.js`, commit `1a0c54d`, deployed): only fulfil when `payment_status === 'paid'` (guards async/$0 methods e.g. Klarna); handle `async_payment_succeeded/failed`; reject non-positive prices; deterministic order doc id = Stripe session id + in-transaction dedup (kills duplicate-order race). Verified live — real test purchases wrote MLH-1002/1003, doc id == session id, correct totals, all `paid`. (App Check on the callable still TODO — needs console reCAPTCHA reg.)
- **Product page + cart shipped** (commerce phase 2.5, merged to main): spec `docs/superpowers/specs/2026-06-19-product-page-cart-design.md`, plan `docs/superpowers/plans/2026-06-19-product-page-cart.md`. Cart-only flow (no express buy): Home "View product" → `/shop/:slug` (qty, inventory-aware, image fallback) → Zustand+localStorage cart (`src/stores/cart.js`) → `/cart` (qty/remove, Subtotal/Shipping/Total) → Checkout → Stripe → success clears cart. Header cart badge. `createCheckoutSession` unchanged (already accepts a line-item array). Built generically so the booklet drops in by publishing it in the portal.
- **Feedback applied:** shipping is an itemised line + Total in cart (was a note; display-only `SHIPPING_FLAT_CENTS`, server is source of truth); `/checkout/cancel` redirects to `/cart` (Stripe back button / abandon).
- **Jesse on-site** actioning go-live tasks: activate live Stripe account (→ live keys), create Resend account (+ sending-domain DNS), FormSubmit verify.
- Verified via local dev (:3854) + headless browser. Build + lint clean. 7 commits merged to main (still unpushed). New storefront dep: `zustand`.

### 2026-06-11 — Phase 3: Order Management (same session as Phase 2)
- **Business decisions:** no GST at this stage (not registered — no GST line on receipts v1); storefront deploy HELD until live-key cutover with Jesse; still waiting on Resend for Phase 4.
- **Phase 2 merged to main** (fast-forward, branch deleted). Local main ahead of origin — not pushed.
- **Rules:** `orders` update now allowed for editors restricted to `status`/`fulfillment`/`notes`/`updatedAt` via `diff().affectedKeys().hasOnly()` — money/items/customer stay function-only. Deployed.
- **`StoreOrders.jsx`** (new, follows StoreProducts pattern): searchable list (order #/name/email) + status filter; detail modal with items/totals/customer/address/copyable Stripe IDs; status flow paid → Mark Fulfilled → tracking entry (carrier select + number) → Mark Shipped (sets `fulfillment` + `shippedAt`); notes with save; cancelled/refunded override with confirm step (records status only — real refunds in Stripe dashboard). Route `/store-orders`, sidebar "Store · Products" / "Store · Orders".
- **ESLint config fix:** `functions/`, `scripts/`, `mcp-server/` now linted as Node CJS (were browser/module → 15 bogus errors). 16 pre-existing errors remain in old app code (noted in Maintenance).
- **Deployed portal hosting**, Joel verified live: order visible, Mark Fulfilled worked. Order reset to `paid` for Phase 4 email testing.
- Plan: `docs/superpowers/plans/2026-06-11-phase3-order-management.md`. Commits: `15dad19` (rules), `51cbbdc` (orders page), `52c21bd` (route+nav).

### 2026-06-11 — Phase 2: Buy Now + Stripe Checkout + Webhook (E2E verified)
- **Stripe unblocked:** Jesse created the account; test secret key set via Secret Manager. Shipping confirmed $7 flat.
- **`createCheckoutSession` callable:** re-validates product/price/stock against Firestore (never trusts client), inline NZD `price_data`, adjustable qty, $7 flat shipping, NZ-only address, phone collection.
- **`stripeWebhook` (raw HTTPS):** signature-verified; on `checkout.session.completed` writes `orders` doc (transaction: order number `MLH-{n}` from `counters/orderNumber`), idempotent on `stripeSessionId`, best-effort inventory decrement.
- **Rules:** `orders` read = portal editors/admins, write = functions only; `counters` functions only. Deployed.
- **Storefront:** `BuyButton` replaced with Buy Now button (loading/error states) in `InteractiveCards.jsx`; Shopify cart removed from `Header.jsx`; new `lib/checkout.js`, `/checkout/success`, `/checkout/cancel` routes. Build + lint clean. **Not yet deployed** — deploying puts test-mode checkout live (Joel's call).
- **All functions deployed** (incl. backlog `generateContext`). Webhook endpoint registered via Stripe API (`we_1Tgt2w...`), signing secret captured from creation response — no dashboard needed.
- **E2E verified (test mode):** real test purchase by Joel → order `MLH-1001` (`status: paid`, $40 + $7 = $47 NZD, full customer/address), inventory 250→249, webhook event re-sent → no duplicate order (idempotency ✓).
- **Gotcha — PowerShell pipes append `\r\n`:** `"key" | firebase functions:secrets:set --data-file -` stored a trailing newline → Stripe SDK threw `ERR_INVALID_CHAR` in the Authorization header (surfaced as `StripeConnectionError`). Fix: write the value with `[IO.File]::WriteAllText()` (no newline) and pass the file to `--data-file`.
- **Lint fix:** pre-existing `set-state-in-effect` error in `MobileCard` — flip now triggered alongside `setPhase('open')` instead of a separate effect.
- Commits: `6245385` (checkout fn), `d16a5b0` (webhook fn), `5c6efe5` (rules), `9992c1b` (storefront). Node 20 functions runtime is deprecated (decommission 2026-10-30) — upgrade before then.
### 2026-06-09 — Commerce Migration Kickoff: Spec + Phase 1 (Catalog CMS)
- **Brainstormed + spec'd** the full move off Shopify to a self-hosted stack (Stripe Checkout + own product CMS + order tracking). Spec at `docs/superpowers/specs/2026-06-09-commerce-migration-design.md`, Phase 1 plan at `docs/superpowers/plans/2026-06-09-phase1-catalog-cms.md`. Working on branch `feature/commerce-migration`.
- **Key decisions:** Stripe Checkout Sessions (hosted, NZD, inline price_data — no Stripe catalog sync); Firestore = catalog source of truth, Stripe webhook = order source of truth; guest checkout + email order tracking; Resend for transactional email; flat-rate shipping (provisional); launch one flagship product but data-driven for many.
- **Phase 1 implemented (subagent-driven, 3 implementer dispatches + inline review):**
  - `storeProducts` Firestore collection: security rules (public read where `status==published`, editor/admin write) + composite index (`status` + `sortOrder`) — both deployed via `leojfx@gmail.com`.
  - Portal: `slugify`/`dollarsToCents`/`centsToDollars` utils; `StoreProducts.jsx` CMS (CRUD, multi-image upload to Storage, draft/publish, price dollars↔cents, slug auto-gen + dedupe, ∞ inventory); route `/store-products` + "Store" sidebar nav.
  - Storefront: added `firebase` SDK + read-only `lib/firebase.js`; `useProducts.js` hook (one-time getDocs of published, ordered); `InteractiveCards.jsx` renders flagship title/subtitle/price from Firestore with graceful fallback to existing static markup. Buy Button untouched (replaced in Phase 2).
  - Money stored as integer cents everywhere. Build + lint clean on both apps.
- **Gotcha caught in review:** published+sortOrder query needs a composite index (verified it errors without one; index deployed).
- **Joel verified Phase 1 live:** created + published a product in the portal Store CMS, confirmed it rendered on the storefront from Firestore. (Stale-bundle gotcha: a hard refresh was needed to load the new build.)
- **Phase 2 planned + scoped:** wrote the Phase 2 plan, then trimmed it from a full cart to a **direct Buy Now → Stripe Checkout** (single-product). Build paused pending Jesse's Stripe account.
- Commits: `21b407c` (docs), `b64cc8f` (rules+utils), `9853a9f` (CMS page), `a003e35` (storefront), `2aa3a64` (index), `c3257e9` (docs), `03b4960`+`14164a5` (phase 2 plan). All on `feature/commerce-migration`.

_(Older sessions — May 2026 storefront polish, Instagram feed, image compression, custom-domain/DNS-to-Cloudflare fix, mobile card rebuild — trimmed; see git history.)_

## Key Decisions
- **Going fully off Shopify** → own catalog CMS (Firestore) + Stripe Checkout (hosted) + own order system. Full spec: `docs/superpowers/specs/2026-06-09-commerce-migration-design.md`. Firestore = catalog source of truth; Stripe webhook = order source of truth; prices stored as integer cents.
- **Stripe Checkout Sessions (hosted), not Payment Element** — least PCI surface, handles wallets/shipping/dynamic methods; inline `price_data` from Firestore (no Stripe product sync).
- **Cart-based checkout** (built Phase 2.5) — `/shop/:slug` → Zustand+localStorage cart (`stores/cart.js`) → `/cart` → `createCheckoutSession` (takes a line-item array) → Stripe hosted. (Superseded the original single-product "Buy Now, no cart" plan.)
- **Primary product image = `images[0]`** everywhere (product-page gallery default, home cards, cart). Portal "Set main" reorders the array; storefront `ProductPage` renders the full array as a gallery.
- **Guest checkout + email order tracking** (no customer accounts); **Resend** for transactional email (Phase 4).
- **No GST v1** — MLH not GST-registered; no GST line on receipts. Revisit if/when registered.
- **$7 flat NZ shipping + free Christchurch pickup** — two Stripe Checkout shipping options (pickup added 2026-06-19). Server is source of truth (`SHIPPING_FLAT_CENTS` in functions/index.js); cart shows $7 as a display-only estimate.
- **Portal order edits are field-restricted by rules** — editors may update only `status`/`fulfillment`/`notes`/`updatedAt` (`diff().affectedKeys().hasOnly()`); money/items/customer fields can only be written by Cloud Functions.
- Both portal and storefront use JSX (not TypeScript) — consistent stack
- Zustand for state management in both apps — portal stores + storefront cart (`stores/cart.js`, localStorage-persisted)
- Single Firebase project (`my-living-hope`) for everything — portal + live storefront as separate web apps
- Priority: portal functionality → storefront
- All users (Joel, Jesse, Annabelle) can access Claude Context page
- Storefront deployed to Firebase Hosting (planned), checkout via Shopify Buy Button overlay
- **Buy Button over Storefront API** — only 1 product, avoids API token issues, can revisit if catalog grows
- **Focus on flagship product** — Joel pitching Jesse to lead with 1 card pack, others still in dev
- **FormSubmit.co for contact form** — free, no backend, no API key. First submission requires email verification by Jesse.
- **Storefront domain** — mylivinghope.org.nz (was .co.nz in old config). Hosted on Firebase as site `mylivinghope`, separate from portal's default site.
- **Tailwind v4 + inline styles** — Tailwind v4 cascade layers can conflict with custom CSS classes. For responsive positioning that must work, use JS-driven inline styles (see Hero.jsx pattern).
- **Domain decoupled from Shopify** — Shopify for products/checkout only, domain DNS managed separately. mylivinghope.org.nz registered via Google Domains (now Squarespace Domains).
- **CSS transforms break position:fixed** — ScrollReveal's `transform: translateY(0)` on `.in-view` creates a containing block. Use `transform: translate() scale()` instead of `position: fixed` for card expand animations. See InteractiveCards.jsx MobileCard pattern.
- **DNS via Cloudflare** — domain moved from Google Cloud DNS to Cloudflare. A record must be grey cloud (DNS-only) for Firebase Hosting to work — Cloudflare proxy breaks Firebase's domain matching.
- **Instagram posts via embed.js** — curated post URLs with Instagram's official embed script, no API keys or third-party services. Posts are manually updated in `InstagramFeed.jsx` POSTS array.

## Known Issues
- **Stripe payouts disabled** — live account `charges_enabled=true` but `payouts_enabled=false`. Payments are taken but stay in the Stripe balance until Jesse finishes bank verification.
- **Pickup orders still collect a shipping address** — Stripe Checkout's `shipping_address_collection` applies to the whole session; it can't be dropped per shipping option. So "Pickup in Christchurch" orders still have an address attached. Harmless; cleaner fix later if it matters.
- **`success_url`/`cancel_url` hardcoded to prod** in `functions/index.js` (`STOREFRONT_URL`) — now correct for prod, but local checkout testing won't exercise the success/cancel pages or cart-clear. Switch to env-based URLs if testing checkout locally.
- **Dead Shopify defensive code in Header.jsx** — the `z-[99999]` + `stopPropagation` cart-button workarounds for the (now-removed) Shopify SDK overlay are harmless but no longer needed; clean up opportunistically.
- MCP server not yet wired into Joel's `.claude/settings.json`
- PWA manifest icon missing (`pwa-192x192.png` — console warning on Claude page)
- **www subdomain** — CNAME added in Cloudflare but not yet registered as custom domain in Firebase Hosting. Visiting www.mylivinghope.org.nz will fail until added.
- **Firebase deploy permissions** — `joel@tempero.nz` gets 403 on Hosting API; must use `leojfx@gmail.com` for deploys. Run `firebase login:use leojfx@gmail.com` in storefront dir before deploying.
