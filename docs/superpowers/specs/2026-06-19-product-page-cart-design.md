# Storefront: Product Page + Cart — Design

**Date:** 2026-06-19
**Status:** Approved (design), pending implementation plan
**Context:** Commerce migration Phase 2.5 — bridges the direct "Buy Now" into a real
catalog flow ahead of launching a second product (the guide booklet). Extends, does not
replace, the existing Stripe Checkout integration.

## Goal

Insert a product-detail page and a cart between the homepage showcase and Stripe
checkout. Build it **generically and data-driven** from the existing `storeProducts`
catalog so a second product drops in by publishing it in the portal — no homepage
redesign required now.

## Decisions

- **Flow:** cart-only. No express "Buy Now". One path:
  `Home showcase → View product (/shop/:slug) → Add to cart → /cart → Checkout → Stripe`.
- **Cart state:** Zustand + `persist` (localStorage), matching the portal's state lib.
  Tiny footprint, survives refresh. Lives in `src/stores/cart.js`.
- **Checkout:** reuse `createCheckoutSession` unchanged — it already accepts an array of
  line items. Only the client `startCheckout` helper generalises to send the whole cart.
- **Money:** server re-resolves every price against Firestore at checkout (existing
  behaviour). Cart prices are display-only and never trusted for charging.

## Architecture

### Routes (`App.jsx`)
- `/shop/:slug` → `ProductPage`
- `/cart` → `Cart`
- (existing `/checkout/success`, `/checkout/cancel` unchanged)

### Cart store — `src/stores/cart.js` (new)
- State: `items: [{ productId, slug, title, priceNZD, image, qty }]`
- Actions: `add(product, qty)`, `setQty(productId, qty)`, `remove(productId)`, `clear()`
- Selectors/derived: `count()` (sum of qty), `subtotalNZD()` (sum priceNZD*qty)
- `add` merges qty if the productId is already in the cart
- Persisted to localStorage under a versioned key

### `ProductPage` — `src/pages/ProductPage.jsx` (new)
- `useProduct(slug)` for data; loading + not-found states
- Renders: image (first of `images`, with showcase/placeholder fallback when empty),
  title, subtitle, description, price, **qty stepper**, "Add to cart"
- Inventory-aware: caps qty at `inventory` and disables add when stock is 0
- On add: writes to cart store, then navigates to `/cart`

### `Cart` — `src/pages/Cart.jsx` (new)
- Lists items: thumbnail, title, qty stepper, line total, remove
- Subtotal; note "$7 flat NZ shipping — added at checkout"
- "Checkout" → `startCheckout(items)` → redirect to Stripe (loading/error states)
- Empty-cart state with a link back to the product/home

### Header — `src/components/layout/Header.jsx` (edit)
- Add a cart icon + live count badge (from `cart.count()`) linking to `/cart`

### Homepage showcase — `src/components/sections/InteractiveCards.jsx` (edit)
- Replace the direct "Buy Now" CTA with "View product" → `/shop/:flagshipSlug`
- Keep the interactive card showcase as-is

### Client checkout — `src/lib/checkout.js` (edit)
- `startCheckout(items)` where `items = [{ productId, qty }]` (generalise from single product)

### Success page — `src/pages/CheckoutSuccess.jsx` (edit)
- Call `cart.clear()` on mount (order is paid; empty the cart)

## Data flow

`storeProducts` (published, Firestore) → `useProducts`/`useProduct` → `ProductPage`
→ Zustand cart (localStorage) → `Cart` → `startCheckout(items)` →
`createCheckoutSession` (server re-prices) → Stripe hosted checkout → `stripeWebhook`
writes the order → success page clears the cart.

## Known gaps / follow-ups

- **Product images:** `storeProducts.images` is currently `[]` for the flagship. Product
  page falls back to showcase imagery / placeholder until Jesse uploads real photos via
  the portal CMS (already supported). Not a code blocker.
- **E2E security verification:** the four checkout-hardening fixes (committed `1a0c54d`)
  are deployed but not yet verified with a completed test-mode purchase. Do this as part
  of testing the new cart flow.

## Out of scope (now)

Multi-product homepage redesign; slide-in cart drawer; customer accounts / saved carts;
discount codes; shipping options beyond the existing $7 flat rate.
