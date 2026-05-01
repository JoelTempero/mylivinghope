# My Living Hope

## Overview
- **Client**: My Living Hope (greeting card business, Jesse Major founder)
- **Type**: Shopify Storefront + Firebase Admin Portal
- **Status**: Portal functional, storefront deployed to mylivinghope.web.app (DNS pending for mylivinghope.org.nz)

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

## Next Steps
- [ ] **Verify DNS propagation** — check that mylivinghope.org.nz resolves to Firebase IPs and SSL provisions (A records: 199.36.158.100 + 199.36.158.101)
- [ ] **Jesse: activate FormSubmit.co** — first contact form submission triggers verification email to prayerprompts@outlook.com, must click to confirm
- [ ] **Instagram embed** — explore embedding Instagram feed as a section on homepage and about page (@mylivinghopenz)
- [ ] **Test mobile card drag on real device** — touch drag only tested in browser emulation, may need threshold/scroll tuning
- [ ] Wire MCP server into Joel's `.claude/settings.json` for native Firestore tools
- [ ] Deploy Cloud Function (`firebase deploy --only functions --project my-living-hope`)
- [ ] Help Jesse get Claude Code set up on his machine
- [ ] Joel to review portal Claude page live and fix any issues

## Session Log
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

### 2026-04-27 — Autopilot: Full Design Pass + Headless Storefront Build
- Applied complete MLH design system to storefront, later pivoted from Next.js to React + Vite + Buy Buttons
- See earlier session logs for full detail (trimmed for brevity)

## Key Decisions
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

## Known Issues
- **Shopify SDK overlay blocks clicks** — the Buy Button SDK injects invisible fixed overlays. Any custom buttons that need to sit above it require `z-[99999]` + `stopPropagation` on mouseDown/touchStart/click. See Header.jsx cart buttons for the pattern.
- Cloud Function `generateContext` not yet deployed (needs `firebase deploy --only functions`)
- MCP server not yet wired into Joel's `.claude/settings.json`
- PWA manifest icon missing (`pwa-192x192.png` — console warning on Claude page)
- Mobile card drag untested on real device — `touch-none` removed, horizontal threshold added, but may need tuning
