# Shared AI Context Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give both Joel's and Jesse's Claude Code sessions shared business context via synced .md files in Firebase Storage and on-demand Firestore queries via MCP server + CLI scripts.

**Architecture:** Three shared .md files (CLAUDE-JOEL.md, CLAUDE-JESSE.md, MLH-SHARED.md) synced to/from Firebase Storage. A local MCP server exposes Firestore collections as Claude Code tools. CLI scripts provide the same queries as a fallback. A portal "Sync Context" button triggers a Cloud Function to refresh shared stats.

**Tech Stack:** Node.js, firebase-admin, @modelcontextprotocol/sdk, Firebase Cloud Functions, Firebase Storage

---

## File Structure

```
portal.mylivinghope/
├── scripts/
│   ├── sync-context.js          # Pull/push .md files from Firebase Storage
│   └── query-firestore.js       # CLI Firestore query tool
├── mcp-server/
│   ├── package.json             # MCP server dependencies
│   └── index.js                 # MCP server entry point
├── functions/
│   ├── package.json             # Cloud Functions dependencies
│   └── index.js                 # generateContext Cloud Function
├── shared/                      # Local directory for synced .md files (gitignored)
│   ├── CLAUDE-JOEL.md
│   ├── CLAUDE-JESSE.md
│   └── MLH-SHARED.md
└── src/
    └── pages/
        └── Settings.jsx         # Modify: add "Sync Context" button
```

---

### Task 1: Firebase Admin Setup & Service Account Config

**Files:**
- Create: `portal.mylivinghope/scripts/firebase-admin-init.js`
- Create: `portal.mylivinghope/shared/.gitkeep`
- Modify: `portal.mylivinghope/.gitignore`

- [ ] **Step 1: Add `shared/` and service key to .gitignore**

Check current .gitignore contents, then append:

```
# Shared AI context files (synced from Firebase Storage)
shared/*.md

# Firebase service account key
firebase-service-key.json
```

- [ ] **Step 2: Create the shared directory with a .gitkeep**

Create `portal.mylivinghope/shared/.gitkeep` (empty file) so the directory is tracked but .md contents are not.

- [ ] **Step 3: Create the shared Firebase Admin initializer**

```js
// portal.mylivinghope/scripts/firebase-admin-init.js
const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const { getStorage } = require('firebase-admin/storage')
const path = require('path')

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
  || path.join(__dirname, '..', 'firebase-service-key.json')

const app = initializeApp({
  credential: cert(require(serviceAccountPath)),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'my-living-hope.firebasestorage.app',
})

const db = getFirestore(app)
const bucket = getStorage(app).bucket()

module.exports = { db, bucket }
```

- [ ] **Step 4: Install firebase-admin in the portal project**

Run: `cd portal.mylivinghope && npm install firebase-admin`

- [ ] **Step 5: Test the connection**

Run: `cd portal.mylivinghope && node -e "const {db} = require('./scripts/firebase-admin-init'); db.listCollections().then(cols => console.log(cols.map(c => c.id))).catch(e => console.error(e.message))"`

Expected: Array of collection names (products, tasks, contacts, etc.) or an auth error if the service key isn't placed yet. If auth error, that's expected — the key needs to be manually placed.

- [ ] **Step 6: Commit**

```bash
git add scripts/firebase-admin-init.js shared/.gitkeep .gitignore package.json package-lock.json
git commit -m "feat: add firebase-admin setup for CLI scripts and MCP server"
```

---

### Task 2: Sync Context Script (Pull/Push)

**Files:**
- Create: `portal.mylivinghope/scripts/sync-context.js`
- Modify: `portal.mylivinghope/package.json` (add sync-context script)

- [ ] **Step 1: Create the sync-context script**

```js
// portal.mylivinghope/scripts/sync-context.js
const { bucket } = require('./firebase-admin-init')
const fs = require('fs')
const path = require('path')

const SHARED_DIR = path.join(__dirname, '..', 'shared')
const STORAGE_PREFIX = 'shared/'
const FILES = ['CLAUDE-JOEL.md', 'CLAUDE-JESSE.md', 'MLH-SHARED.md']

async function pull() {
  console.log('Pulling shared context files from Firebase Storage...')
  for (const file of FILES) {
    const remotePath = `${STORAGE_PREFIX}${file}`
    const localPath = path.join(SHARED_DIR, file)
    try {
      const [contents] = await bucket.file(remotePath).download()
      fs.writeFileSync(localPath, contents.toString('utf-8'))
      console.log(`  ✓ ${file}`)
    } catch (err) {
      if (err.code === 404) {
        console.log(`  - ${file} (not found in storage, skipping)`)
      } else {
        console.error(`  ✗ ${file}: ${err.message}`)
      }
    }
  }
  console.log('Done.')
}

async function push(user) {
  if (!user) {
    console.error('Usage: node sync-context.js push --user <joel|jesse>')
    process.exit(1)
  }

  const personalFile = `CLAUDE-${user.toUpperCase()}.md`
  const filesToPush = [personalFile, 'MLH-SHARED.md']

  console.log(`Pushing context files for ${user}...`)
  for (const file of filesToPush) {
    const localPath = path.join(SHARED_DIR, file)
    if (!fs.existsSync(localPath)) {
      console.log(`  - ${file} (not found locally, skipping)`)
      continue
    }
    const remotePath = `${STORAGE_PREFIX}${file}`
    const contents = fs.readFileSync(localPath, 'utf-8')
    await bucket.file(remotePath).save(contents, { contentType: 'text/markdown' })
    console.log(`  ✓ ${file}`)
  }
  console.log('Done.')
}

async function init(user) {
  if (!user) {
    console.error('Usage: node sync-context.js init --user <joel|jesse>')
    process.exit(1)
  }

  console.log('Initializing shared context files...')

  const shared = `# My Living Hope — Shared Context

## Business Overview
- Prayer Portals / Prayer Cards — connecting emotions with Scripture and prayer
- Based in Christchurch, New Zealand
- Brand: green (#336F49), salmon (#F5D7CF), cream (#FDF8F5)
- Team: Jesse (founder), Joel (developer, Sidequest Digital)

## Current Priorities
- [ ] (add priorities here)

## Key Decisions
- (none yet)
`

  const personal = `# CLAUDE-${user.toUpperCase()}.md

## Session Log

## Notes
`

  const sharedPath = path.join(SHARED_DIR, 'MLH-SHARED.md')
  const personalPath = path.join(SHARED_DIR, `CLAUDE-${user.toUpperCase()}.md`)

  if (!fs.existsSync(sharedPath)) {
    fs.writeFileSync(sharedPath, shared)
    await bucket.file(`${STORAGE_PREFIX}MLH-SHARED.md`).save(shared, { contentType: 'text/markdown' })
    console.log('  ✓ MLH-SHARED.md (created)')
  } else {
    console.log('  - MLH-SHARED.md (already exists)')
  }

  fs.writeFileSync(personalPath, personal)
  await bucket.file(`${STORAGE_PREFIX}CLAUDE-${user.toUpperCase()}.md`).save(personal, { contentType: 'text/markdown' })
  console.log(`  ✓ CLAUDE-${user.toUpperCase()}.md (created)`)

  console.log('Done. Run "npm run sync-context -- pull" to download all files.')
}

// Parse CLI args
const args = process.argv.slice(2)
const action = args[0]
const userIdx = args.indexOf('--user')
const user = userIdx !== -1 ? args[userIdx + 1] : null

switch (action) {
  case 'pull':
    pull()
    break
  case 'push':
    push(user)
    break
  case 'init':
    init(user)
    break
  default:
    console.log('Usage:')
    console.log('  node sync-context.js init --user <joel|jesse>  # First-time setup')
    console.log('  node sync-context.js pull                      # Download all context files')
    console.log('  node sync-context.js push --user <joel|jesse>  # Upload your changes')
}
```

- [ ] **Step 2: Add npm scripts to package.json**

Add to the `"scripts"` section of `portal.mylivinghope/package.json`:

```json
"sync-context": "node scripts/sync-context.js"
```

- [ ] **Step 3: Test pull (should handle empty storage gracefully)**

Run: `cd portal.mylivinghope && npm run sync-context -- pull`

Expected: Three "not found in storage, skipping" messages (storage is empty on first run).

- [ ] **Step 4: Test init**

Run: `cd portal.mylivinghope && npm run sync-context -- init --user joel`

Expected: Creates local files and uploads to storage. Then verify:

Run: `cd portal.mylivinghope && npm run sync-context -- pull`

Expected: Three files downloaded, including CLAUDE-JOEL.md and MLH-SHARED.md.

- [ ] **Step 5: Commit**

```bash
git add scripts/sync-context.js package.json package-lock.json
git commit -m "feat: add sync-context script for shared Claude Code context files"
```

---

### Task 3: Firestore CLI Query Script

**Files:**
- Create: `portal.mylivinghope/scripts/query-firestore.js`

- [ ] **Step 1: Create the CLI query script**

```js
// portal.mylivinghope/scripts/query-firestore.js
const { db } = require('./firebase-admin-init')

async function listCollections() {
  const collections = await db.listCollections()
  console.log('Available collections:')
  collections.forEach((col) => console.log(`  - ${col.id}`))
}

async function queryCollection(collectionName, filters = {}, options = {}) {
  let query = db.collection(collectionName)

  // Apply filters from CLI args
  for (const [field, value] of Object.entries(filters)) {
    if (value.startsWith('!')) {
      query = query.where(field, '!=', value.slice(1))
    } else {
      query = query.where(field, '==', value)
    }
  }

  // Apply ordering
  if (options.orderBy) {
    query = query.orderBy(options.orderBy, options.direction || 'desc')
  }

  // Apply limit
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

// Parse CLI args
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
```

- [ ] **Step 2: Test listing collections**

Run: `cd portal.mylivinghope && node scripts/query-firestore.js --list`

Expected: List of collection names.

- [ ] **Step 3: Test querying a collection**

Run: `cd portal.mylivinghope && node scripts/query-firestore.js products`

Expected: Products listed with their fields.

- [ ] **Step 4: Test with filters**

Run: `cd portal.mylivinghope && node scripts/query-firestore.js products --status "In stock"`

Expected: Only in-stock products shown.

- [ ] **Step 5: Commit**

```bash
git add scripts/query-firestore.js
git commit -m "feat: add CLI Firestore query script for Claude Code"
```

---

### Task 4: MCP Server

**Files:**
- Create: `portal.mylivinghope/mcp-server/package.json`
- Create: `portal.mylivinghope/mcp-server/index.js`

- [ ] **Step 1: Create MCP server package.json**

```json
{
  "name": "mlh-firestore-mcp",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "main": "index.js",
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.12.0",
    "firebase-admin": "^13.0.0"
  }
}
```

- [ ] **Step 2: Install MCP server dependencies**

Run: `cd portal.mylivinghope/mcp-server && npm install`

- [ ] **Step 3: Create the MCP server**

```js
// portal.mylivinghope/mcp-server/index.js
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { z } from 'zod'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SHARED_DIR = join(__dirname, '..', 'shared')

// Firebase init
const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
  || join(__dirname, '..', 'firebase-service-key.json')

const app = initializeApp({
  credential: cert(JSON.parse(readFileSync(keyPath, 'utf-8'))),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'my-living-hope.firebasestorage.app',
})

const db = getFirestore(app)
const bucket = getStorage(app).bucket()

// MCP Server
const server = new McpServer({
  name: 'mlh-firestore',
  version: '1.0.0',
})

// Tool: list_collections
server.tool('list_collections', 'List all Firestore collections', {}, async () => {
  const collections = await db.listCollections()
  const names = collections.map((c) => c.id)
  return { content: [{ type: 'text', text: JSON.stringify(names, null, 2) }] }
})

// Tool: query_collection
server.tool(
  'query_collection',
  'Query a Firestore collection with optional filters, ordering, and limits',
  {
    collection: z.string().describe('Collection name'),
    filters: z
      .array(
        z.object({
          field: z.string(),
          op: z.enum(['==', '!=', '<', '<=', '>', '>=', 'array-contains', 'in']),
          value: z.any(),
        })
      )
      .optional()
      .describe('Array of filter objects'),
    orderBy: z
      .object({
        field: z.string(),
        direction: z.enum(['asc', 'desc']).optional(),
      })
      .optional()
      .describe('Order by field and direction'),
    limit: z.number().optional().default(20).describe('Max results (default 20)'),
  },
  async ({ collection: colName, filters = [], orderBy, limit = 20 }) => {
    let query = db.collection(colName)

    for (const f of filters) {
      query = query.where(f.field, f.op, f.value)
    }
    if (orderBy) {
      query = query.orderBy(orderBy.field, orderBy.direction || 'desc')
    }
    query = query.limit(limit)

    const snapshot = await query.get()
    const docs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null,
    }))

    return { content: [{ type: 'text', text: JSON.stringify(docs, null, 2) }] }
  }
)

// Tool: get_document
server.tool(
  'get_document',
  'Get a single Firestore document by ID',
  {
    collection: z.string().describe('Collection name'),
    id: z.string().describe('Document ID'),
  },
  async ({ collection: colName, id }) => {
    const doc = await db.collection(colName).doc(id).get()
    if (!doc.exists) {
      return { content: [{ type: 'text', text: `Document ${id} not found in ${colName}` }] }
    }
    const data = doc.data()
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
              updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
            },
            null,
            2
          ),
        },
      ],
    }
  }
)

// Tool: search_collection
server.tool(
  'search_collection',
  'Search across text fields in a Firestore collection',
  {
    collection: z.string().describe('Collection name'),
    searchText: z.string().describe('Text to search for (case-insensitive)'),
    fields: z.array(z.string()).describe('Field names to search within'),
    limit: z.number().optional().default(20).describe('Max results'),
  },
  async ({ collection: colName, searchText, fields, limit = 20 }) => {
    const snapshot = await db.collection(colName).limit(200).get()
    const searchLower = searchText.toLowerCase()

    const matches = snapshot.docs
      .filter((doc) => {
        const data = doc.data()
        return fields.some((field) => {
          const val = data[field]
          if (typeof val === 'string') return val.toLowerCase().includes(searchLower)
          if (Array.isArray(val)) return val.some((v) => String(v).toLowerCase().includes(searchLower))
          return false
        })
      })
      .slice(0, limit)
      .map((doc) => ({ id: doc.id, ...doc.data() }))

    return { content: [{ type: 'text', text: JSON.stringify(matches, null, 2) }] }
  }
)

// Tool: sync_context
server.tool(
  'sync_context',
  'Pull or push shared context .md files from/to Firebase Storage',
  {
    action: z.enum(['pull', 'push']).describe('pull to download, push to upload'),
    user: z.enum(['joel', 'jesse']).describe('Which user context to sync'),
  },
  async ({ action, user }) => {
    const FILES = ['CLAUDE-JOEL.md', 'CLAUDE-JESSE.md', 'MLH-SHARED.md']
    const results = []

    if (!existsSync(SHARED_DIR)) {
      mkdirSync(SHARED_DIR, { recursive: true })
    }

    if (action === 'pull') {
      for (const file of FILES) {
        try {
          const [contents] = await bucket.file(`shared/${file}`).download()
          writeFileSync(join(SHARED_DIR, file), contents.toString('utf-8'))
          results.push(`✓ ${file}`)
        } catch (err) {
          results.push(`- ${file} (${err.code === 404 ? 'not found' : err.message})`)
        }
      }
    } else {
      const personalFile = `CLAUDE-${user.toUpperCase()}.md`
      for (const file of [personalFile, 'MLH-SHARED.md']) {
        const localPath = join(SHARED_DIR, file)
        if (!existsSync(localPath)) {
          results.push(`- ${file} (not found locally)`)
          continue
        }
        const contents = readFileSync(localPath, 'utf-8')
        await bucket.file(`shared/${file}`).save(contents, { contentType: 'text/markdown' })
        results.push(`✓ ${file}`)
      }
    }

    return { content: [{ type: 'text', text: `${action} complete:\n${results.join('\n')}` }] }
  }
)

// Start server
const transport = new StdioServerTransport()
await server.connect(transport)
```

- [ ] **Step 4: Test the MCP server starts without errors**

Run: `cd portal.mylivinghope/mcp-server && echo '{"jsonrpc":"2.0","method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}},"id":1}' | node index.js`

Expected: JSON response with server capabilities (the server initializes and responds to the init handshake).

- [ ] **Step 5: Commit**

```bash
git add mcp-server/
git commit -m "feat: add Firestore MCP server for Claude Code integration"
```

---

### Task 5: Portal "Sync Context" Button

**Files:**
- Modify: `portal.mylivinghope/src/pages/Settings.jsx`

- [ ] **Step 1: Read current Settings.jsx**

Read `portal.mylivinghope/src/pages/Settings.jsx` to understand the existing page structure.

- [ ] **Step 2: Add a "Sync Context" section to Settings**

Add a new card/section with a button that calls a Firebase Cloud Function. For now, wire up the UI with a placeholder that calls the function URL. The actual Cloud Function is created in Task 6.

Add to the Settings page:

```jsx
// Add to imports
import { RefreshCw } from 'lucide-react'
import { httpsCallable } from 'firebase/functions'
import { getFunctions } from 'firebase/functions'

// Add state for sync
const [syncing, setSyncing] = useState(false)
const [syncResult, setSyncResult] = useState(null)

const handleSyncContext = async () => {
  setSyncing(true)
  setSyncResult(null)
  try {
    const functions = getFunctions()
    const generateContext = httpsCallable(functions, 'generateContext')
    const result = await generateContext()
    setSyncResult({ success: true, message: 'Context synced successfully' })
  } catch (err) {
    setSyncResult({ success: false, message: err.message })
  } finally {
    setSyncing(false)
  }
}

// Add this card to the page JSX
<Card>
  <Card.Header>
    <Card.Title>AI Context Sync</Card.Title>
  </Card.Header>
  <Card.Body className="space-y-4">
    <p className="text-sm text-gray-600 dark:text-gray-400">
      Update the shared context file with the latest business data.
      Run this before starting a Claude Code session for the freshest data.
    </p>
    <div className="flex items-center gap-4">
      <Button onClick={handleSyncContext} loading={syncing}>
        <RefreshCw className="w-4 h-4" />
        Sync Context
      </Button>
      {syncResult && (
        <span className={syncResult.success ? 'text-green-600 text-sm' : 'text-red-600 text-sm'}>
          {syncResult.message}
        </span>
      )}
    </div>
  </Card.Body>
</Card>
```

- [ ] **Step 3: Add getFunctions import to firebase.js**

Add to `portal.mylivinghope/src/lib/firebase.js`:

```js
import { getFunctions } from 'firebase/functions'

export const functions = getFunctions(app)
```

Then update the Settings import to use the shared instance:

```js
import { functions } from '../lib/firebase'
import { httpsCallable } from 'firebase/functions'
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/Settings.jsx src/lib/firebase.js
git commit -m "feat: add Sync Context button to portal Settings page"
```

---

### Task 6: Cloud Function — generateContext

**Files:**
- Create: `portal.mylivinghope/functions/package.json`
- Create: `portal.mylivinghope/functions/index.js`

- [ ] **Step 1: Create functions package.json**

```json
{
  "name": "mlh-functions",
  "version": "1.0.0",
  "private": true,
  "main": "index.js",
  "engines": {
    "node": "20"
  },
  "dependencies": {
    "firebase-admin": "^13.0.0",
    "firebase-functions": "^6.0.0"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run: `cd portal.mylivinghope/functions && npm install`

- [ ] **Step 3: Create the generateContext Cloud Function**

```js
// portal.mylivinghope/functions/index.js
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

  // Gather summary stats from Firestore
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

  // Read existing MLH-SHARED.md from storage (preserve session log and decisions)
  let existingContent = ''
  try {
    const [contents] = await bucket.file('shared/MLH-SHARED.md').download()
    existingContent = contents.toString('utf-8')
  } catch (err) {
    // File doesn't exist yet, start fresh
  }

  // Extract Key Decisions and Current Priorities sections from existing content
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

  return { success: true, message: 'Context synced', stats: { products: products.size, tasks: activeTasks, contacts: contacts.size } }
})
```

- [ ] **Step 4: Add firebase.json for functions config**

Check if `portal.mylivinghope/firebase.json` exists. If it does, add the functions config. If not, create it:

```json
{
  "functions": {
    "source": "functions",
    "runtime": "nodejs20"
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add functions/ firebase.json
git commit -m "feat: add generateContext Cloud Function for context sync"
```

---

### Task 7: Wire Up CLAUDE.md References

**Files:**
- Modify: `portal.mylivinghope/CLAUDE.md` (create if not exists)

- [ ] **Step 1: Add shared context references to the portal CLAUDE.md**

Add to the top of the portal's CLAUDE.md (or the project root CLAUDE.md):

```markdown
## Shared Business Context
Read these files at session start for business context (run `npm run sync-context -- pull` first):
- `shared/CLAUDE-JOEL.md` — Joel's session logs and dev notes
- `shared/CLAUDE-JESSE.md` — Jesse's session logs and business notes
- `shared/MLH-SHARED.md` — Brand overview, priorities, key decisions

To query live Firestore data during a session, use the mlh-firestore MCP tools or run:
- `node scripts/query-firestore.js <collection>` — query any collection
- `node scripts/query-firestore.js --list` — see available collections
```

- [ ] **Step 2: Add MCP server config documentation**

Add a section to CLAUDE.md:

```markdown
## MCP Server Setup
Add to `.claude/settings.json` on each machine:
\```json
{
  "mcpServers": {
    "mlh-firestore": {
      "command": "node",
      "args": ["<absolute-path-to>/portal.mylivinghope/mcp-server/index.js"],
      "env": {
        "FIREBASE_STORAGE_BUCKET": "my-living-hope.firebasestorage.app",
        "GOOGLE_APPLICATION_CREDENTIALS": "<absolute-path-to>/portal.mylivinghope/firebase-service-key.json"
      }
    }
  }
}
\```
```

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add shared context and MCP server references to CLAUDE.md"
```

---

### Task 8: End-to-End Test

- [ ] **Step 1: Initialize context files**

Run: `cd portal.mylivinghope && npm run sync-context -- init --user joel`

- [ ] **Step 2: Verify files exist locally**

Run: `ls portal.mylivinghope/shared/`

Expected: `CLAUDE-JOEL.md`, `MLH-SHARED.md` present.

- [ ] **Step 3: Pull to get all files**

Run: `cd portal.mylivinghope && npm run sync-context -- pull`

Expected: All three files downloaded (CLAUDE-JESSE.md may not exist yet, that's fine).

- [ ] **Step 4: Test CLI query**

Run: `cd portal.mylivinghope && node scripts/query-firestore.js products --limit 3`

Expected: Up to 3 products printed with their fields.

- [ ] **Step 5: Test push**

Edit `shared/CLAUDE-JOEL.md` to add a test session log entry, then:

Run: `cd portal.mylivinghope && npm run sync-context -- push --user joel`

Expected: Personal file and MLH-SHARED.md uploaded.

- [ ] **Step 6: Verify round-trip**

Delete local files, pull again:

Run: `cd portal.mylivinghope && rm shared/*.md && npm run sync-context -- pull`

Expected: Files restored with the test session log entry intact.

- [ ] **Step 7: Commit any final adjustments**

```bash
git add -A
git commit -m "chore: finalize shared AI context layer setup"
```
