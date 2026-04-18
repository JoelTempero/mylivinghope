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

const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
  || join(__dirname, '..', 'firebase-service-key.json')

const app = initializeApp({
  credential: cert(JSON.parse(readFileSync(keyPath, 'utf-8'))),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'my-living-hope.firebasestorage.app',
})

const db = getFirestore(app)
const bucket = getStorage(app).bucket()

const server = new McpServer({
  name: 'mlh-firestore',
  version: '1.0.0',
})

server.tool('list_collections', 'List all Firestore collections', {}, async () => {
  const collections = await db.listCollections()
  const names = collections.map((c) => c.id)
  return { content: [{ type: 'text', text: JSON.stringify(names, null, 2) }] }
})

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

const transport = new StdioServerTransport()
await server.connect(transport)
