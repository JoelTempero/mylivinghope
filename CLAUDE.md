# My Living Hope

## Overview
- **Client**: My Living Hope (greeting card business, Jesse Major founder)
- **Type**: Shopify Storefront + Firebase Admin Portal
- **Status**: Portal functional, storefront rebuilt (React + Vite + Buy Buttons)

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

## Next Steps
- [ ] **Creative overhaul** — implement CREATIVE.md direction: restructure homepage narrative, add card motif system, vary section rhythm, add texture/emotion. See `storefront.mylivinghope/CREATIVE.md` for full plan.
- [ ] **Enable Shopify Buy Button sales channel** — Jesse needs to add Buy Button channel in Shopify admin, then generate embed code for the flagship product. Update `BuyButton.jsx` with the real `storefrontAccessToken` and `productId`.
- [ ] **Add real images** — export hero/about/card product photos and add to `storefront.mylivinghope/public/images/`
- [ ] **Get Jesse's actual social URLs** — Facebook/Instagram currently use best-guess URLs, need confirmation
- [ ] **Deploy storefront** — set up Firebase Hosting site for storefront, configure `firebase.json` with SPA rewrites
- [x] ~~**Design pass** — applied full MLH design system to storefront~~
- [x] ~~**Design audit** — council audit (10 members), 20 issues fixed~~
- [x] ~~**Creative council audit** — 10 design members, CREATIVE.md + DESIGN.md created~~
- [x] ~~**Buy Button pivot** — replaced Next.js + Storefront API with React + Vite + Buy Buttons~~
- [ ] Wire MCP server into Joel's `.claude/settings.json` for native Firestore tools
- [ ] Deploy Cloud Function (`firebase deploy --only functions --project my-living-hope`)
- [ ] Help Jesse get Claude Code set up on his machine
- [ ] Joel to review portal Claude page live and fix any issues

## Session Log
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

### 2026-05-01 — Buy Button Pivot (Autopilot)
- Brainstormed and approved pivot from Next.js + Shopify Storefront API to React + Vite + Buy Buttons
- Motivation: Next.js lag on Windows, Storefront API token issues, massive overkill for 1 product
- Wrote design spec (`docs/superpowers/specs/2026-05-01-storefront-buy-button-pivot-design.md`)
- Wrote implementation plan (`docs/superpowers/plans/2026-05-01-storefront-buy-button-pivot.md`)
- Executed all 8 tasks: scaffold, CSS/router, layout, sections, Buy Button, pages, SEO, cleanup
- Deleted all Next.js/Shopify API code (29 files, ~2000 lines removed)
- Ported all design work from TSX to JSX — identical visual output
- New stack: React 19 + Vite 7 + React Router v7 + Tailwind CSS v4 + Lucide React
- Commerce: Shopify Buy Button SDK (placeholder until Jesse enables the channel)
- 3 pages: Home (6 sections), About (founder + audiences + mission), Contact (info + mailto form)
- Build: 1.75s clean, 177 packages. Dev server on port 3854.
- Key decision: Joel to pitch Jesse on focusing on 1 flagship product for now
- **Needs Joel:** Enable Buy Button channel in Shopify admin, get real product photos

### 2026-04-28 — Council Design Audit + Autopilot Fixes
- Ran /council-auto with 10 design-focused members (4 completed, 6 hit rate limits — filled gaps manually)
- Members: Pixel Perfectionist, Advocate (accessibility), Device Juggler (responsive), Steve Jobs, Wes Anderson, Saul Bass, Frank Ocean, Rachel, Grandma, Picky Client
- 20 issues identified across P0-P3 priority tiers, all fixed in one session
- **P0 Critical:** Fixed green-on-green testimonials (WCAG contrast failures), darkened text-muted (#8a8788→#706e6f), fixed 6 touch target violations (cart button, quantity buttons, trash icon, social icons)
- **P1 Major:** Header now transitions from transparent to solid on scroll; homepage reordered (products right after hero instead of buried under 3 sections)
- **P2 Significant:** About page completely rewritten (was copy-paste of homepage — now has unique founder story + audience cards + mission section); removed duplicate "Get Cards" CTA; removed fake newsletter form; updated social URLs; scoped global anchor color to prevent green-on-charcoal in footer; fixed white/70 contrast on page headers
- **P3 Polish:** Replaced emojis with SVG icons in hero; hid floating cards on small screens; unified cart badge positioning; added global focus-visible styles; added secondary CTA to bottom section
- Build clean, lint clean, 11 files changed

### 2026-04-27 — Autopilot: Full Design Pass
- Applied complete MLH design system to storefront, matching current Shopify site
- Fonts: Libre Baskerville (headings) + Montserrat (body) via next/font/google
- Full color palette as Tailwind theme tokens (forest-green, charcoal, cream, soft-blush, etc.)
- CSS animations: reveal (scroll-in), float (hero accents), reduced-motion support
- Header: forest green, fixed, scroll-aware, mobile hamburger, skip-to-content link
- Footer: charcoal 4-column with newsletter signup and social icons
- Homepage: Hero (gradient + floating card accents), About, How It Works (3 steps), Testimonials (glassmorphism on green), CTA
- Products: green gradient page header, cards with hover elevation + sale badges
- Product detail: styled gallery, pill variant selector, animated add-to-cart with success state
- About: full story with Psalm quote, how-it-works mini-section
- Contact: info cards (location/phone/email) + styled contact form
- CartDrawer: slide animation, body scroll lock, empty state, checkout button
- All real MLH copy from the current Shopify theme
- Placeholder image areas where Joel needs to add actual product/hero photos

### 2026-04-27 — Autopilot: Headless Storefront Build
- Scaffolded `storefront.mylivinghope/` with Next.js 16.2.4 (App Router, TypeScript, Tailwind v4)
- Checked Next.js 16 docs for breaking changes — `revalidate` export still supported, `params` is Promise-based (already in plan)
- Built all 13 tasks from the implementation plan in one session
- Shopify API client (GraphQL), types, cart store (Zustand), CartProvider + API route
- Layout shell: Header with responsive mobile hamburger menu (plan only had desktop), Footer
- Product components: ProductCard, ProductGrid, VariantSelector, AddToCartButton
- Pages: Homepage (hero + featured products), Products listing (ISR), Product detail (image gallery, variants, JSON-LD), About, Contact
- Cart drawer with line items, quantity controls, checkout redirect to Shopify
- SEO: dynamic sitemap, metadata on all pages, structured data on product pages
- Next.js config: Shopify CDN image domain
- Added graceful fallbacks for missing Shopify token (pages render without products instead of crashing)
- Build: clean, all routes compile
- **Needs Joel**: Generate Shopify Storefront API token and add to `.env.local`

### 2026-04-18 (session 2)
- Built shared AI context layer (8 tasks): firebase-admin scripts, sync-context CLI, Firestore query CLI, MCP server, Cloud Function, portal Sync Context button
- Consolidated Firebase projects — deleted `mlh-website-2a597`, keeping `my-living-hope`
- Added Claude Context page to portal (3 tabs: Shared Context, Joel's Notes, Jesse's Notes)
- Populated all 3 context files with real business data + Jesse's setup guide
- Fixed Storage rules (added `shared/` path) and CORS for the bucket
- Deployed portal to my-living-hope.web.app
- Priority decision: portal polish/fixes first, then headless storefront

### 2026-04-18 (session 1)
- Initial scan: identified project structure (Shopify theme + React portal)
- Created CLAUDE.md, brainstormed headless storefront + shared AI context layer
- Wrote design specs and implementation plans for both subsystems

## Key Decisions
- Both portal and storefront use JSX (not TypeScript) — consistent stack
- Zustand for portal state management; storefront has no state management (Buy Button handles cart)
- Single Firebase project (`my-living-hope`) for everything — portal + live storefront as separate web apps
- Priority: portal functionality → storefront
- All users (Joel, Jesse, Annabelle) can access Claude Context page
- Storefront deployed to Firebase Hosting (planned), checkout via Shopify Buy Button overlay
- **Buy Button over Storefront API** — only 1 product, avoids API token issues, can revisit if catalog grows
- **Focus on flagship product** — Joel pitching Jesse to lead with 1 card pack, others still in dev

## Known Issues
- Cloud Function `generateContext` not yet deployed (needs `firebase deploy --only functions`)
- MCP server not yet wired into Joel's `.claude/settings.json`
- PWA manifest icon missing (`pwa-192x192.png` — console warning on Claude page)
