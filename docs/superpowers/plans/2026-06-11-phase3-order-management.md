# Phase 3 — Order Management Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.
> **Testing note:** No JS test runner. Verification = `npm run lint` + `npm run build` + live check against the real `MLH-1001` test order in the deployed portal.

**Goal:** Portal "Store ▸ Orders" page — Jesse can see paid orders, mark them fulfilled/shipped with a tracking number, and leave notes.

**Architecture:** New `StoreOrders.jsx` page following the `StoreProducts.jsx` pattern exactly (useCollection + ui components + modal detail view). Firestore rules gain a narrow field-restricted `update` allowance for portal editors — create/delete stay function-only.

**Tech Stack:** React 19 + Vite, existing portal UI kit (`Card/Button/Table/Badge/Modal/Input/Select`), `useCollection` hook, Firestore.

**Spec:** `docs/superpowers/specs/2026-06-09-commerce-migration-design.md` §6 Phase 3, §4 `orders` schema.

---

## Decisions baked in
- **Status flow:** `paid → fulfilled → shipped` via explicit buttons; `cancelled`/`refunded` settable from a status dropdown (manual bookkeeping — actual Stripe refunds happen in the Stripe dashboard, out of scope v1).
- **Tracking entry:** carrier + tracking number form in the detail modal; saving sets `fulfillment.{trackingNumber,carrier,shippedAt}` AND `status: 'shipped'` in one update. `shippedAt = new Date()`.
- **Rules:** editors/admins may `update` ONLY `status`, `fulfillment`, `notes`, `updatedAt`. No client `create`/`delete`. Money fields, items, customer, `emailsSent` stay locked (webhook/Phase 4 owns them).
- **Phase 4 hook:** shipped-email will later trigger off the `fulfillment.trackingNumber` write — no schema change needed now.
- **No pagination** — single product, low volume. `useCollection('orders', { orderByField: 'createdAt', orderDirection: 'desc' })`.

## Task 1: Firestore rules — field-restricted order updates

**Files:** Modify `portal.mylivinghope/firestore.rules` (orders block).

- [ ] **Step 1:** Replace the `orders` match block:

```
// Orders — portal admins/editors read + limited update; create/delete = Cloud Functions only
match /orders/{orderId} {
  allow read: if canEdit();
  allow update: if canEdit() &&
    request.resource.data.diff(resource.data).affectedKeys()
      .hasOnly(['status', 'fulfillment', 'notes', 'updatedAt']);
  allow create, delete: if false;
}
```

- [ ] **Step 2:** Deploy: `firebase deploy --only firestore:rules --project my-living-hope` (account `leojfx@gmail.com`).
- [ ] **Step 3:** Commit: `feat(store): allow field-restricted order updates from portal`.

## Task 2: StoreOrders page

**Files:** Create `portal.mylivinghope/src/pages/StoreOrders.jsx`. Reference pattern: `src/pages/StoreProducts.jsx`.

- [ ] **Step 1:** Page skeleton: `useCollection('orders', ...)`, `useAuth()` for `isEditor`, header row (title + order count), search input (matches `orderNumber`, `customer.name`, `customer.email`) + status filter `Select` (All / paid / fulfilled / shipped / cancelled / refunded).
- [ ] **Step 2:** Orders `Table`: columns = Order # | Date (`formatDate(createdAt)`) | Customer (name + email stacked) | Items (qty summary, e.g. "1× Prayer Cards Vol 1") | Total (`$${centsToDollars(totalNZD)}`) | Status (`Badge` — paid=blue, fulfilled=amber, shipped=green, cancelled=gray, refunded=red) | Tracking (number or "—"). Row click opens detail modal.
- [ ] **Step 3:** Detail `Modal`: sections for items (title/qty/unit price/line total), totals (subtotal + shipping + total), customer (email/name/phone), shipping address, Stripe IDs (session + payment intent, monospace, copyable), notes `Textarea` (debounced save or save button), timestamps.
- [ ] **Step 4:** Status actions in modal (editors only):
  - `paid` → "Mark Fulfilled" button → `update(id, { status: 'fulfilled', updatedAt: new Date() })`
  - `fulfilled` (or `paid`) → tracking form: carrier `Select` (NZ Post, CourierPost, Aramex, Other) + tracking number `Input` + "Mark Shipped" button → `update(id, { status: 'shipped', fulfillment: { trackingNumber, carrier, shippedAt: new Date() }, updatedAt: new Date() })`
  - Status override `Select` for cancelled/refunded with a confirm step.
- [ ] **Step 5:** Empty state ("No orders yet") + loading state, matching StoreProducts.
- [ ] **Step 6:** Commit: `feat(portal): store orders page — list, detail, fulfillment`.

## Task 3: Route + navigation

**Files:** Modify `portal.mylivinghope/src/App.jsx`, `src/components/layout/Sidebar.jsx`.

- [ ] **Step 1:** App.jsx: import StoreOrders, add `<Route path="/store-orders" element={<StoreOrders />} />` after `/store-products`.
- [ ] **Step 2:** Sidebar: rename existing Store item to `Store · Products`; add `{ name: 'Store · Orders', href: '/store-orders', icon: PackageCheck }` (lucide `PackageCheck`) directly below it.
- [ ] **Step 3:** Commit: `feat(portal): store orders route + nav`.

## Task 4: Verify + deploy portal

- [ ] **Step 1:** `cd portal.mylivinghope && npm run lint && npm run build` — both clean.
- [ ] **Step 2:** Deploy portal hosting: `firebase deploy --only hosting --project my-living-hope` (portal's default site — does NOT touch the storefront site).
- [ ] **Step 3:** Joel verifies live: open Orders page, see `MLH-1001`, mark fulfilled, enter a dummy tracking number, mark shipped, confirm Firestore reflects it (`node scripts/query-firestore.js orders`), then reset status back to `paid` and clear fulfillment for Phase 4 email testing.
- [ ] **Step 4:** No commit (verification).

## Task 5: Docs + wrap

**Files:** Modify root `CLAUDE.md`.

- [ ] **Step 1:** Session log entry; tick Phase 3 in progress notes; record GST decision (not registered — no GST on receipts v1) and that storefront deploy is held until Phase 5 live-key cutover with Jesse. Commit: `docs: phase 3 order management complete`.

---

## Self-review notes
- **Spec coverage (§6 P3):** list w/ status filter ✓ (T2 S1-2), detail view ✓ (T2 S3), status transitions ✓ (T2 S4), tracking entry ✓ (T2 S4), "Jesse can see paid orders, mark fulfilled/shipped, record tracking" ✓ (T4 S3 verifies live).
- **Security:** field-restricted diff rule keeps money/customer/items immutable from clients; portal deploy is the portal site only.
- **Deferred (correct):** shipped email (Phase 4), Stripe refund API, pagination, customer tracking page.
- **Gotcha:** `fulfillment` is replaced whole in the shipped update — include all three keys every time.
