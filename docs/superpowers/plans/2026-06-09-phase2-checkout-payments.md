# Phase 2 — Buy Now + Checkout + Payments Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.
> **Testing note:** Stack has no JS test runner. Verification = `npm run lint` + `npm run build` + Stripe **test-mode** end-to-end purchase. The Cloud Functions hold the money-critical logic — verify them against real Stripe test events, not mocks.

**Goal:** Replace the Shopify Buy Button with a direct **"Buy Now" → Stripe Checkout (hosted)** flow, and write a confirmed `orders` doc to Firestore from a signed Stripe webhook.

**Architecture:** Storefront "Buy Now" → `createCheckoutSession` callable Cloud Function (re-validates the product against Firestore, builds inline NZD `price_data`, quantity adjustable on Stripe, flat-rate shipping, NZ address) → Stripe-hosted Checkout → on payment, `stripeWebhook` (raw HTTPS, signature-verified) writes the `orders` doc, assigns the order number, and decrements stock. Firestore = catalog; Stripe webhook = order source of truth.

**Scope decision (2026-06-09):** Single-product store → **no cart/drawer.** Buy Now redirects straight to Stripe for the one flagship product. A cart is a clean future addition (the checkout function already accepts multiple line items) when the catalog grows.

**Tech Stack:** React 19 + Vite, Firebase Functions v2 (`firebase-functions` v6, node 20, in `portal.mylivinghope/functions/`), `stripe` node SDK, Firestore (admin SDK). No new storefront deps (Firebase SDK already installed).

**Spec:** `docs/superpowers/specs/2026-06-09-commerce-migration-design.md` (§3 architecture, §4 `orders`/`counters`, §5 security, §6 Phase 2).

**Prereqs from Jesse/Joel (confirm before Task 1):** a Stripe account with **test-mode** keys; flat-rate shipping amount (plan defaults to a clearly-marked provisional constant).

---

## Decisions baked into this plan
- **Hosted Checkout** — no Stripe.js/Payment Element; redirect to `session.url`. (No `@stripe/stripe-js` dep.)
- **No cart** — Buy Now sends one product; quantity adjusted on Stripe via `adjustable_quantity`.
- **Inline `price_data`** from Firestore `priceNZD` (cents) — no Stripe product catalog.
- **Order source of truth = webhook** (`checkout.session.completed`), idempotent on `stripeSessionId`. Success page is cosmetic.
- **Shipping:** single flat rate via Stripe `shipping_options`, constant `SHIPPING_FLAT_CENTS` (PROVISIONAL — confirm with Jesse). NZ-only address.
- **Secrets** via `defineSecret` (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`) — never in client or committed.
- Shopify `BuyButton.jsx` stops being used here; file + Shopify token deleted in Phase 5 cutover.

---

## Task 1: `createCheckoutSession` Cloud Function

**Files:** Modify `portal.mylivinghope/functions/package.json` (add `stripe`), `portal.mylivinghope/functions/index.js`.

- [ ] **Step 1:** `cd portal.mylivinghope/functions && npm install stripe`.
- [ ] **Step 2:** In `index.js`, add secret + constants + callable. The handler accepts `items: [{ productId, qty }]` (Buy Now sends exactly one) so a cart can reuse it later:

```js
const { onCall, onRequest, HttpsError } = require('firebase-functions/v2/https')
const { defineSecret } = require('firebase-functions/params')
const STRIPE_SECRET_KEY = defineSecret('STRIPE_SECRET_KEY')
const STRIPE_WEBHOOK_SECRET = defineSecret('STRIPE_WEBHOOK_SECRET')

const SHIPPING_FLAT_CENTS = 700 // PROVISIONAL — confirm flat NZ shipping with Jesse
const STOREFRONT_URL = 'https://mylivinghope.org.nz' // use dev URL when testing locally

exports.createCheckoutSession = onCall({ secrets: [STRIPE_SECRET_KEY], cors: true }, async (request) => {
  const stripe = require('stripe')(STRIPE_SECRET_KEY.value())
  const items = request.data?.items
  if (!Array.isArray(items) || items.length === 0) throw new HttpsError('invalid-argument', 'No items')

  // Re-resolve every line against Firestore — never trust client prices
  const line_items = []
  for (const line of items) {
    const snap = await db.collection('storeProducts').doc(line.productId).get()
    if (!snap.exists) throw new HttpsError('not-found', `Product ${line.productId} not found`)
    const p = snap.data()
    if (p.status !== 'published') throw new HttpsError('failed-precondition', `${p.title} is unavailable`)
    const qty = Math.max(1, parseInt(line.qty, 10) || 1)
    if (p.inventory != null && p.inventory < qty) throw new HttpsError('failed-precondition', `Not enough stock for ${p.title}`)
    line_items.push({
      quantity: qty,
      adjustable_quantity: { enabled: true, minimum: 1 },
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
    metadata: { items: items.map((l) => `${l.productId}:${l.qty || 1}`).join(',') },
  })
  return { url: session.url }
})
```

- [ ] **Step 3:** Set the secret (Joel, not committed): `firebase functions:secrets:set STRIPE_SECRET_KEY` (paste test-mode `sk_test_...`).
- [ ] **Step 4:** Commit: `feat(functions): createCheckoutSession`.

## Task 2: `stripeWebhook` Cloud Function

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
    try {
      await handleCompletedCheckout(stripe, event.data.object)
    } catch (err) {
      console.error('Order write failed:', err)
      return res.status(500).send('Order processing failed') // Stripe retries
    }
  }
  return res.status(200).json({ received: true })
})

async function handleCompletedCheckout(stripe, session) {
  // Idempotency: skip if an order already exists for this session
  const existing = await db.collection('orders').where('stripeSessionId', '==', session.id).limit(1).get()
  if (!existing.empty) return

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 })
  const items = lineItems.data.map((li) => ({ title: li.description, qty: li.quantity, unitPriceNZD: li.price?.unit_amount ?? 0 }))

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
      subtotalNZD: session.amount_subtotal ?? 0,
      shippingNZD: session.total_details?.amount_shipping ?? 0,
      totalNZD: session.amount_total ?? 0,
      currency: session.currency || 'nzd',
      customer: { email: session.customer_details?.email || null, name: session.customer_details?.name || null, phone: session.customer_details?.phone || null },
      shippingAddress: { line1: addr.line1 || null, line2: addr.line2 || null, city: addr.city || null, region: addr.state || null, postalCode: addr.postal_code || null, country: addr.country || null },
      fulfillment: { trackingNumber: null, carrier: null, shippedAt: null },
      emailsSent: [],
      notes: '',
      createdAt: new Date(), paidAt: new Date(), updatedAt: new Date(),
    })
    tx.set(counterRef, { last: next }, { merge: true })
  })

  // Best-effort inventory decrement — never blocks the order
  try {
    const parsed = (session.metadata?.items || '').split(',').filter(Boolean).map((s) => { const [id, q] = s.split(':'); return { id, qty: parseInt(q, 10) || 1 } })
    for (const { id, qty } of parsed) {
      await db.runTransaction(async (tx) => {
        const ref = db.collection('storeProducts').doc(id)
        const snap = await tx.get(ref)
        if (!snap.exists) return
        const inv = snap.data().inventory
        if (inv != null) tx.update(ref, { inventory: Math.max(0, inv - qty) })
      })
    }
  } catch (err) { console.error('Inventory decrement failed (non-fatal):', err) }
}
```

- [ ] **Step 2:** Commit: `feat(functions): stripeWebhook writes paid order + order number + stock`.

## Task 3: Firestore rules for `orders` + `counters`

**Files:** Modify `portal.mylivinghope/firestore.rules`.

- [ ] **Step 1:** Add blocks (admin SDK in functions bypasses rules; portal admins/editors can read orders):

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

## Task 4: Storefront Buy Now + success/cancel pages

**Files:** Modify `storefront.mylivinghope/src/lib/firebase.js`, `src/components/sections/InteractiveCards.jsx`, `src/components/layout/Header.jsx`, `src/App.jsx`; create `src/lib/checkout.js`, `src/pages/CheckoutSuccess.jsx`, `src/pages/CheckoutCancel.jsx`.

- [ ] **Step 1:** `firebase.js` — add `import { getFunctions } from 'firebase/functions'` and `export const functions = getFunctions(app)`.
- [ ] **Step 2:** Create `src/lib/checkout.js` — `startCheckout(product, qty=1)`: `httpsCallable(functions, 'createCheckoutSession')` called with `{ items: [{ productId: product.id, qty }] }`, then `window.location.href = result.data.url`. On error, `throw` so the caller can show a message.
- [ ] **Step 3:** `InteractiveCards.jsx` — replace `<BuyButton productId=... />` with a "Buy Now" button (reuse the existing button styling) that, on click, sets a local `loading` state and calls `startCheckout(flagship)`; disabled unless `flagship` is loaded; show a small error message on failure. Remove the `BuyButton` import.
- [ ] **Step 4:** `Header.jsx` — remove the Shopify cart button(s) and the `import { openCart, onCartCount } from '../BuyButton'` + the `onCartCount` effect + `cartCount` state (there's no cart in this flow). Keep the rest of the header (logo, nav links) intact. The "Shop" link still scrolls to `#shop`.
- [ ] **Step 5:** Create `CheckoutSuccess.jsx` (reads `session_id` from query; thank-you + "order confirmed, email on its way"; link home) and `CheckoutCancel.jsx` ("checkout cancelled" + link back to `/#shop`). Add routes `/checkout/success` and `/checkout/cancel` in `App.jsx`.
- [ ] **Step 6:** `npm run build` + `npm run lint` clean. Commit: `feat(store): buy now -> stripe checkout + success/cancel pages`.

## Task 5: Deploy + Stripe test-mode end-to-end verification

- [ ] **Step 1:** Deploy functions: `cd portal.mylivinghope && firebase deploy --only functions --project my-living-hope` (use `leojfx@gmail.com`). Note the `stripeWebhook` URL from output.
- [ ] **Step 2:** Stripe Dashboard (test mode) → Developers → Webhooks → add endpoint = `stripeWebhook` URL, event `checkout.session.completed`. Copy the signing secret: `firebase functions:secrets:set STRIPE_WEBHOOK_SECRET`, then re-deploy functions to bind it. (Locally, `stripe listen --forward-to <url>` also works.)
- [ ] **Step 3:** Run storefront dev (set `STOREFRONT_URL` to the dev origin for the test, or test against a deploy). Click **Buy Now**, pay with test card `4242 4242 4242 4242`. Confirm redirect to success page.
- [ ] **Step 4:** Verify in Firestore (`node portal.mylivinghope/scripts/query-firestore.js orders`): an `orders` doc with `status: 'paid'`, `orderNumber` `MLH-1001`, items, totals incl. shipping, customer + shipping address. Re-send the event from Stripe → confirm NO duplicate (idempotency). If the product had finite inventory, confirm it decremented.
- [ ] **Step 5:** No commit (verification). Fix issues in the relevant task's files.

## Task 6: Docs + wrap

**Files:** Modify root `CLAUDE.md`.

- [ ] **Step 1:** Session-log entry, tick Phase 2, note the secrets that must be set per environment and that live keys + Shopify removal come in Phase 5. Commit: `docs: phase 2 buy now + payments progress`.

---

## Self-review notes
- **Spec coverage (Phase 2):** Buy Now replacing Buy Button ✓ (T4), createCheckoutSession w/ server-side validation + inline NZD price_data + adjustable qty + flat shipping + NZ address ✓ (T1), webhook writes paid order + order number + idempotency + stock ✓ (T2), orders/counters locked down ✓ (T3), success/cancel + redirect ✓ (T4), test-mode E2E ✓ (T5).
- **Deferred (correct):** cart/drawer (until multi-product); transactional emails + customer order-tracking page (Phase 4); live Stripe keys + Shopify/BuyButton deletion (Phase 5).
- **Money:** cents end-to-end; Stripe `unit_amount` = `priceNZD` directly.
- **Trust boundary:** product price never taken from client — server re-resolves from Firestore (T1); order written only from signature-verified webhook (T2).
- **Open/provisional:** `SHIPPING_FLAT_CENTS` placeholder (Jesse to confirm); `STOREFRONT_URL` set to prod — use dev origin when testing locally.
- **Gotcha:** webhook MUST use `req.rawBody` (Firebase v2 onRequest provides it) — a parsed body breaks signature verification.
```
