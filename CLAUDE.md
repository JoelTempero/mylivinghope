# My Living Hope

## Overview
- **Client**: My Living Hope (greeting card business, Jesse Major founder)
- **Type**: Shopify Storefront + Firebase Admin Portal
- **Status**: Portal functional, storefront next

## Project Structure
- `mylivinghope/` — Shopify theme (Liquid templates, synced by Shopify)
- `portal.mylivinghope/` — React admin portal (Vite + Firebase)

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
- **Storefront**: Shopify (Liquid, custom theme) — planned headless rebuild
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

## Code Conventions
- JSX (not TSX) — portal uses plain JavaScript with JSX
- Component structure: `components/ui/` (primitives), `components/layout/` (shell)
- Pages in `src/pages/`, hooks in `src/hooks/`, stores in `src/stores/`
- Firebase config in `src/lib/firebase.js`

## Current Progress
- Shopify theme built with custom sections (hero, cards, testimonials, etc.)
- Portal fully functional — all 12 pages with working Firestore CRUD
- UI component library: Button, Card, Modal, Table, Input, Select, Badge
- Firebase integration with auth hook and useCollection hook
- Shared AI context layer complete (scripts, MCP server, Cloud Function, portal Claude page)
- Context files populated with real business data + Jesse's setup guide
- Storage rules and CORS configured for shared context files
- Deployed to my-living-hope.web.app

## Next Steps
- [ ] Joel to review portal Claude page live and fix any issues
- [ ] Build headless storefront (14-task plan at `docs/superpowers/plans/2026-04-18-headless-storefront.md`)
- [ ] Wire MCP server into Joel's `.claude/settings.json` for native Firestore tools
- [ ] Deploy Cloud Function (`firebase deploy --only functions --project my-living-hope`)
- [ ] Help Jesse get Claude Code set up on his machine

## Session Log
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
- Zustand for state management over Redux/Context
- Single Firebase project (`my-living-hope`) for everything — portal + live storefront as separate web apps
- Priority: portal functionality → headless storefront
- All users (Joel, Jesse, Annabelle) can access Claude Context page

## Known Issues
- Cloud Function `generateContext` not yet deployed (needs `firebase deploy --only functions`)
- MCP server not yet wired into Joel's `.claude/settings.json`
- PWA manifest icon missing (`pwa-192x192.png` — console warning on Claude page)
