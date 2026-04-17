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

## Next Steps
- [ ] Assess current portal state and identify what's functional vs stub
- [ ] Continue building out portal CRUD pages
- [ ] Review and clean up git status (many deleted/unstaged files)

## Session Log
### 2026-04-18
- Initial scan: identified project structure (Shopify theme + React portal)
- Created CLAUDE.md for project tracking

## Key Decisions
- Portal uses JSX (not TypeScript) — keep consistent
- Zustand for state management over Redux/Context

## Known Issues
- Many files showing as deleted in git status — needs investigation
- Legacy `mylivinghope/web/` Next.js app may need cleanup
