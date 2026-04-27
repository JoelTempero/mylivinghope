# My Living Hope

## Overview
- **Client**: My Living Hope (greeting card business, Jesse Major founder)
- **Type**: Shopify Storefront + Firebase Admin Portal
- **Status**: Portal functional, storefront scaffolded (needs Shopify token)

## Project Structure
- `mylivinghope/` — Shopify theme (Liquid templates, synced by Shopify)
- `portal.mylivinghope/` — React admin portal (Vite + Firebase)
- `storefront.mylivinghope/` — Next.js headless storefront (Shopify Storefront API)

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
- **Storefront (new)**: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Shopify Storefront API
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
- **Storefront**: TSX, TypeScript throughout
- Component structure: `components/ui/` (primitives), `components/layout/` (shell)
- Portal pages in `src/pages/`, storefront pages in `src/app/`
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
- **Headless storefront scaffolded** — Next.js 16, all pages and components built, builds clean
  - Homepage with hero + featured products
  - Products listing (/products) with ISR
  - Product detail (/products/[handle]) with image gallery, variants, add-to-cart, JSON-LD
  - Cart drawer with quantity controls and Shopify checkout redirect
  - About and Contact pages
  - Dynamic sitemap, SEO metadata
  - Responsive header with mobile hamburger menu

## Next Steps
- [ ] **Generate Shopify Storefront API token** — Joel needs to create a custom app in Shopify admin, enable Storefront API scopes, and add the token to `storefront.mylivinghope/.env.local`
- [ ] **Test storefront end-to-end** with live Shopify data (products, cart, checkout)
- [x] ~~**Design pass** — applied full MLH design system to storefront~~
- [ ] **Add real images** — export hero/about/card images from Shopify and add to `storefront.mylivinghope/public/images/`
- [ ] Wire MCP server into Joel's `.claude/settings.json` for native Firestore tools
- [ ] Deploy Cloud Function (`firebase deploy --only functions --project my-living-hope`)
- [ ] Help Jesse get Claude Code set up on his machine
- [ ] Joel to review portal Claude page live and fix any issues

## Session Log
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
- Portal uses JSX (not TypeScript) — keep consistent
- Storefront uses TypeScript (new project, different stack)
- Zustand for state management in both projects
- Single Firebase project (`my-living-hope`) for everything — portal + live storefront as separate web apps
- Priority: portal functionality → headless storefront
- All users (Joel, Jesse, Annabelle) can access Claude Context page
- Storefront deployed to Vercel (planned), checkout redirects to Shopify hosted checkout

## Known Issues
- Cloud Function `generateContext` not yet deployed (needs `firebase deploy --only functions`)
- MCP server not yet wired into Joel's `.claude/settings.json`
- PWA manifest icon missing (`pwa-192x192.png` — console warning on Claude page)
