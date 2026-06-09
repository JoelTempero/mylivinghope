# My Living Hope

## Overview
- **Client**: My Living Hope (greeting card business, Jesse Major founder)
- **Type**: Shopify Storefront + Firebase Admin Portal
- **Status**: Portal functional, storefront live at mylivinghope.org.nz (Firebase Hosting, DNS via Cloudflare)

## Project Structure
- `mylivinghope/` — Shopify theme (Liquid templates, synced by Shopify)
- `portal.mylivinghope/` — React admin portal (Vite + Firebase)
- `storefront.mylivinghope/` — React + Vite storefront (Shopify Buy Buttons)

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
- **Storefront (new)**: React 19 + Vite 7 + Tailwind CSS v4 + Shopify Buy Buttons
- **Storefront (legacy)**: Shopify Liquid theme — being replaced by headless
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
  - **Phase 2 (Buy Now + Payments) — plan ready, build paused:** plan at `docs/superpowers/plans/2026-06-09-phase2-checkout-payments.md`. Scoped to a **direct "Buy Now" → Stripe Checkout** (no cart, since single product). Blocked on Jesse creating a Stripe account (test-mode key needed).

## Next Steps
- [ ] **BLOCKER — Jesse: create a Stripe account** (test mode). Joel sets the secret via `firebase functions:secrets:set STRIPE_SECRET_KEY`. Phase 2 build is ready to go the moment we have a test key.
- [ ] **Execute Phase 2** (`docs/superpowers/plans/2026-06-09-phase2-checkout-payments.md`): `createCheckoutSession` + `stripeWebhook` Cloud Functions, orders/counters rules, storefront Buy Now → Stripe + success/cancel pages, test-mode E2E. (Provisional flat shipping `$7` until Jesse confirms.)
- [ ] **Jesse confirmations for Phase 2/4:** flat-rate shipping $ + free-over threshold; GST registration (prices GST-inclusive?); Resend account + verify `mylivinghope.org.nz` sending domain
- [ ] Branch `feature/commerce-migration` (8 commits) — merge to main once Phase 2 lands & is tested
- [ ] **Add www.mylivinghope.org.nz** — CNAME added in Cloudflare but also needs adding as custom domain in Firebase Hosting console
- [ ] **Jesse: activate FormSubmit.co** — first contact form submission triggers verification email to prayerprompts@outlook.com, must click to confirm
- [ ] Wire MCP server into Joel's `.claude/settings.json` for native Firestore tools
- [ ] Deploy Cloud Function (`firebase deploy --only functions --project my-living-hope`)
- [ ] Help Jesse get Claude Code set up on his machine
- [ ] Joel to review portal Claude page live and fix any issues

## Session Log
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

### 2026-05-05 — Custom Domain Fix, Instagram Feed & Image Responsive Fixes
- **Custom domain fixed**: mylivinghope.org.nz was showing "Site Not Found" despite DOMAIN_ACTIVE status in Firebase API. DNS moved to Cloudflare (grey cloud). Fresh deploy resolved stale CDN state.
- **Instagram feed**: Built `InstagramFeed.jsx` — 4 embedded posts in a single row (1600px wide container), added to Home (above CTA) and About (above footer). Uses Instagram embed.js with curated post URLs, no API keys.
- **Hero image**: Rewrote JS positioning formula — image starts shifting right at 2190px viewport width (was 1600px), preventing text overlap on mid-size screens.
- **CTA mobile image**: Removed `h-[630px] object-cover scale(1.3)` crop — image now displays at full natural size.
- Firebase account: deploys use `leojfx@gmail.com` (project owner); `joel@tempero.nz` lacks Hosting API permissions.
- 3 deploys to mylivinghope.org.nz, build clean (2.12s)
- Files changed: InstagramFeed.jsx (new), Home.jsx, About.jsx, Hero.jsx, CTA.jsx

### 2026-05-03 — Mobile Polish, Image Compression & DNS Investigation
- **Sticky parallax disabled on mobile**: Wrapped sticky-stack CSS in `@media (min-width: 768px)` — sections scroll normally on mobile, desktop unchanged
- **Mobile card interaction rebuilt**: Removed drag-to-snap, built single-element expand+flip using CSS `transform: translate() scale()`. Tap card → transforms to viewport center while flipping. No portals, no `position: fixed` (breaks inside transform ancestors like ScrollReveal). ScrollReveal removed from mobile cards.
- **Image compression**: All images resized via sharp — hero 4234→1400px, Jesse 1208→600px, twocards 2024→800px, logo/icon 3840→200/100px, cards to 2x retina. 3 PNGs→WebP. Total: 6MB → 420KB (93%).
- **DNS investigation**: mylivinghope.org.nz nameservers point to Google Cloud DNS (ns-cloud-b1–b4), not Shopify. TXT verification record exists in Shopify but isn't served. WHOIS shows Google Domains (now Squarespace) as registrar. Jesse confirms he only used Shopify. Cloud DNS API not enabled on Firebase project — zone likely in Google-managed infra.
- **Domain decision**: Proposed decoupling domain from Shopify entirely. Shopify manages products only, DNS managed separately (Cloudflare or Squarespace Domains).
- 2 deploys to mylivinghope.web.app, build clean (1.85s)
- Files changed: InteractiveCards.jsx, index.css, Header.jsx, Footer.jsx, About.jsx, plus 11 optimized images

### 2026-05-02 — Storefront Polish & First Deploy
- **Contact form**: Replaced mailto: with FormSubmit.co AJAX POST, added sending/sent/error states
- **Privacy Policy page** (`/privacy`): NZ Privacy Act 2020, plain language, covers Shopify + FormSubmit data
- **Terms & Conditions page** (`/terms`): Consumer Guarantees Act 1993, 14-day returns, NZ governing law
- **Footer**: Added privacy/terms links in copyright bar (mobile + desktop), fixed Instagram URL to @mylivinghopenz
- **Favicon**: Generated ico/16/32/180 from lantern icon via sharp, wired into index.html
- **SEO**: Sitemap updated (removed /contact, added /privacy + /terms), domain → mylivinghope.org.nz, og:url added
- **Hero image fix**: 1220px fixed width, JS-driven `right` calculation that slides image right as viewport shrinks (prevents text overlap). Used tuner UI for Joel to dial in exact values.
- **Firebase Hosting**: Configured as site `mylivinghope` on project `my-living-hope`, deployed to mylivinghope.web.app
- **DNS**: A records pointed to Firebase (199.36.158.100 + .101), TXT verification in place, waiting for propagation + SSL
- 12 commits this session, build clean (1.88s)

### 2026-05-02 — Mobile Polish + Cart Button Fix
- **Scripture interlude mobile**: Split verse into 6 lines (from 3) with separate fit-to-width sizing (0.9x scale), desktop layout unchanged. Disabled glow hover on mobile (screen width check).
- **Footer mobile redesign**: Reordered to contact form → contact details/socials → centered logo (h-32) + copyright. Quick links hidden on mobile. Removed Facebook icon (client doesn't have it).
- **Mobile card interaction**: Added mouse+touch drag to MobileCard with 8px threshold, horizontal-only (vertical scrolls page), tap-to-flip via onClick, smooth snap-back animation.
- **Cart button fix (major)**: Header cart button was unresponsive. Root cause: Shopify Buy Button SDK injects invisible overlay blocking clicks. Fix: `z-[99999]` on button + `stopPropagation()` on mouseDown/touchStart/click to prevent SDK event interception. Also added `pointer-events: none` to scroll progress bar.
- Files changed: Header.jsx, BuyButton.jsx, ScriptureInterlude.jsx, Footer.jsx, InteractiveCards.jsx, index.css

### 2026-05-01 — Creative Council Audit + Overhaul (Autopilot)
- Ran /council-auto with 10 design-focused members: Pixel Perfectionist, Steve Jobs, Wes Anderson, Saul Bass, Frank Ocean, Banksy, Hook Writer, Storyteller, Device Juggler, Rachel
- Unanimous verdict: functional but generic — needs soul, visual identity, and narrative restructure
- Created 3 design docs: `CREATIVE.md` (direction), `DESIGN.md` (system), `ANIMATIONS.md` (motion)
- **Implemented creative overhaul (10 tasks):**
  - Animation system: useScrollReveal hook (IntersectionObserver), useCardTilt hook (3D perspective), 6 reveal variants (fade-up, slide-left/right, scale-up, blur-in, fade-in), stagger delays, hero entrance sequence, card deal animation
  - New components: ScrollReveal, CardTilt, CardFlip, BoxReveal, ProductImage, ScrollProgress, ScriptureInterlude
  - Homepage restructured: Hero (wound) → Origin story → Scripture interlude → Product + How It Works (merged) → Testimonials → CTA (echoes wound)
  - Hero redesigned: "You want to pray but the words won't come" → "Find Your Voice in Prayer", flippable demo card (Loneliness front/Scripture back), card deal entrance, scroll indicator
  - Product showcase: 4 interactive emotion cards with tilt, merged how-it-works (Feel/Read/Pray), single focused Buy CTA
  - All sections wired with scroll-triggered reveals (varied per section, not all fade-up)
  - Micro-interactions: btn-interactive (scale+shadow hover, bounce click), form focus glow, scroll progress bar, staggered mobile menu
  - Responsive fixes: svh hero height, viewport-fit=cover, safe-area padding, 48px hamburger tap target, footer link spacing
  - Deleted HowItWorks.jsx (merged into ProductShowcase)
  - Asset directories scaffolded: public/images/{cards,product,box}/, public/video/
- Build: 1.76s clean, lint clean. 29 files changed, +1555 -434 lines.
- **Needs Joel:** Drop 3D card renders, product photos, and box video into the scaffolded directories

### 2026-05-01 — Buy Button Pivot + Creative Overhaul
- Pivoted from Next.js to React+Vite+Buy Buttons. Creative council audit + full design overhaul.
- See git history for full detail (trimmed for brevity)

## Key Decisions
- **Going fully off Shopify** → own catalog CMS (Firestore) + Stripe Checkout (hosted) + own order system. Full spec: `docs/superpowers/specs/2026-06-09-commerce-migration-design.md`. Firestore = catalog source of truth; Stripe webhook = order source of truth; prices stored as integer cents.
- **Stripe Checkout Sessions (hosted), not Payment Element** — least PCI surface, handles wallets/shipping/dynamic methods; inline `price_data` from Firestore (no Stripe product sync).
- **Single product → direct "Buy Now" (no cart)** — cart/drawer is YAGNI for one product; the checkout function already takes multiple line items, so a cart is a clean add when the catalog grows.
- **Guest checkout + email order tracking** (no customer accounts); **Resend** for transactional email (Phase 4).
- Both portal and storefront use JSX (not TypeScript) — consistent stack
- Zustand for portal state management; storefront has no state management (Buy Button handles cart)
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
- **Shopify SDK overlay blocks clicks** — the Buy Button SDK injects invisible fixed overlays. Any custom buttons that need to sit above it require `z-[99999]` + `stopPropagation` on mouseDown/touchStart/click. See Header.jsx cart buttons for the pattern.
- Cloud Function `generateContext` not yet deployed (needs `firebase deploy --only functions`)
- MCP server not yet wired into Joel's `.claude/settings.json`
- PWA manifest icon missing (`pwa-192x192.png` — console warning on Claude page)
- **www subdomain** — CNAME added in Cloudflare but not yet registered as custom domain in Firebase Hosting. Visiting www.mylivinghope.org.nz will fail until added.
- **Firebase deploy permissions** — `joel@tempero.nz` gets 403 on Hosting API; must use `leojfx@gmail.com` for deploys. Run `firebase login:use leojfx@gmail.com` in storefront dir before deploying.
