# My Living Hope

## Overview
- **Client**: My Living Hope (greeting card business)
- **Type**: Shopify Storefront + Firebase Admin Portal
- **Status**: In Progress

## Project Structure
- `mylivinghope/` — Shopify theme (Liquid templates, CSS, JS)
- `portal.mylivinghope/` — React admin portal (Vite + Firebase)
- `mylivinghope/web/` — Legacy Next.js app (deprecated, appears abandoned)

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
- **Storefront**: Shopify (Liquid, custom theme)
- **Portal Frontend**: React 19 + Vite 7 + Tailwind CSS v4
- **Portal State**: Zustand
- **Portal Forms**: React Hook Form + Zod validation
- **Portal Tables**: TanStack React Table
- **Portal Routing**: React Router v7
- **Backend/DB**: Firebase (Firestore)
- **Auth**: Firebase Auth
- **Icons**: Lucide React

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

## Code Conventions
- JSX (not TSX) — portal uses plain JavaScript with JSX
- Component structure: `components/ui/` (primitives), `components/layout/` (shell)
- Pages in `src/pages/`, hooks in `src/hooks/`, stores in `src/stores/`
- Firebase config in `src/lib/firebase.js`

## Current Progress
- Shopify theme built with custom sections (hero, cards, testimonials, etc.)
- Portal scaffolded with auth, layout, routing, and page stubs
- UI component library started (Button, Card, Modal, Table, Input, Select, Badge)
- Firebase integration with auth hook and collection hook
- **Design specs complete** for both headless storefront and shared AI context layer
- **Implementation plans complete** for both subsystems (22 tasks total)

## Next Steps
- [ ] Execute shared AI context layer plan (8 tasks) — use subagent-driven-development
  - Plan: `docs/superpowers/plans/2026-04-18-shared-ai-context-layer.md`
  - Set up git worktree first (`.worktrees/` dir, branch `feature/shared-ai-context`)
- [ ] Execute headless storefront plan (14 tasks) — after context layer
  - Plan: `docs/superpowers/plans/2026-04-18-headless-storefront.md`
- [ ] Review and clean up git status (many deleted/unstaged files)

## Session Log
### 2026-04-18
- Initial scan: identified project structure (Shopify theme + React portal)
- Created CLAUDE.md for project tracking
- Brainstormed two subsystems: headless storefront (Next.js + Shopify Storefront API) and shared AI context layer (Firebase Storage sync + Firestore MCP server)
- Wrote and committed design specs: `docs/superpowers/specs/2026-04-18-headless-storefront-design.md` and `docs/superpowers/specs/2026-04-18-shared-ai-context-layer-design.md`
- Wrote and committed implementation plans: `docs/superpowers/plans/2026-04-18-headless-storefront.md` and `docs/superpowers/plans/2026-04-18-shared-ai-context-layer.md`
- Ready to execute — start with context layer plan using subagent-driven-development

## Key Decisions
- Portal uses JSX (not TypeScript) — keep consistent
- Zustand for state management over Redux/Context
- Single Firebase project (`my-living-hope`) for everything — portal + live storefront hosted as separate web apps. `mlh-website-2a597` deleted 2026-04-18.

## Known Issues
- Many files showing as deleted in git status — needs investigation
- Legacy `mylivinghope/web/` Next.js app may need cleanup
