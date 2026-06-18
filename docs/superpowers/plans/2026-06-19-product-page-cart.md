# Storefront Product Page + Cart — Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development or superpowers:executing-plans. Steps use `- [ ]` for tracking.

**Goal:** Add a product-detail page and a cart between the homepage showcase and Stripe checkout, data-driven from the `storeProducts` catalog.

**Architecture:** New `/shop/:slug` and `/cart` routes. A Zustand+localStorage cart store. Checkout reuses the existing `createCheckoutSession` Cloud Function (already accepts a line-item array) — only the client helper and success page change.

**Tech Stack:** React 19, Vite 7, react-router-dom, Tailwind v4, Zustand (new), Firebase.

**Spec:** `docs/superpowers/specs/2026-06-19-product-page-cart-design.md`

## Global Constraints

- JSX only, no TypeScript. Pages in `src/pages/`, stores in `src/stores/`.
- Money is integer cents (`priceNZD`); display via existing `centsToDollars`.
- Cart prices are display-only — server re-prices at checkout. Never trust client prices.
- Keep deps lean; Zustand is the only new one (matches portal's state lib).
- No test framework in this app — verify each task with `npm run lint`, `npm run build`, and behavioral checks against the dev server (already running on :3854).
- Tailwind brand tokens already exist: `forest-green`, `green-dark`, `soft-blush`, `blush-light`, `text-secondary`, `text-muted`, `btn-interactive`.

---

### Task 1: Cart store (+ Zustand)

**Files:** Create `src/stores/cart.js`; modify `package.json` (add `zustand`).

**Interface (produced):**
- `useCart` (Zustand store) — state `items: [{ productId, slug, title, priceNZD, image, qty }]`
- actions: `add(product, qty=1)` (merges qty if productId already present), `setQty(productId, qty)` (min 1), `remove(productId)`, `clear()`
- exported selectors: `selectCount(s)` → total qty, `selectSubtotal(s)` → Σ priceNZD*qty
- persisted to localStorage key `mlh-cart-v1`

- [ ] Step 1: `npm install zustand` in `storefront.mylivinghope`
- [ ] Step 2: Write `src/stores/cart.js` — `create(persist(...))` with the interface above. `add` maps `image` from `product.images?.[0] ?? null`. Qty actions floor + clamp to ≥1.
- [ ] Step 3: `npm run lint` → clean
- [ ] Step 4: Commit — `feat(store): cart store with localStorage persistence`

---

### Task 2: Generalize checkout client + clear cart on success

**Files:** Modify `src/lib/checkout.js`, `src/pages/CheckoutSuccess.jsx`.

**Interface:**
- Consumes: `useCart.clear` (Task 1)
- Produces: `startCheckout(items)` where `items = [{ productId, qty }]`

- [ ] Step 1: Change `startCheckout(product, qty)` → `startCheckout(items)`; pass `{ items }` straight to the callable (the function already accepts an array).
- [ ] Step 2: In `CheckoutSuccess.jsx`, call `useCart.getState().clear()` in the existing mount `useEffect`.
- [ ] Step 3: `npm run lint` → clean
- [ ] Step 4: Commit — `feat(checkout): cart-array checkout + clear cart on success`

---

### Task 3: Product page + route

**Files:** Create `src/pages/ProductPage.jsx`; modify `src/App.jsx`.

**Interface:**
- Consumes: `useProduct(slug)` (existing), `useCart.add` (Task 1), `centsToDollars` (existing)
- Route: `/shop/:slug`

- [ ] Step 1: Build `ProductPage` — `useParams().slug` → `useProduct`. States: loading, not-found (link home), loaded. Loaded shows image (`images?.[0]`, else "Product photo coming soon" placeholder block), title, subtitle, price, description (`whitespace-pre-line`), qty stepper (clamp 1..`inventory ?? 99`), "Add to cart" button. Out-of-stock (`inventory <= 0`) disables the button. On add: `add(product, qty)` then `navigate('/cart')`.
- [ ] Step 2: Add `import ProductPage` + `<Route path="/shop/:slug" element={<ProductPage />} />` to `App.jsx`.
- [ ] Step 3: `npm run lint` && `npm run build` → clean
- [ ] Step 4: Verify on :3854 — visit `/shop/prayer-cards-vol-1`, set qty 2, Add to cart → lands on `/cart`. Screenshot.
- [ ] Step 5: Commit — `feat(store): product detail page`

---

### Task 4: Cart page + route

**Files:** Create `src/pages/Cart.jsx`; modify `src/App.jsx`.

**Interface:**
- Consumes: `useCart` items/`setQty`/`remove` + `selectSubtotal` (Task 1), `centsToDollars`, `startCheckout` (Task 2)
- Route: `/cart`

- [ ] Step 1: Build `Cart` — empty state (link to browse) when no items. Otherwise: line items (thumb, title, `$each`, qty stepper via `setQty`, line total, Remove via `remove`), subtotal (`selectSubtotal`), "$7 flat NZ shipping added at checkout" note, Checkout button → `startCheckout(items.map(i => ({ productId: i.productId, qty: i.qty })))` with busy/error states.
- [ ] Step 2: Add `import Cart` + `<Route path="/cart" element={<Cart />} />` to `App.jsx`.
- [ ] Step 3: `npm run lint` && `npm run build` → clean
- [ ] Step 4: Verify on :3854 — adjust qty, remove, subtotal updates; Checkout redirects to a Stripe `checkout.stripe.com` URL. Screenshot.
- [ ] Step 5: Commit — `feat(store): cart page with checkout`

---

### Task 5: Navigation wiring (header cart + homepage CTA)

**Files:** Modify `src/components/layout/Header.jsx`, `src/components/sections/InteractiveCards.jsx`.

**Interface:** Consumes `useCart` + `selectCount` (Task 1), flagship `slug`.

- [ ] Step 1: Header — add a `ShoppingBag` (lucide) link to `/cart` with a count badge (`useCart(selectCount)`, hidden when 0) in both the desktop nav group and the mobile `md:hidden` cluster (before the menu button).
- [ ] Step 2: InteractiveCards — replace the "Buy Now" button + `handleBuyNow`/`buying`/`buyError`/`startCheckout` with a `<Link to={\`/shop/${flagship.slug}\`}>` styled "View product" CTA (keep disabled/fallback when no flagship). Remove now-unused imports.
- [ ] Step 3: `npm run lint` && `npm run build` → clean
- [ ] Step 4: Verify on :3854 — homepage CTA → product page; header badge reflects cart count and links to `/cart`. Screenshot.
- [ ] Step 5: Commit — `feat(store): header cart indicator + homepage view-product CTA`

---

### Task 6: End-to-end verification (full flow + deferred security check)

**Files:** none (verification only).

- [ ] Step 1: On :3854, walk the whole path: home → View product → Add to cart (qty 2) → /cart → adjust → Checkout → Stripe page loads with correct line items + qty + $7 shipping.
- [ ] Step 2: Complete a **test-mode** purchase (card `4242 4242 4242 4242`) — this also closes the deferred security verification for commit `1a0c54d`.
- [ ] Step 3: Query Firestore `orders` — confirm exactly one new order, doc id = `cs_test_…`, `MLH-1002`, `status: paid`, correct totals; confirm `/checkout/success` cleared the cart.
- [ ] Step 4: Resend the `checkout.session.completed` event from the Stripe dashboard → confirm no duplicate order (dedup holds).
- [ ] Step 5: Note results in CLAUDE.md session log.

---

## Self-Review

- **Spec coverage:** routes (T3,T4), cart store/persist (T1), product page w/ qty + inventory (T3), cart page w/ adjust/remove/subtotal/shipping note (T4), header cart (T5), homepage CTA swap (T5), checkout-array + cart clear (T2), image fallback (T3), E2E + security verify (T6). ✓
- **Placeholders:** none — each task names exact files, interfaces, and verification.
- **Type consistency:** `add/setQty/remove/clear` + `selectCount/selectSubtotal` + `startCheckout(items)` used consistently across T2/T4/T5.
