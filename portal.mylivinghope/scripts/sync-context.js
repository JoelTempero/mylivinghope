import { bucket } from './firebase-admin-init.js'
import { existsSync, writeFileSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SHARED_DIR = join(__dirname, '..', 'shared')
const STORAGE_PREFIX = 'shared/'
const FILES = ['CLAUDE-JOEL.md', 'CLAUDE-JESSE.md', 'MLH-SHARED.md']

async function pull() {
  console.log('Pulling shared context files from Firebase Storage...')
  for (const file of FILES) {
    const remotePath = `${STORAGE_PREFIX}${file}`
    const localPath = join(SHARED_DIR, file)
    try {
      const [contents] = await bucket.file(remotePath).download()
      writeFileSync(localPath, contents.toString('utf-8'))
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
    const localPath = join(SHARED_DIR, file)
    if (!existsSync(localPath)) {
      console.log(`  - ${file} (not found locally, skipping)`)
      continue
    }
    const remotePath = `${STORAGE_PREFIX}${file}`
    const contents = readFileSync(localPath, 'utf-8')
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

  const sharedPath = join(SHARED_DIR, 'MLH-SHARED.md')
  const personalPath = join(SHARED_DIR, `CLAUDE-${user.toUpperCase()}.md`)

  if (!existsSync(sharedPath)) {
    writeFileSync(sharedPath, shared)
    await bucket.file(`${STORAGE_PREFIX}MLH-SHARED.md`).save(shared, { contentType: 'text/markdown' })
    console.log('  ✓ MLH-SHARED.md (created)')
  } else {
    console.log('  - MLH-SHARED.md (already exists)')
  }

  writeFileSync(personalPath, personal)
  await bucket.file(`${STORAGE_PREFIX}CLAUDE-${user.toUpperCase()}.md`).save(personal, { contentType: 'text/markdown' })
  console.log(`  ✓ CLAUDE-${user.toUpperCase()}.md (created)`)

  console.log('Done. Run "npm run sync-context -- pull" to download all files.')
}

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
