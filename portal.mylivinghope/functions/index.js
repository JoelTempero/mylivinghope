const { onCall } = require('firebase-functions/v2/https')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const { getStorage } = require('firebase-admin/storage')

initializeApp()
const db = getFirestore()
const bucket = getStorage().bucket()

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
