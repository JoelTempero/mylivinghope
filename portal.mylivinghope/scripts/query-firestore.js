import { db } from './firebase-admin-init.js'

async function listCollections() {
  const collections = await db.listCollections()
  console.log('Available collections:')
  collections.forEach((col) => console.log(`  - ${col.id}`))
}

async function queryCollection(collectionName, filters = {}, options = {}) {
  let query = db.collection(collectionName)

  for (const [field, value] of Object.entries(filters)) {
    if (value.startsWith('!')) {
      query = query.where(field, '!=', value.slice(1))
    } else {
      query = query.where(field, '==', value)
    }
  }

  if (options.orderBy) {
    query = query.orderBy(options.orderBy, options.direction || 'desc')
  }

  const limit = options.limit ? parseInt(options.limit) : 20
  query = query.limit(limit)

  const snapshot = await query.get()

  if (snapshot.empty) {
    console.log(`No documents found in ${collectionName}`)
    return
  }

  console.log(`\n${collectionName} (${snapshot.size} results):`)
  console.log('─'.repeat(60))

  snapshot.forEach((doc) => {
    const data = doc.data()
    console.log(`\nID: ${doc.id}`)
    for (const [key, val] of Object.entries(data)) {
      if (key === 'createdAt' || key === 'updatedAt') {
        console.log(`  ${key}: ${val?.toDate?.()?.toISOString() || val}`)
      } else if (Array.isArray(val)) {
        console.log(`  ${key}: [${val.join(', ')}]`)
      } else if (typeof val === 'object' && val !== null) {
        console.log(`  ${key}: ${JSON.stringify(val)}`)
      } else {
        console.log(`  ${key}: ${val}`)
      }
    }
  })
}

async function getDocument(collectionName, docId) {
  const doc = await db.collection(collectionName).doc(docId).get()
  if (!doc.exists) {
    console.log(`Document ${docId} not found in ${collectionName}`)
    return
  }
  console.log(`\n${collectionName}/${docId}:`)
  console.log(JSON.stringify(doc.data(), null, 2))
}

const args = process.argv.slice(2)

if (args.length === 0 || args[0] === '--list') {
  listCollections()
} else if (args.length >= 2 && args[1] === '--id') {
  getDocument(args[0], args[2])
} else {
  const collectionName = args[0]
  const filters = {}
  const options = {}

  for (let i = 1; i < args.length; i += 2) {
    const key = args[i].replace(/^--/, '')
    const val = args[i + 1]
    if (key === 'orderBy' || key === 'direction' || key === 'limit') {
      options[key] = val
    } else {
      filters[key] = val
    }
  }

  queryCollection(collectionName, filters, options)
}
