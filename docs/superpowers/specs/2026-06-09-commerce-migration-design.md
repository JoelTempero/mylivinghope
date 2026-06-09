# My Living Hope — Self-Hosted Commerce Migration

**Date:** 2026-06-09
**Status:** Design approved, pending spec review
**Goal:** Move My Living Hope entirely off Shopify onto a self-hosted commerce stack — own product CMS, Stripe payments, and order management/tracking — within the existing Firebase + React ecosystem.

---

## 1. Summary

Today the storefront sells via the **Shopify Buy Button SDK** (an injected overlay) and the portal's `products` collection is an internal CRM tracker, not a public catalog. This project replaces Shopify entirely:

- A **product catalog CMS** managed in the existing portal, stored in Firestore.
- **Cart + checkout** on the storefront, replacing the Buy Button overlay.
- **Stripe Checkout (hosted)** for NZD payments.
- **Order management** in the portal and **guest order tracking** for customers.
- Full **cutover** off Shopify.

When complete, Shopify is decommissioned and MLH owns the entire commerce flow.

---

## 2. Key decisions (locked)

| Decision | Choice | Rationale |
|---|---|---|
| Payment integration | **Stripe Checkout Sessions (hosted, redirect)** | Fastest, least PCI surface, handles cards/wallets/shipping/dynamic payment methods. Stripe-recommended for one-time payments. |
| Source of truth | Firestore for **catalog**, Stripe for **money** | Order written only on signed webhook confirmation; never trust client. |
| Stripe product sync | **None** — inline `price_data` from Firestore at session creation | Avoids keeping a Stripe product/price catalog in sync. |
| Catalog scope v1 | **Flagship card pack only**, but data-driven for many products | Matches the "lead with one card pack" strategy; adding products later is just data. |
| Customer accounts | **Guest checkout only** + email-based order tracking | Lowest friction for low-consideration card purchases. |
| Email provider | **Resend** via Cloud Function | Modern API, free tier, good deliverability. |
| Shipping model | **Flat-rate NZ (provisional)** via Stripe `shipping_options` | Decision deferred; spec assumes flat-rate, revisit before Phase 2. Amount = Jesse's call. |
| Build approach | **Full 5-phase migration**, built phase by phase | Clear end-to-end picture; each phase independently shippable/testable. |

### Open items to confirm with Jesse (do not block Phase 1)
- **Flat-rate shipping amount** + free-over-threshold? (needed by Phase 2)
- **GST registration:** if registered, prices are GST-inclusive (NZ convention) and GST shows on the receipt. (needed by Phase 2/4)
- **Resend account** ownership + sending domain (`mylivinghope.org.nz`) DNS verification. (needed by Phase 4)
- **From-address** for transactional email (e.g. `orders@mylivinghope.org.nz`).

---

## 3. Architecture

```
Storefront (React/Vite)              Portal (React admin)
  ├─ reads published products ◄──┐    ├─ Store ▸ Products (CMS)
  ├─ cart (Zustand + localStorage)│    └─ Store ▸ Orders (management)
  ├─ Checkout button              │              │
  ├─ /checkout/success | /cancel  │              │
  └─ /track-order                 │              ▼
        │                         └──────── Firestore ───────────┐
        ▼ (callable)                        (my-living-hope)      │
  CF: createCheckoutSession                 • storeProducts       │
        │                                   • orders              │
        ▼                                   • counters/orderNumber│
  Stripe Checkout (hosted, NZD)   CF: stripeWebhook ◄────────────┘
        │                          (verifies signature,
        ├─ success redirect ───►    writes/updates order,
        └─ cancel redirect          decrements inventory,
                                     triggers Resend email)
  CF: trackOrder (lookup by orderNumber + email, no auth)
```

**Components & responsibilities**

- **Storefront catalog** — fetches `storeProducts` where `status == 'published'`, renders product page(s). Replaces hardcoded product markup and the Buy Button.
- **Cart** — Zustand store, persisted to `localStorage`. Holds line items `{productId, qty}`; prices re-resolved from Firestore at checkout (never trust localStorage prices).
- **`createCheckoutSession`** (Cloud Function, callable/HTTPS) — validates cart against Firestore (existence, published, stock, price), builds `line_items` with inline `price_data` (NZD), sets `shipping_address_collection` (NZ), `shipping_options` (flat-rate), `success_url`/`cancel_url`, returns the session URL. Reserves nothing — stock is checked again at webhook time.
- **`stripeWebhook`** (Cloud Function, HTTPS) — verifies Stripe signature, handles `checkout.session.completed`: writes the `orders` doc (status `paid`), assigns the next `orderNumber`, decrements inventory atomically, sends the confirmation email via Resend. Idempotent on `stripeSessionId`.
- **`trackOrder`** (Cloud Function, callable) — looks up an order by `orderNumber` + matching `customer.email`, returns sanitised status (no internal fields). Rate-limited.
- **Portal Store section** — Products CMS (CRUD + image upload + publish) and Orders management (list, detail, status transitions, tracking number entry → triggers "shipped" email).

---

## 4. Data model

### `storeProducts`
```
{
  slug: string,            // url-safe, unique
  title: string,
  subtitle: string,
  description: string,     // long-form; markdown or plain
  images: string[],        // Firebase Storage URLs, first = primary
  priceNZD: number,        // integer cents
  compareAtPrice: number|null,
  status: 'draft'|'published',
  inventory: number|null,  // null = unlimited / not tracked
  weight: number|null,     // grams, for future shipping calc
  sortOrder: number,
  seo: { title: string, description: string },
  createdAt, updatedAt
}
```
> Variants are intentionally **out of scope** for v1 (single product). The model can add a `variants[]` array later without breaking existing docs.

### `orders`
```
{
  orderNumber: string,        // 'MLH-1001' (sequential via counter)
  stripeSessionId: string,    // idempotency key
  stripePaymentIntentId: string,
  status: 'pending'|'paid'|'fulfilled'|'shipped'|'cancelled'|'refunded',
  items: [{ productId, slug, title, qty, unitPriceNZD }],
  subtotalNZD: number,
  shippingNZD: number,
  totalNZD: number,
  currency: 'nzd',
  customer: { email, name },
  shippingAddress: { line1, line2, city, region, postalCode, country },
  fulfillment: { trackingNumber: string|null, carrier: string|null, shippedAt: timestamp|null },
  emailsSent: string[],       // ['confirmation','shipped']
  notes: string,
  createdAt, paidAt, updatedAt
}
```

### `counters/orderNumber`
Single doc holding the last sequential order number; incremented in a transaction by the webhook.

---

## 5. Security

- **Stripe secret key + webhook signing secret + Resend API key** stored as Cloud Functions secrets (`firebase functions:secrets`), never in client code or committed.
- **Webhook signature verification** mandatory; reject unverified payloads.
- **Idempotency** — webhook keyed on `stripeSessionId`; re-delivery never double-writes an order or double-decrements stock.
- **Firestore rules:**
  - `storeProducts`: public read **only where `status == 'published'`**; write = admin/editor only.
  - `orders`: **no client read/write**. All access via Cloud Functions (admin SDK) or the portal (authed admin). Customer tracking goes through `trackOrder` only.
  - `counters`: no client access.
- **`trackOrder`** requires both order number and matching email; rate-limited to deter enumeration; returns only customer-safe fields.
- Cart prices from `localStorage` are **never trusted** — always re-resolved server-side.

---

## 6. Phases & acceptance criteria

### Phase 1 — Catalog CMS
- `storeProducts` collection + Firestore rules.
- Portal "Store ▸ Products" page (reuses existing `Button`/`Table`/`Modal`/`Input`/`Select`/`Badge`), with image upload to Firebase Storage and draft/publish toggle.
- Storefront reads published products from Firestore and renders the flagship product page (replaces hardcoded markup; Buy Button still present for now).
- **Done when:** Jesse can create/edit/publish the flagship product in the portal and it renders live on the storefront from Firestore.

### Phase 2 — Cart + Checkout + Payments
- Zustand cart store (localStorage-persisted), add-to-cart UI, cart drawer/page.
- `createCheckoutSession` Cloud Function (server-side validation, inline NZD `price_data`, flat-rate shipping, NZ address collection).
- `stripeWebhook` Cloud Function → writes paid `orders` doc, assigns order number, decrements inventory (idempotent).
- Storefront `/checkout/success` + `/checkout/cancel` pages.
- **Done when:** a full test-mode purchase produces a correct `orders` doc and the success page renders. Verified with Stripe test cards.

### Phase 3 — Order management
- Portal "Store ▸ Orders": list (filter by status), detail view, status transitions, tracking-number entry.
- **Done when:** Jesse can see paid orders, mark them fulfilled/shipped, and record a tracking number.

### Phase 4 — Order tracking + emails
- Resend integration (Cloud Function): order-confirmation email (on `paid`) and shipped email (on tracking entry).
- Storefront `/track-order` page → `trackOrder` Cloud Function (order number + email lookup, no login).
- **Done when:** customer receives a confirmation email and can look up live order status; marking shipped sends a shipped email with tracking.

### Phase 5 — Cutover
- Switch Stripe to **live** keys/secrets.
- Remove Buy Button SDK + Shopify dependencies from storefront; clean up `BuyButton.jsx` and SDK overlay workarounds (Header cart z-index hack, etc.).
- Update Privacy/Terms for the new payment + data flow (Stripe, Resend).
- Smoke-test a real low-value live purchase; refund it.
- Decommission Shopify (cancel/downgrade plan once confident).
- **Done when:** a real customer can buy end-to-end with no Shopify involvement, and Shopify is no longer in the critical path.

---

## 7. Risks & mitigations

- **Webhook reliability** — Stripe retries; we make the handler idempotent and log failures. Order confirmation does not depend on the success-page redirect.
- **Inventory race / oversell** — stock checked at session creation *and* atomically at webhook; for a single low-volume product the risk is minimal, but the transaction guards it.
- **Email deliverability** — verify the sending domain in Resend (SPF/DKIM on `mylivinghope.org.nz`); confirmation must never block order creation (send is best-effort, logged).
- **Deploy permissions** — Firebase deploys must use `leojfx@gmail.com` (known issue: `joel@tempero.nz` gets 403 on Hosting/Functions APIs).
- **Cutover regressions** — keep Shopify live until Phase 5 smoke test passes; cut over, then decommission.

---

## 8. Out of scope (v1)

- Product variants / options.
- Discount codes / promotions.
- Subscriptions / recurring billing.
- Customer login & saved details.
- Calculated/carrier shipping rates (flat-rate only).
- Multi-currency (NZD only).
- Stripe Tax automation (manual GST-inclusive pricing).
