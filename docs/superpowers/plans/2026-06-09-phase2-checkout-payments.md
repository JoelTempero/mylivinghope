# Phase 2 — Cart + Checkout + Payments Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.
> **Testing note:** Stack has no JS test runner. Verification = `npm run lint` + `npm run build` + Stripe **test-mode** end-to-end purchase. The Cloud Functions hold the money-critical logic — verify them against real Stripe test events, not mocks.

**Goal:** Replace the Shopify Buy Button with our own cart + Stripe Checkout (hosted), and write a confirmed `orders` doc to Firestore from a signed Stripe webhook.

**Architecture:** Storefront Zustand cart (localStorage) → `createCheckoutSession` callable Cloud Function (re-validates cart against Firestore, builds inline NZD `price_data`, flat-rate shipping, NZ address) → Stripe-hosted Checkout → on payment, `stripeWebhook` (raw HTTPS, signature-verified) writes the `orders` doc, assigns the order number, and decrements stock. Firestore = catalog; Stripe webhook = order source of truth.

**Tech Stack:** React 19 + Vite, Zustand, Firebase Functions v2 (`firebase-functions` v6, node 20, in `portal.mylivinghope/functions/`), `stripe` node SDK, Firestore (admin SDK).

**Spec:** `docs/superpowers/specs/2026-06-09-commerce-migration-design.md` (§3 architecture, §4 `orders`/`counters`, §5 security, §6 Phase 2).

**Prereqs from Jesse (confirm before Task 3):** flat-rate shipping amount (plan defaults to a clearly-marked provisional constant); a Stripe account with **test-mode** keys.

---

## Decisions baked into this plan
- **Hosted Checkout** — no Stripe.js / Payment Element on the storefront; we redirect to `session.url`. (No `@stripe/stripe-js` dep needed.)
- **Inline `price_data`** built server-side from Firestore `priceNZD` (cents) — no Stripe product catalog.
- **Order source of truth = webhook** (`checkout.session.completed`), idempotent on `stripeSessionId`. The success page is cosmetic only.
- **Shipping:** single flat rate via Stripe `shipping_options`, constant `SHIPPING_FLAT_CENTS` (PROVISIONAL — confirm with Jesse). NZ-only address collection.
- **Secrets** via `defineSecret` (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`) — never in client or committed.
- Shopify `BuyButton.jsx` stops being used here; the file + Shopify token are deleted in Phase 5 cutover.

---

## Task 1: Storefront cart store (Zustand)

**Files:** Modify `storefront.mylivinghope/package.json` (add `zustand`); create `storefront.mylivinghope/src/stores/cartStore.js`.

- [ ] **Step 1:** `cd storefront.mylivinghope && npm install zustand`.
- [ ] **Step 2:** Create `cartStore.js` — Zustand store persisted to `localStorage` (use `zustand/middleware` `persist`, key `mlh-cart`). State: `items: [{ productId, slug, title, priceNZD, image, qty }]`, `isOpen: bool`. Actions: `addItem(product, qty=1)` (merge by productId, increment qty), `removeItem(productId)`, `setQty(productId, qty)` (remove if <=0), `clear()`, `open()`, `close()`, `toggle()`. Selectors/derived: `count` = sum of qty, `subtotalCents` = sum(priceNZD*qty). **Note:** stored prices are display-only; the server re-resolves real prices at checkout.
- [ ] **Step 3:** `npm run lint` clean.
- [ ] **Step 4:** Commit: `feat(store): zustand cart store`.

## Task 2: Cart drawer UI + replace Shopify buy flow

**Files:** Create `storefront.mylivinghope/src/components/CartDrawer.jsx`; modify `src/components/layout/Header.jsx`, `src/components/sections/InteractiveCards.jsx`, `src/App.jsx`.

- [ ] **Step 1:** `CartDrawer.jsx` — slide-over panel (right), driven by `cartStore`. Lists items (image, title, qty stepper, line price via a local `centsToDollars`), shows subtotal, a "Checkout" button (calls the checkout action from Task 6 — stub the import now, wire in Task 6), and an empty state. Close on backdrop click / X / Esc. Match the storefront's existing Tailwind aesthetic (forest-green accents, rounded). Render `<CartDrawer />` once in `App.jsx` (outside `<Routes>`).
- [ ] **Step 2:** `Header.jsx` — replace `import { openCart, onCartCount } from '../BuyButton'` with the cart store. Cart button `onClick` → `cartStore.open()`; badge count → `cartStore` `count`. Remove the `onCartCount` effect.
- [ ] **Step 3:** `InteractiveCards.jsx` — replace the `<BuyButton productId=... />` usage with a styled "Add to Cart" button that calls `cartStore.addItem(flagship)` then `cartStore.open()` (only enabled when `flagship` is loaded). Remove the `BuyButton` import. Keep the existing button styling/markup.
- [ ] **Step 4:** `npm run build` + `npm run lint` clean. Manual: add-to-cart opens drawer, qty stepper + subtotal update, count badge updates, persists across reload.
- [ ] **Step 5:** Commit: `feat(store): cart drawer + replace shopify buy flow`.

## Task 3: `createCheckoutSession` Cloud Function

**Files:** Modify `portal.mylivinghope/functions/package.json` (add `stripe`), `portal.mylivinghope/functions/index.js`.

- [ ] **Step 1:** `cd portal.mylivinghope/functions && npm install stripe`.
- [ ] **Step 2:** In `index.js`, add secret + constant + callable. Pattern:

```js
const { onCall, onRequest, HttpsError } = require('firebase-functions/v2/https')
const { defineSecret } = require('firebase-functions/params')
const STRIPE_SECRET_KEY = defineSecret('STRIPE_SECRET_KEY')
const STRIPE_WEBHOOK_SECRET = defineSecret('STRIPE_WEBHOOK_SECRET')

const SHIPPING_FLAT_CENTS = 700 // PROVISIONAL — confirm flat NZ shipping with Jesse
const STOREFRONT_URL = 'https://mylivinghope.org.nz'

exports.createCheckoutSession = onCall({ secrets: [STRIPE_SECRET_KEY], cors: true }, async (request) => {
  const stripe = require('stripe')(STRIPE_SECRET_KEY.value())
  const cart = request.data?.items
  if (!Array.isArray(cart) || cart.length === 0) throw new HttpsError('invalid-argument', 'Cart is empty')

  // Re-resolve every line against Firestore — never trust client prices
  const line_items = []
  for (const line of cart) {
    const snap = await db.collection('storeProducts').doc(line.productId).get()
    if (!snap.exists) throw new HttpsError('not-found', `Product ${line.productId} not found`)
    const p = snap.data()
    if (p.status !== 'published') throw new HttpsError('failed-precondition', `${p.title} is unavailable`)
    const qty = Math.max(1, parseInt(line.qty, 10) || 1)
    if (p.inventory != null && p.inventory < qty) throw new HttpsError('failed-precondition', `Not enough stock for ${p.title}`)
    line_items.push({
      quantity: qty,
      price_data: {
        currency: 'nzd',
        unit_amount: p.priceNZD,
        product_data: { name: p.title, description: p.subtitle || undefined, images: (p.images || []).slice(0, 1) },
      },
    })
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items,
    shipping_address_collection: { allowed_countries: ['NZ'] },
    shipping_options: [{
      shipping_rate_data: {
        type: 'fixed_amount',
        fixed_amount: { amount: SHIPPING_FLAT_CENTS, currency: 'nzd' },
        display_name: 'Standard NZ shipping',
      },
    }],
    phone_number_collection: { enabled: true },
    success_url: `${STOREFRONT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${STOREFRONT_URL}/checkout/cancel`,
    metadata: { productIds: cart.map((l) => l.productId).join(',') },
  })
  return { url: session.url }
})
```

- [ ] **Step 3:** Set the secret (controller/Joel, not committed): `firebase functions:secrets:set STRIPE_SECRET_KEY` (paste test-mode `sk_test_...`).
- [ ] **Step 4:** Commit: `feat(functions): createCheckoutSession`.

## Task 4: `stripeWebhook` Cloud Function

**Files:** Modify `portal.mylivinghope/functions/index.js`.

- [ ] **Step 1:** Add the webhook (raw HTTPS — uses `req.rawBody` for signature verification):

```js
exports.stripeWebhook = onRequest({ secrets: [STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET] }, async (req, res) => {
  const stripe = require('stripe')(STRIPE_SECRET_KEY.value())
  let event
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, req.headers['stripe-signature'], STRIPE_WEBHOOK_SECRET.value())
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    try {
      await handleCompletedCheckout(stripe, session)
    } catch (err) {
      console.error('Order write failed:', err)
      return res.status(500).send('Order processing failed') // Stripe will retry
    }
  }
  return res.status(200).json({ received: true })
})

async function handleCompletedCheckout(stripe, session) {
  // Idempotency: skip if an order already exists for this session
  const existing = await db.collection('orders').where('stripeSessionId', '==', session.id).limit(1).get()
  if (!existing.empty) return

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 })
  const items = lineItems.data.map((li) => ({
    title: li.description,
    qty: li.quantity,
    unitPriceNZD: li.price?.unit_amount ?? 0,
  }))

  await db.runTransaction(async (tx) => {
    const counterRef = db.collection('counters').doc('orderNumber')
    const counterSnap = await tx.get(counterRef)
    const last = counterSnap.exists ? (counterSnap.data().last || 1000) : 1000
    const next = last + 1

    const addr = session.shipping_details?.address || session.customer_details?.address || {}
    const orderRef = db.collection('orders').doc()
    tx.set(orderRef, {
      orderNumber: `MLH-${next}`,
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent || null,
      status: 'paid',
      items,
      subtotalNZD: (session.amount_subtotal ?? 0),
      shippingNZD: (session.total_details?.amount_shipping ?? 0),
      totalNZD: (session.amount_total ?? 0),
      currency: session.currency || 'nzd',
      customer: { email: session.customer_details?.email || null, name: session.customer_details?.name || null },
      shippingAddress: {
        line1: addr.line1 || null, line2: addr.line2 || null, city: addr.city || null,
        region: addr.state || null, postalCode: addr.postal_code || null, country: addr.country || null,
      },
      fulfillment: { trackingNumber: null, carrier: null, shippedAt: null },
      emailsSent: [],
      notes: '',
      createdAt: new Date(),
      paidAt: new Date(),
      updatedAt: new Date(),
    })
    tx.set(counterRef, { last: next }, { merge: true })
  })

  // Best-effort inventory decrement (separate from order write; never blocks the order)
  // For each metadata productId, decrement by purchased qty where inventory != null.
}
```

- [ ] **Step 2:** Implement the inventory decrement: parse `session.metadata.productIds`, and for each, in a transaction read the `storeProducts` doc and if `inventory != null` set `inventory = max(0, inventory - qtyPurchased)`. Match purchased qty from `items` by title, or pass qty in metadata for reliability. Wrap in try/catch — log failures, do not throw.
- [ ] **Step 3:** Commit: `feat(functions): stripeWebhook writes paid order + order number + stock`.

## Task 5: Firestore rules for `orders` + `counters`

**Files:** Modify `portal.mylivinghope/firestore.rules`.

- [ ] **Step 1:** Add blocks (admin SDK in functions bypasses rules; portal admins can read orders):

```
// Orders — no public access; portal admins/editors read, only Cloud Functions write
match /orders/{orderId} {
  allow read: if canEdit();
  allow write: if false;
}
// Counters — Cloud Functions only
match /counters/{counterId} {
  allow read, write: if false;
}
```

- [ ] **Step 2:** Deploy: `firebase deploy --only firestore:rules --project my-living-hope` (use `leojfx@gmail.com`). Commit: `feat(store): orders + counters firestore rules`.

## Task 6: Storefront checkout action + success/cancel pages

**Files:** Modify `storefront.mylivinghope/src/lib/firebase.js`, `storefront.mylivinghope/src/stores/cartStore.js` (or a new `src/lib/checkout.js`), `src/App.jsx`; create `src/pages/CheckoutSuccess.jsx`, `src/pages/CheckoutCancel.jsx`.

- [ ] **Step 1:** `firebase.js` — add `import { getFunctions } from 'firebase/functions'` and `export const functions = getFunctions(app)`.
- [ ] **Step 2:** Create a `startCheckout(items)` helper (in `src/lib/checkout.js`): `httpsCallable(functions, 'createCheckoutSession')`, call with `{ items: items.map(i => ({ productId: i.productId, qty: i.qty })) }`, then `window.location.href = result.data.url`. Handle errors with a user-visible message. Wire the CartDrawer "Checkout" button to it (loading state while redirecting).
- [ ] **Step 3:** `CheckoutSuccess.jsx` — reads `session_id` from query, shows a thank-you + "order confirmed, email on its way" message, and calls `cartStore.clear()` on mount. `CheckoutCancel.jsx` — "checkout cancelled, your cart is saved" + link back to `/#shop`.
- [ ] **Step 4:** `App.jsx` — add routes `/checkout/success` and `/checkout/cancel`.
- [ ] **Step 5:** `npm run build` + `npm run lint` clean. Commit: `feat(store): checkout redirect + success/cancel pages`.

## Task 7: Deploy + Stripe test-mode end-to-end verification

- [ ] **Step 1:** Deploy functions: `cd portal.mylivinghope && firebase deploy --only functions --project my-living-hope` (use `leojfx@gmail.com`). Note the `stripeWebhook` URL from output.
- [ ] **Step 2:** In Stripe Dashboard (test mode) → Developers → Webhooks → add endpoint = the `stripeWebhook` URL, event `checkout.session.completed`. Copy the signing secret and set it: `firebase functions:secrets:set STRIPE_WEBHOOK_SECRET` then re-deploy functions so the secret is bound. (Locally, `stripe listen --forward-to <url>` also works.)
- [ ] **Step 3:** Run storefront dev (or deploy), add the flagship to cart, checkout, pay with test card `4242 4242 4242 4242`. Confirm: redirect to success page, cart clears.
- [ ] **Step 4:** Verify in Firestore (`node portal.mylivinghope/scripts/query-firestore.js orders`): an `orders` doc exists with `status: 'paid'`, correct `orderNumber` (`MLH-1001`), items, totals (incl. shipping), customer + shipping address. Re-send the webhook event from Stripe → confirm NO duplicate order (idempotency). If the product had finite inventory, confirm it decremented.
- [ ] **Step 5:** No commit (verification). Fix issues in the relevant task's files.

## Task 8: Docs + wrap

**Files:** Modify root `CLAUDE.md`.

- [ ] **Step 1:** Session-log entry, tick Phase 2, note the secrets that must be set per environment and that live keys come in Phase 5. Commit: `docs: phase 2 checkout + payments progress`.

---

## Self-review notes
- **Spec coverage (Phase 2):** Zustand cart ✓ (T1), cart UI replacing Buy Button ✓ (T2), createCheckoutSession w/ server-side validation + inline NZD price_data + flat shipping + NZ address ✓ (T3), webhook writes paid order + order number + idempotency + stock ✓ (T4), orders/counters locked down ✓ (T5), success/cancel + redirect ✓ (T6), test-mode E2E ✓ (T7).
- **Deferred (correct):** transactional emails + customer order-tracking page (Phase 4); live Stripe keys + Shopify/BuyButton deletion (Phase 5).
- **Money:** cents end-to-end; Stripe `unit_amount` = `priceNZD` directly.
- **Trust boundary:** client cart prices never used for charging — server re-resolves from Firestore (T3); order written only from signature-verified webhook (T4).
- **Open/provisional:** `SHIPPING_FLAT_CENTS` placeholder (Jesse to confirm); `STOREFRONT_URL` assumes prod domain — use the dev URL when testing locally.
- **Gotcha:** webhook MUST use `req.rawBody` (Firebase v2 onRequest provides it) — parsed body breaks signature verification.
