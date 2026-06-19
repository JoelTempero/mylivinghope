const { onCall, onRequest, HttpsError } = require('firebase-functions/v2/https')
const { defineSecret } = require('firebase-functions/params')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const { getStorage } = require('firebase-admin/storage')

initializeApp()
const db = getFirestore()
const bucket = getStorage().bucket()

const STRIPE_SECRET_KEY = defineSecret('STRIPE_SECRET_KEY')
const STRIPE_WEBHOOK_SECRET = defineSecret('STRIPE_WEBHOOK_SECRET')

const SHIPPING_FLAT_CENTS = 700 // flat NZ shipping, confirmed by Jesse 2026-06-11
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
    if (!Number.isInteger(p.priceNZD) || p.priceNZD <= 0) throw new HttpsError('failed-precondition', `${p.title} is not available for purchase right now`)
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
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: SHIPPING_FLAT_CENTS, currency: 'nzd' },
          display_name: 'Standard NZ shipping',
        },
      },
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 0, currency: 'nzd' },
          display_name: 'Pickup in Christchurch (free)',
        },
      },
    ],
    phone_number_collection: { enabled: true },
    success_url: `${STOREFRONT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${STOREFRONT_URL}/checkout/cancel`,
    metadata: { items: items.map((l) => `${l.productId}:${l.qty || 1}`).join(',') },
  })
  return { url: session.url }
})

exports.stripeWebhook = onRequest({ secrets: [STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET] }, async (req, res) => {
  const stripe = require('stripe')(STRIPE_SECRET_KEY.value())
  let event
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, req.headers['stripe-signature'], STRIPE_WEBHOOK_SECRET.value())
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }
  // Fulfill on the completed event (synchronous card payments) and on
  // async_payment_succeeded (delayed methods that only confirm later). Both carry
  // the full session object; handleCompletedCheckout re-checks payment_status.
  if (event.type === 'checkout.session.completed' ||
      event.type === 'checkout.session.async_payment_succeeded') {
    try {
      await handleCompletedCheckout(stripe, event.data.object)
    } catch (err) {
      console.error('Order write failed:', err)
      return res.status(500).send('Order processing failed') // Stripe retries
    }
  } else if (event.type === 'checkout.session.async_payment_failed') {
    console.warn(`Async payment failed for session ${event.data.object.id}`)
  }
  return res.status(200).json({ received: true })
})

async function handleCompletedCheckout(stripe, session) {
  // Only fulfill once payment is actually captured. checkout.session.completed
  // also fires for async / zero-amount methods where no money has moved — never
  // write a 'paid' order without a confirmed payment.
  if (session.payment_status !== 'paid') {
    console.log(`Session ${session.id} completed but payment_status=${session.payment_status} — not fulfilling`)
    return
  }

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 })
  const items = lineItems.data.map((li) => ({ title: li.description, qty: li.quantity, unitPriceNZD: li.price?.unit_amount ?? 0 }))

  // Deterministic doc id = Stripe session id, so a retried or duplicated webhook
  // delivery can never create a second order. Dedup is enforced inside the txn.
  const orderRef = db.collection('orders').doc(session.id)

  await db.runTransaction(async (tx) => {
    const existing = await tx.get(orderRef)
    if (existing.exists) return
    const counterRef = db.collection('counters').doc('orderNumber')
    const counterSnap = await tx.get(counterRef)
    const last = counterSnap.exists ? (counterSnap.data().last || 1000) : 1000
    const next = last + 1
    const addr = session.shipping_details?.address || session.customer_details?.address || {}
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

exports.generateContext = onCall(async (request) => {
  if (!request.auth) {
    throw new Error('Authentication required')
  }

  const [products, tasks, contacts, campaigns, artists, emotions] = await Promise.all([
    db.collection('products').get(),
    db.collection('tasks').get(),
    db.collection('contacts').get(),
    db.collection('campaigns').get(),
    db.collection('artists').get(),
    db.collection('emotions').get(),
  ])

  const inStock = products.docs.filter((d) => d.data().status === 'In stock').length
  const activeTasks = tasks.docs.filter((d) => d.data().status !== 'Complete').length
  const activeCampaigns = campaigns.docs.filter((d) => d.data().status === 'In progress').length
  const activeArtists = artists.docs.filter((d) => d.data().status !== 'Archived').length

  let existingContent = ''
  try {
    const [contents] = await bucket.file('shared/MLH-SHARED.md').download()
    existingContent = contents.toString('utf-8')
  } catch (err) {
    // File doesn't exist yet
  }

  const decisionsMatch = existingContent.match(/## Key Decisions\n([\s\S]*?)(?=\n## |$)/)
  const prioritiesMatch = existingContent.match(/## Current Priorities\n([\s\S]*?)(?=\n## |$)/)
  const decisions = decisionsMatch ? decisionsMatch[1].trim() : '- (none yet)'
  const priorities = prioritiesMatch ? prioritiesMatch[1].trim() : '- [ ] (add priorities here)'

  const now = new Date().toISOString().split('T')[0]

  const content = `# My Living Hope — Shared Context

## Business Overview
- Prayer Portals / Prayer Cards — connecting emotions with Scripture and prayer
- Based in Christchurch, New Zealand
- Brand: green (#336F49), salmon (#F5D7CF), cream (#FDF8F5)
- Team: Jesse (founder), Joel (developer, Sidequest Digital)

## Live Stats (updated ${now})
- Products: ${products.size} total, ${inStock} in stock
- Tasks: ${tasks.size} total, ${activeTasks} active
- Contacts: ${contacts.size}
- Campaigns: ${campaigns.size} total, ${activeCampaigns} active
- Artists: ${artists.size} total, ${activeArtists} active
- Emotions/Desires: ${emotions.size}

## Current Priorities
${priorities}

## Key Decisions
${decisions}
`

  await bucket.file('shared/MLH-SHARED.md').save(content, { contentType: 'text/markdown' })

  return {
    success: true,
    message: 'Context synced',
    stats: { products: products.size, tasks: activeTasks, contacts: contacts.size },
  }
})
