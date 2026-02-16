# NowBind API Testing Guide

## Setup

**Base URLs:**
- Local: `http://localhost:8080`
- Production: `https://nowbindb.niheshr.com` (or your backend URL)

**API Key:** Replace `YOUR_API_KEY` below with your actual key (starts with `nb_`).

You can pass the API key in two ways:
```bash
# Option 1: Authorization header (recommended)
-H "Authorization: Bearer nb_xxxxx"

# Option 2: Query parameter
?api_key=nb_xxxxx
```

---

## Agent API Endpoints

All endpoints under `/api/v1/agent/` require an API key.

### 1. List All Published Posts

```bash
curl -s http://localhost:8080/api/v1/agent/posts \
  -H "Authorization: Bearer YOUR_API_KEY" | jq
```

Returns an array of posts with: `slug`, `title`, `subtitle`, `author`, `excerpt`, `reading_time`, `published_at`, `tags`, `keywords`, `url`, `content_url`.

### 2. Get a Single Post (Full Markdown)

```bash
curl -s http://localhost:8080/api/v1/agent/posts/YOUR_POST_SLUG \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Returns the full post content as **markdown** (not JSON). Includes title, subtitle, author, reading time, keywords, and the full content body.

### 3. Search Posts

```bash
curl -s "http://localhost:8080/api/v1/agent/search?q=YOUR_QUERY" \
  -H "Authorization: Bearer YOUR_API_KEY" | jq
```

Returns: `{ "query": "...", "total": N, "results": [{ "slug", "title", "excerpt", "url" }] }`

### 4. List Authors

```bash
curl -s http://localhost:8080/api/v1/agent/authors \
  -H "Authorization: Bearer YOUR_API_KEY" | jq
```

Returns an array of authors with: `username`, `display_name`, `bio`, `url`.

### 5. List Tags

```bash
curl -s http://localhost:8080/api/v1/agent/tags \
  -H "Authorization: Bearer YOUR_API_KEY" | jq
```

Returns all tags with: `id`, `name`, `slug`, `post_count`.

---

## MCP Server

The MCP (Model Context Protocol) server is available at `/mcp/` and uses **Streamable HTTP** transport with JSON-RPC 2.0. It also requires an API key.

### Test MCP with curl

#### Initialize

```bash
curl -s -X POST http://localhost:8080/mcp/ \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {}
  }' | jq
```

#### List Available Tools

```bash
curl -s -X POST http://localhost:8080/mcp/ \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/list",
    "params": {}
  }' | jq
```

Available tools:
| Tool | Description |
|------|-------------|
| `search_posts` | Search posts by keyword |
| `get_post` | Get full post content by slug |
| `list_posts` | List recent posts, optionally filter by tag |
| `get_author` | Get author info by username |

#### Call a Tool — Search Posts

```bash
curl -s -X POST http://localhost:8080/mcp/ \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "search_posts",
      "arguments": { "query": "javascript" }
    }
  }' | jq
```

#### Call a Tool — Get Post

```bash
curl -s -X POST http://localhost:8080/mcp/ \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 4,
    "method": "tools/call",
    "params": {
      "name": "get_post",
      "arguments": { "slug": "your-post-slug" }
    }
  }' | jq
```

#### Call a Tool — List Posts (with optional tag filter)

```bash
curl -s -X POST http://localhost:8080/mcp/ \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 5,
    "method": "tools/call",
    "params": {
      "name": "list_posts",
      "arguments": { "limit": 5 }
    }
  }' | jq
```

With tag filter:

```bash
curl -s -X POST http://localhost:8080/mcp/ \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 5,
    "method": "tools/call",
    "params": {
      "name": "list_posts",
      "arguments": { "tag": "javascript", "limit": 10 }
    }
  }' | jq
```

#### Call a Tool — Get Author

```bash
curl -s -X POST http://localhost:8080/mcp/ \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 6,
    "method": "tools/call",
    "params": {
      "name": "get_author",
      "arguments": { "username": "nihesh" }
    }
  }' | jq
```

#### List Resources

```bash
curl -s -X POST http://localhost:8080/mcp/ \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 7,
    "method": "resources/list",
    "params": {}
  }' | jq
```

Available resources:
| URI | Description |
|-----|-------------|
| `nowbind://posts` | All published posts (JSON) |
| `nowbind://posts/{slug}` | Single post content (Markdown) |
| `nowbind://authors` | All authors (JSON) |
| `nowbind://tags` | All tags (JSON) |
| `nowbind://feed` | Recent posts feed (text) |

#### Read a Resource

```bash
curl -s -X POST http://localhost:8080/mcp/ \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 8,
    "method": "resources/read",
    "params": { "uri": "nowbind://posts" }
  }' | jq
```

```bash
curl -s -X POST http://localhost:8080/mcp/ \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 9,
    "method": "resources/read",
    "params": { "uri": "nowbind://feed" }
  }' | jq
```

---

## Connecting NowBind MCP to Claude Code

### Configuration

Add the following to your Claude Code MCP settings file.

**Location:** `~/.claude/claude_desktop_config.json` (or the settings file for your Claude Code version)

```json
{
  "mcpServers": {
    "nowbind": {
      "type": "streamablehttp",
      "url": "http://localhost:8080/mcp/",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

For **production**:

```json
{
  "mcpServers": {
    "nowbind": {
      "type": "streamablehttp",
      "url": "https://nowbindb.niheshr.com/mcp/",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

### Steps

1. **Get an API key** — Create one from the NowBind frontend (Settings > API Keys) or via:
   ```bash
   # Login first, then:
   curl -s -X POST http://localhost:8080/api/v1/api-keys \
     -H "Cookie: access_token=YOUR_ACCESS_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"scopes": ["read"]}' | jq
   ```
   Save the `key` value (shown only once, starts with `nb_`).

2. **Add MCP config** — Edit `~/.claude/claude_desktop_config.json` with the config above.

3. **Restart Claude Code** — The MCP server will be detected on next launch.

4. **Verify** — In Claude Code, you should see NowBind tools available:
   - `search_posts` — Search blog posts
   - `get_post` — Read full post content
   - `list_posts` — Browse recent posts
   - `get_author` — Look up author profiles

5. **Test it** — Ask Claude something like:
   - "What posts are on NowBind?"
   - "Search NowBind for posts about JavaScript"
   - "Read the post about [topic]"

### Troubleshooting

- **401 Unauthorized** — Check your API key is correct and not expired
- **Connection refused** — Make sure the Go backend is running (`make dev` or `go run cmd/server/main.go`)
- **No tools showing** — Restart Claude Code after updating the config
- **Check MCP works** — Run the `initialize` curl command above. You should get back server info with `protocolVersion: "2024-11-05"`.

---

## Quick Test Script

Run all endpoints in one go:

```bash
#!/bin/bash
API_KEY="YOUR_API_KEY"
BASE="http://localhost:8080"

echo "=== List Posts ==="
curl -s "$BASE/api/v1/agent/posts" -H "Authorization: Bearer $API_KEY" | jq '.[0]'

echo -e "\n=== Search ==="
curl -s "$BASE/api/v1/agent/search?q=test" -H "Authorization: Bearer $API_KEY" | jq

echo -e "\n=== Authors ==="
curl -s "$BASE/api/v1/agent/authors" -H "Authorization: Bearer $API_KEY" | jq

echo -e "\n=== Tags ==="
curl -s "$BASE/api/v1/agent/tags" -H "Authorization: Bearer $API_KEY" | jq

echo -e "\n=== MCP Initialize ==="
curl -s -X POST "$BASE/mcp/" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' | jq

echo -e "\n=== MCP Tools List ==="
curl -s -X POST "$BASE/mcp/" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' | jq

echo -e "\n=== MCP List Posts Tool ==="
curl -s -X POST "$BASE/mcp/" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"list_posts","arguments":{"limit":3}}}' | jq
```
