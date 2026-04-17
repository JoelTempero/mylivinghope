# Shared AI Context Layer — Design Spec

## Overview

Give both team members' Claude Code sessions shared business intelligence about My Living Hope. Two components: (1) shared context files synced via Firebase Storage, and (2) a Firestore MCP server + CLI scripts for on-demand data queries.

**Team:** Joel (contracted developer) and Jesse (founder, non-technical). Joel uses Claude Code for development. Jesse uses Claude Code as a business advisor — product strategy, campaign planning, copy writing, data analysis.

**Key principle:** Don't dump the whole database into a context file. Keep the shared .md files lean (session logs, decisions, priorities). Claude Code pulls specific Firestore data on-demand when a conversation needs it.

## Architecture

### Three Shared Context Files

Stored in Firebase Storage at `gs://[project-bucket]/shared/`:

```
shared/
├── CLAUDE-JOEL.md       # Joel's session logs, dev decisions, technical notes
├── CLAUDE-JESSE.md      # Jesse's session logs, business decisions, creative direction
└── MLH-SHARED.md        # Brand guidelines, current priorities, key decisions
```

Each machine's project CLAUDE.md includes:
```markdown
Read these files for shared business context:
- ./shared/CLAUDE-JOEL.md
- ./shared/CLAUDE-JESSE.md
- ./shared/MLH-SHARED.md
```

Claude Code on Jesse's machine sees Joel's recent dev work. Claude Code on Joel's machine sees Jesse's recent business thinking. No merge conflicts — each person only writes to their own file.

### MLH-SHARED.md Structure

```markdown
# My Living Hope — Shared Context

## Business Overview
- Prayer Portals / Prayer Cards — connecting emotions with Scripture and prayer
- Based in Christchurch, New Zealand
- Brand: green (#336F49), salmon (#F5D7CF), cream (#FDF8F5)
- Team: Jesse (founder), Joel (developer, Sidequest Digital)

## Current Priorities
- [ ] [updated by either person as priorities shift]

## Key Decisions
- [date] — [decision and reasoning]
```

### Individual CLAUDE Files Structure

```markdown
# CLAUDE-[NAME].md

## Session Log
### [date]
- [what was worked on, key outcomes, decisions made]

## Notes
- [running notes relevant to this person's work]
```

## Sync Flow

### Start of Session
1. Run `npm run sync-context -- pull`
2. Downloads all three .md files from Firebase Storage to `./shared/`
3. Claude Code reads them via CLAUDE.md reference

### End of Session
1. Claude updates the local personal .md file (session log entry, new decisions)
2. Run `npm run sync-context -- push`
3. Uploads updated personal .md back to Firebase Storage

### Portal "Sync Context" Button (Optional)
- Lives on the Dashboard or Settings page in the portal
- Calls a Firebase Cloud Function `generateContext`
- The Cloud Function reads key business stats from Firestore (product count, active campaigns, open tasks)
- Updates the "Business Overview" section in `MLH-SHARED.md` with fresh summary stats
- Writes back to Firebase Storage
- This is supplementary — the main sync happens via the CLI script

## Firestore MCP Server

A local Node.js MCP server that exposes Firestore data as tools to Claude Code.

### Tools

| Tool | Parameters | Returns |
|------|-----------|---------|
| `list_collections` | none | Array of collection names |
| `query_collection` | `collection` (required), `filters` (optional array of `{field, op, value}`), `orderBy` (optional `{field, direction}`), `limit` (optional, default 20) | Array of documents |
| `get_document` | `collection`, `id` | Single document |
| `search_collection` | `collection`, `searchText`, `fields` (array of field names to search) | Matching documents |
| `sync_context` | `action`: "pull" or "push", `user`: "joel" or "jesse" | Success/failure message |

### Example Interactions

**Jesse asks:** "What emotions haven't we covered with cards yet?"
→ Claude calls `query_collection({ collection: "emotions" })` and `query_collection({ collection: "products", filters: [{ field: "type", op: "==", value: "Prayer Cards" }] })`
→ Cross-references and identifies gaps

**Joel asks:** "Which tasks are assigned to me that are still open?"
→ Claude calls `query_collection({ collection: "tasks", filters: [{ field: "assignedTo", op: "array-contains", value: "Joel" }, { field: "status", op: "!=", value: "Complete" }] })`

**Jesse asks:** "Help me write an email to our stockists about the new card range"
→ Claude calls `query_collection({ collection: "contacts" })` to understand who the stockists are, then `query_collection({ collection: "products", filters: [{ field: "status", op: "==", value: "In stock" }] })` to reference current products

### MCP Server Configuration

Added to each machine's `.claude/settings.json`:
```json
{
  "mcpServers": {
    "mlh-firestore": {
      "command": "node",
      "args": ["path/to/mlh-mcp-server/index.js"],
      "env": {
        "FIREBASE_PROJECT_ID": "my-living-hope",
        "GOOGLE_APPLICATION_CREDENTIALS": "path/to/service-key.json"
      }
    }
  }
}
```

### Implementation

The MCP server is a single `index.js` file (~150 lines) living in `portal.mylivinghope/mcp-server/`. Uses:
- `@modelcontextprotocol/sdk` — MCP protocol handling
- `firebase-admin` — Firestore access via service account

## CLI Fallback Scripts

Same functionality as the MCP server, invokable via Bash. For use when MCP isn't configured (e.g., founder's initial setup) or as a debugging tool.

```
portal.mylivinghope/scripts/
├── sync-context.js          # Pull/push MLH context files from Firebase Storage
├── query-firestore.js       # CLI query tool
└── .env                     # (gitignored) FIREBASE_PROJECT_ID, path to service key
```

**Usage:**
```bash
# Sync context
node scripts/sync-context.js pull
node scripts/sync-context.js push --user joel

# Query Firestore
node scripts/query-firestore.js products
node scripts/query-firestore.js products --status "In stock"
node scripts/query-firestore.js tasks --assignedTo Joel --status "!Complete"
```

## Authentication

- MCP server and CLI scripts use a Firebase service account key (JSON file stored locally, gitignored, never committed)
- Portal "Sync Context" button uses the logged-in user's Firebase Auth token to call the Cloud Function
- Service account needs read access to all Firestore collections and read/write access to Firebase Storage `shared/` path

## Security Considerations

- Service account key must be gitignored and stored securely on each machine
- The MCP server runs locally — no network exposure
- Firestore security rules should allow the service account read access but restrict write access to the portal's auth-gated operations
- The shared .md files in Firebase Storage contain business context but no credentials or PII beyond contact names
