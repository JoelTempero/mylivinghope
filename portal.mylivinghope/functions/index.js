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
