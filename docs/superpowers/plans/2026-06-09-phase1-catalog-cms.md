# Phase 1 — Catalog CMS Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development or superpowers:executing-plans to implement task-by-task. Steps use checkbox (`- [ ]`) syntax.
> **Note on testing:** This stack has no test runner (lint + Vite build only), and Joel's profile favours practical verification over coverage. Verification here = `npm run build` + `npm run lint` + concrete manual checks. No test framework is introduced in Phase 1.

**Goal:** Build a Firestore-backed product catalog CMS in the portal, and have the storefront render the flagship product from Firestore (not hardcoded). Shopify Buy Button stays in place for now.

**Architecture:** New `storeProducts` Firestore collection (public read where published, admin/editor write). Portal gets a "Store ▸ Products" CRUD page cloned from the existing `Products.jsx` + `Inspiration.jsx` image-upload pattern. Storefront gains a read-only Firebase client and fetches published products.

**Tech Stack:** React 19, Vite 7, Tailwind v4, Firebase (Firestore + Storage), existing portal `useCollection` hook + `components/ui` primitives.

**Spec:** `docs/superpowers/specs/2026-06-09-commerce-migration-design.md` (§4 data model, §6 Phase 1).

---

## Data shape: `storeProducts` document

```
slug: string            // url-safe unique, auto-generated from title
title: string
subtitle: string
description: string     // long-form plain text
images: string[]        // Firebase Storage download URLs; [0] = primary
priceNZD: number        // INTEGER CENTS (e.g. 2500 = $25.00)
compareAtPrice: number | null  // cents
status: 'draft' | 'published'
inventory: number | null       // null = untracked/unlimited
weight: number | null          // grams (future shipping)
sortOrder: number
seo: { title: string, description: string }
createdAt, updatedAt           // serverTimestamp (added by useCollection)
```

Money is stored in **cents**; the CMS form shows dollars and converts on save/load.

---

## Task 1: Firestore security rules for `storeProducts`

**Files:** Modify `portal.mylivinghope/firestore.rules` (add block before the closing `}` of the `documents` match, alongside the other collections).

- [ ] **Step 1:** Add this rule block (reuses existing `canEdit()` / `isAdmin()` helpers):

```
// Store products — public catalog (Phase 1)
match /storeProducts/{productId} {
  // Public can read ONLY published products; editors/admins read all
  allow read: if resource.data.status == 'published' || canEdit();
  allow create, update: if canEdit();
  allow delete: if isAdmin();
}
```

- [ ] **Step 2:** Deploy rules. Run from `portal.mylivinghope`:
  `firebase deploy --only firestore:rules --project my-living-hope`
  (If 403: `firebase login:use leojfx@gmail.com` first — known permission issue.)
  Expected: "Deploy complete!"

- [ ] **Step 3:** Commit. `git add portal.mylivinghope/firestore.rules` → `git commit -m "feat(store): add storeProducts firestore rules"`

---

## Task 2: Portal utility helpers (pure functions)

**Files:** Modify `portal.mylivinghope/src/lib/utils.js`.

- [ ] **Step 1:** Add and export three helpers:
  - `slugify(str)` → lowercase, trim, spaces→`-`, strip non `[a-z0-9-]`, collapse repeats.
  - `dollarsToCents(str)` → `Math.round(parseFloat(str) * 100)` or `null` for empty.
  - `centsToDollars(cents)` → `(cents / 100).toFixed(2)` or `''` for null.

- [ ] **Step 2:** Verify manually in node: `node -e "..."` checking `slugify('Prayer Cards Vol. 1') === 'prayer-cards-vol-1'`, `dollarsToCents('25') === 2500`, `centsToDollars(2500) === '25.00'`.

- [ ] **Step 3:** Commit. `git commit -m "feat(store): add slug/price utils"`

---

## Task 3: Portal "Store Products" CMS page

**Files:** Create `portal.mylivinghope/src/pages/StoreProducts.jsx`.

Model the CRUD shell on `src/pages/Products.jsx` (search/filter, Table, add/edit Modal, delete confirm, `useAuth` gating with `isEditor`/`isAdmin`). Model image upload on `src/pages/Inspiration.jsx` (`uploadBytesResumable` → `getDownloadURL`, storage path `storeProducts/${Date.now()}_${safeName}`; `deleteObject` for removed images).

- [ ] **Step 1:** Build the page using `useCollection('storeProducts', { orderByField: 'sortOrder', orderDirection: 'asc' })`. Form fields: title, subtitle, description (Textarea), price ($, ↔ cents via utils), compareAtPrice ($), status select (draft/published), inventory (number, blank = null), weight (g), sortOrder (number), seo.title, seo.description, and a multi-image uploader writing to `images[]`.
- [ ] **Step 2:** On title blur (when slug empty / creating), auto-fill `slug` via `slugify`. Show the slug as an editable field. Block save on duplicate slug (check against loaded `products`).
- [ ] **Step 3:** On save: convert dollars→cents, coerce inventory/weight/sortOrder to number-or-null, default `sortOrder` to `(max existing)+1` for new. Use `add`/`update` from the hook.
- [ ] **Step 4:** Table columns: primary image thumb, title, price (`$` + centsToDollars), status `Badge`, inventory. Edit/delete actions (delete = `isAdmin`, also `deleteObject` each image).
- [ ] **Step 5:** Verify: `npm run lint` clean for the new file.
- [ ] **Step 6:** Commit. `git commit -m "feat(store): product CMS page"`

---

## Task 4: Wire route + sidebar nav

**Files:** Modify `portal.mylivinghope/src/App.jsx`, `portal.mylivinghope/src/components/layout/Sidebar.jsx`.

- [ ] **Step 1:** App.jsx — import `StoreProducts`, add `<Route path="/store-products" element={<StoreProducts />} />` inside the `AppLayout` route group.
- [ ] **Step 2:** Sidebar.jsx — import a Lucide icon (`ShoppingBag`), add `{ name: 'Store', href: '/store-products', icon: ShoppingBag }` to the `navigation` array (place after `Products`).
- [ ] **Step 3:** Commit. `git commit -m "feat(store): route + nav for product CMS"`

---

## Task 5: Verify portal CMS end-to-end (manual)

- [ ] **Step 1:** `cd portal.mylivinghope && npm run build` → expected: build succeeds, no errors.
- [ ] **Step 2:** `npm run dev`, log in, open **Store**. Create the flagship product (title, price e.g. $25, upload an image), save as **draft**.
- [ ] **Step 3:** Confirm it appears in the table with thumb + price; edit it; toggle to **published**; reload and confirm persistence (check the `storeProducts` doc via `node scripts/query-firestore.js storeProducts`).
- [ ] **Step 4:** No commit (verification only). If bugs found, fix in the relevant task's file and re-commit there.

---

## Task 6: Storefront read-only Firebase client

**Files:** Modify `storefront.mylivinghope/package.json`; create `storefront.mylivinghope/src/lib/firebase.js`, `storefront.mylivinghope/.env.example`; verify `.gitignore` ignores `.env.local`.

- [ ] **Step 1:** Install Firebase: `cd storefront.mylivinghope && npm install firebase`.
- [ ] **Step 2:** Create `src/lib/firebase.js` (read-only — Firestore only, no auth/storage):

```js
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export default app
```

- [ ] **Step 3:** Create `.env.example` mirroring the portal's (same VITE_FIREBASE_* keys). Create `.env.local` with the real `my-living-hope` web-app config values (from Firebase console). Confirm `.gitignore` contains `.env.local` (add if missing).
- [ ] **Step 4:** Commit. `git commit -m "feat(store): storefront read-only firebase client"` (do NOT commit `.env.local`).

---

## Task 7: Storefront product fetch hook

**Files:** Create `storefront.mylivinghope/src/hooks/useProducts.js`.

- [ ] **Step 1:** Export `useProducts()` — one-time `getDocs` (not realtime) of `query(collection(db,'storeProducts'), where('status','==','published'), orderBy('sortOrder','asc'))`. Return `{ products, loading, error }`. Map docs to `{ id, ...data }`.
- [ ] **Step 2:** Export `useProduct(slug)` convenience that filters `useProducts()` by slug (single-product v1 — avoids an extra index).
- [ ] **Step 3:** `npm run lint` clean.
- [ ] **Step 4:** Commit. `git commit -m "feat(store): useProducts fetch hook"`

---

## Task 8: Render flagship product from Firestore

**Files:** Modify the storefront product section that currently hardcodes the flagship product (`src/components/sections/Hero.jsx` and/or `src/components/sections/InteractiveCards.jsx` / `src/pages/Home.jsx` — locate the hardcoded title/price/description first with a grep for the current product copy).

- [ ] **Step 1:** Grep for the existing hardcoded product name/price to find the exact render site.
- [ ] **Step 2:** Replace hardcoded title/subtitle/description/price/primary-image with values from `useProduct(slug)` (use the published product's slug). Format price with a local `centsToDollars` helper. Keep layout/styling identical — data swap only.
- [ ] **Step 3:** Loading/empty fallback: while `loading`, keep existing static markup or a skeleton so the page never flashes empty. **Leave the Shopify `BuyButton` exactly as-is** (replaced in Phase 2).
- [ ] **Step 4:** Commit. `git commit -m "feat(store): render flagship product from firestore"`

---

## Task 9: Verify storefront end-to-end (manual)

- [ ] **Step 1:** `cd storefront.mylivinghope && npm run build` → expected: succeeds.
- [ ] **Step 2:** `npm run dev`, open the home/product page. Confirm the product title/price/image now come from the Firestore doc created in Task 5 (edit the doc in the portal → reload storefront → value changes).
- [ ] **Step 3:** Confirm a **draft** product does NOT appear (toggle status in portal, reload). This validates the `status == 'published'` rule + query.
- [ ] **Step 4:** No commit (verification only).

---

## Task 10: Docs + wrap

**Files:** Modify root `CLAUDE.md`.

- [ ] **Step 1:** Add a session-log entry + tick Phase 1 in a new "Commerce Migration" progress note; link the spec + this plan.
- [ ] **Step 2:** Commit. `git commit -m "docs: phase 1 catalog CMS progress"`

---

## Self-review notes
- **Spec coverage (Phase 1):** storeProducts collection ✓ (T1,T3), CMS with image upload + draft/publish ✓ (T3,T4), storefront reads published from Firestore ✓ (T6–T8), Buy Button untouched ✓ (T8). Rules: published-public/admin-write ✓ (T1).
- **Deferred to later phases (correctly out of Phase 1):** `orders`/`counters` collections + rules, cart, checkout, Cloud Functions, emails.
- **Consistency:** money in cents everywhere; `slugify`/`dollarsToCents`/`centsToDollars` names used identically in portal (T2/T3) and storefront (T8 uses a local centsToDollars copy since storefront has its own lib).
- **Known gotcha baked in:** Firebase deploys use `leojfx@gmail.com` (T1 Step 2).
```
