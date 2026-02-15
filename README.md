<p align="center">
  <img src="frontend/public/logos/n.-dark.svg" alt="NowBind" height="48" />
</p>

<h1 align="center">NowBind</h1>

<p align="center">
  <strong>Write for humans. Feed the machines.</strong>
</p>

<p align="center">
  The open-source blogging platform where every post is simultaneously a beautiful article and a structured AI-agent feed.
</p>

<p align="center">
  <a href="#features">Features</a> &middot;
  <a href="#tech-stack">Tech Stack</a> &middot;
  <a href="#getting-started">Getting Started</a> &middot;
  <a href="#deployment">Deployment</a> &middot;
  <a href="#api-reference">API Reference</a> &middot;
  <a href="#mcp-server">MCP Server</a> &middot;
  <a href="#license">License</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Go-1.25-00ADD8?logo=go&logoColor=white" alt="Go" />
  <img src="https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License" />
</p>

---

## Why NowBind?

Most blogging platforms treat AI as an afterthought. NowBind is built from the ground up to serve both human readers and AI agents as first-class citizens.

Every published post automatically generates:
- A beautifully rendered article for human readers
- Structured markdown with YAML frontmatter for LLMs
- AI summaries and keywords for agent consumption
- An MCP-compatible resource for Claude and other AI assistants
- An `llms.txt` index following the [llmstxt.org](https://llmstxt.org) specification

Your blog becomes a knowledge base that both people and AI can read, search, and reference.

---

## Features

### Writing & Publishing
- Rich markdown editor with live preview and GitHub Flavored Markdown
- AI-native content generation -- every post gets AI summaries, keywords, and structured markdown
- Tag system with post counts and tag-based browsing
- Draft/publish workflow with reading time estimation
- Full-text search powered by PostgreSQL tsvector with fuzzy matching

### Authentication
- **OAuth** -- Google and GitHub sign-in
- **Magic Link** -- passwordless email authentication via Gmail OAuth2
- **JWT + Refresh Tokens** with automatic rotation and concurrent refresh protection
- Cookie-based sessions with HttpOnly secure cookies

### Social
- **Follow system** with personalized feed from followed authors
- **Likes & Bookmarks** with optimistic UI updates
- **Threaded comments** with nested replies, edit, and delete
- **In-app notifications** for follows, likes, and comments with unread badge
- **Web push notifications** via VAPID/Web Push for real-time browser alerts
- **Share buttons** -- copy link, share to X, LinkedIn

### Analytics
- View tracking with unique visitor detection
- AI vs human view classification (by User-Agent)
- Stats dashboard -- overview cards, timeline charts, top posts, referrer breakdown

### AI & Agent Integration
- **Agent API** -- RESTful endpoints for AI agents with API key auth
- **MCP Server** -- Model Context Protocol (JSON-RPC 2.0) for Claude and other assistants
- **llms.txt** -- site-wide AI-readable index following the llmstxt.org spec
- **Structured Markdown** -- YAML frontmatter + content for machine consumption

### Progressive Web App
- Installable on mobile and desktop
- Offline fallback page with service worker caching (Serwist)
- Push notification support

### More
- RSS, Atom, and JSON Feed support
- Dark mode with system-aware toggle
- Responsive mobile-first design
- SEO optimized -- Open Graph, Twitter Cards, JSON-LD, canonical URLs, dynamic sitemap
- Gravatar avatars with identicon fallback
- Trending posts and tag-based related post recommendations

---

## Tech Stack

### Backend
| | Technology |
|---|---|
| Language | **Go 1.25** |
| Router | chi v5 |
| Database | PostgreSQL 16 with pgx/v5 |
| Auth | JWT (golang-jwt/v5), OAuth2, magic links |
| Push | webpush-go (VAPID) |
| Email | Gmail OAuth2 SMTP |
| Search | PostgreSQL tsvector + trigram |

### Frontend
| | Technology |
|---|---|
| Framework | **Next.js 16** (App Router) |
| UI | React 19 with React Compiler |
| Styling | Tailwind CSS v4, shadcn/ui (new-york) |
| Icons | Lucide |
| PWA | Serwist |
| Markdown | react-markdown + remark-gfm + react-syntax-highlighter |
| Fonts | Space Grotesk, JetBrains Mono |

---

## Project Structure

```
nowbind/
├── backend/
│   ├── cmd/server/              # Entry point with -migrate flag
│   ├── internal/
│   │   ├── config/              # Env config loader
│   │   ├── database/            # PostgreSQL pool + migrations
│   │   │   └── migrations/      # 6 SQL migration files
│   │   ├── handler/             # HTTP handlers
│   │   ├── middleware/          # Auth, API key, CORS, logging
│   │   ├── mcp/                 # MCP JSON-RPC 2.0 server
│   │   ├── model/               # Domain models
│   │   ├── repository/          # Data access layer
│   │   ├── router/              # Route definitions
│   │   ├── server/              # HTTP server setup
│   │   └── service/             # Business logic
│   └── pkg/                     # JWT, slug, gravatar utils
│
├── frontend/
│   ├── app/                     # Next.js App Router
│   │   ├── (main)/              # Public pages (explore, post, author, docs...)
│   │   ├── (auth)/              # Login, OAuth callback
│   │   ├── (dashboard)/         # Protected pages (editor, stats, settings...)
│   │   ├── feed/                # RSS/Atom/JSON route handlers
│   │   └── sw.ts                # Service worker (push + caching)
│   ├── components/
│   │   ├── layout/              # Navbar, Footer
│   │   ├── post/                # PostCard, PostContent, RelatedPosts
│   │   ├── social/              # Follow, Like, Bookmark, Comments, Notifications
│   │   ├── pwa/                 # Install prompt, offline status
│   │   └── ui/                  # shadcn/ui components
│   └── lib/
│       ├── api.ts               # API client with token refresh mutex
│       ├── auth-context.tsx     # Auth state provider
│       ├── hooks/               # useAuth, useSocial, useNotifications
│       └── types.ts             # TypeScript interfaces
│
├── docker-compose.yml           # PostgreSQL 16
├── Makefile                     # Dev commands
└── generate-vapid-keys.sh       # VAPID key generator
```

---

## Getting Started

### Prerequisites

- **Go** 1.25+
- **Node.js** 20+
- **PostgreSQL** 15+ (or Docker)

### 1. Clone the Repository

```bash
git clone https://github.com/nowbind/nowbind.git
cd nowbind
```

### 2. Start the Database

Using Docker (recommended):

```bash
docker compose up -d postgres
```

Or use an existing PostgreSQL instance -- just have the connection URL ready.

### 3. Backend Setup

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your configuration (see [Environment Variables](#environment-variables)), then:

```bash
go mod download
go run cmd/server/main.go -migrate   # Run database migrations
go run cmd/server/main.go            # Start server on :8080
```

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
BACKEND_URL=http://localhost:8080
```

Then start the dev server:

```bash
npm run dev   # Starts on :3000
```

### Quick Start (All at Once)

From the project root:

```bash
make dev
```

This starts PostgreSQL, runs migrations, and launches both backend and frontend.

---

## Environment Variables

### Backend (`.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | -- | PostgreSQL connection string |
| `JWT_SECRET` | Yes | -- | Min 32 characters for HMAC signing |
| `FRONTEND_URL` | Yes | -- | Frontend origin for CORS and redirects |
| `PORT` | No | `8080` | HTTP server port |
| `ENVIRONMENT` | No | `development` | `development` or `production` |
| `GOOGLE_CLIENT_ID` | No | -- | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | -- | Google OAuth client secret |
| `GITHUB_CLIENT_ID` | No | -- | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | No | -- | GitHub OAuth client secret |
| `EMAIL_SENDER` | No | -- | Gmail address for magic link emails |
| `GMAIL_CLIENT_ID` | No | -- | Gmail OAuth2 client ID (defaults to Google) |
| `GMAIL_CLIENT_SECRET` | No | -- | Gmail OAuth2 client secret (defaults to Google) |
| `GMAIL_REFRESH_TOKEN` | No | -- | Gmail OAuth2 refresh token |
| `VAPID_PUBLIC_KEY` | No | -- | Web push VAPID public key |
| `VAPID_PRIVATE_KEY` | No | -- | Web push VAPID private key |

### Frontend (`.env.local`)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API URL (e.g. `https://api.example.com/api/v1`) |
| `NEXT_PUBLIC_SITE_URL` | Yes | Frontend URL (e.g. `https://example.com`) |
| `BACKEND_URL` | Yes | Backend root URL for SSR proxying |

### Minimal Setup

To get started quickly with just local development, you only need:

```bash
# backend/.env
DATABASE_URL=postgres://nowbind:nowbind_dev@localhost:5432/nowbind?sslmode=disable
JWT_SECRET=change-this-to-something-at-least-32-characters
FRONTEND_URL=http://localhost:3000
```

OAuth, email, and push notifications are all optional -- the platform works without them using basic features.

---

## Generating VAPID Keys

VAPID keys enable browser push notifications. Generate them with the included script:

```bash
./generate-vapid-keys.sh
```

Or manually:

```bash
npx web-push generate-vapid-keys
```

Add the output to your backend `.env`:

```bash
VAPID_PUBLIC_KEY=BEl62iUYgU...
VAPID_PRIVATE_KEY=...
```

The frontend automatically fetches the public key from `GET /api/v1/notifications/vapid-key` -- no frontend configuration needed.

---

## Database

NowBind uses PostgreSQL with automatic migrations. Migrations run on every server startup and are idempotent.

To run migrations manually:

```bash
cd backend && go run cmd/server/main.go -migrate
```

### Schema Overview

| Migration | Tables |
|---|---|
| `001_initial.sql` | `users`, `posts`, `tags`, `post_tags` |
| `002_sessions.sql` | `sessions`, `magic_links` |
| `003_api_keys.sql` | `api_keys` |
| `004_analytics.sql` | `post_views`, `post_stats` |
| `005_search.sql` | `search_vector` (tsvector), GIN + trigram indexes |
| `006_social.sql` | `follows`, `post_likes`, `comments`, `bookmarks`, `notifications`, `push_subscriptions`, `notification_preferences` |

### Hosted PostgreSQL

NowBind auto-detects [Neon](https://neon.tech) databases from the hostname and configures connection pooling accordingly. Set `DB_MODE=neon` explicitly if needed.

---

## Deployment

### Production Build

```bash
# Backend
cd backend && go build -o bin/server ./cmd/server

# Frontend
cd frontend && npm run build
```

### Running in Production

```bash
# Backend
ENVIRONMENT=production ./bin/server

# Frontend
npm start
```

### Production Checklist

- [ ] Set `ENVIRONMENT=production` in backend
- [ ] Use a strong, unique `JWT_SECRET` (32+ characters)
- [ ] Set `FRONTEND_URL` to your production domain
- [ ] Update `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SITE_URL` in frontend
- [ ] Use a managed PostgreSQL instance (e.g. Neon, Supabase, RDS)
- [ ] Set up OAuth credentials for Google and/or GitHub with production redirect URIs
- [ ] Generate and configure VAPID keys for push notifications
- [ ] Configure Gmail OAuth2 for magic link emails
- [ ] Serve behind a reverse proxy (nginx, Caddy) with HTTPS
- [ ] Set appropriate CORS origin in `FRONTEND_URL`

### Example nginx Config

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # MCP Server
    location /mcp {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # llms.txt
    location /llms.txt {
        proxy_pass http://localhost:8080;
    }
    location /llms-full.txt {
        proxy_pass http://localhost:8080;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:8080;
    }
}
```

---

## API Reference

Full interactive documentation is available at `/docs` on any running NowBind instance.

### Authentication

All authenticated endpoints use JWT tokens (sent via HttpOnly cookies) or API keys (via `Authorization: Bearer nb_...` header).

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/magic-link` | -- | Send magic link email |
| GET | `/api/v1/auth/magic-link/verify` | -- | Verify magic link token |
| POST | `/api/v1/auth/refresh` | Cookie | Refresh access token |
| POST | `/api/v1/auth/logout` | Cookie | Invalidate session |
| GET | `/api/v1/auth/me` | JWT | Get current user |
| GET | `/api/v1/auth/oauth/google` | -- | Start Google OAuth |
| GET | `/api/v1/auth/oauth/github` | -- | Start GitHub OAuth |

### Posts

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/posts` | Optional | List published posts (paginated) |
| GET | `/api/v1/posts/trending` | Optional | Trending posts by views/likes |
| GET | `/api/v1/posts/{slug}` | Optional | Get post by slug |
| GET | `/api/v1/posts/{slug}/related` | Optional | Related posts by tag overlap |
| POST | `/api/v1/posts/{slug}/view` | -- | Track a view |
| POST | `/api/v1/posts` | JWT | Create new post |
| PUT | `/api/v1/posts/{id}` | JWT | Update post |
| DELETE | `/api/v1/posts/{id}` | JWT | Delete post |
| POST | `/api/v1/posts/{id}/publish` | JWT | Publish draft |
| POST | `/api/v1/posts/{id}/unpublish` | JWT | Unpublish post |

### Social

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/posts/{id}/like` | JWT | Like a post |
| DELETE | `/api/v1/posts/{id}/like` | JWT | Unlike a post |
| POST | `/api/v1/posts/{id}/bookmark` | JWT | Bookmark a post |
| DELETE | `/api/v1/posts/{id}/bookmark` | JWT | Remove bookmark |
| GET | `/api/v1/posts/{id}/comments` | -- | List comments |
| POST | `/api/v1/posts/{id}/comments` | JWT | Add a comment |
| PUT | `/api/v1/comments/{id}` | JWT | Edit comment |
| DELETE | `/api/v1/comments/{id}` | JWT | Delete comment |
| POST | `/api/v1/users/{username}/follow` | JWT | Follow a user |
| DELETE | `/api/v1/users/{username}/follow` | JWT | Unfollow a user |
| GET | `/api/v1/users/{username}/followers` | Optional | List followers |
| GET | `/api/v1/users/{username}/following` | Optional | List following |
| GET | `/api/v1/feed` | JWT | Personalized feed |

### Users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/users/{username}` | Optional | Get user profile |
| GET | `/api/v1/users/{username}/posts` | Optional | User's published posts |
| PUT | `/api/v1/users/me` | JWT | Update your profile |
| GET | `/api/v1/users/me/posts` | JWT | Your posts (all statuses) |
| GET | `/api/v1/users/me/liked` | JWT | Your liked posts |
| GET | `/api/v1/users/me/bookmarks` | JWT | Your bookmarks |

### Notifications

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/notifications` | JWT | List notifications (paginated) |
| GET | `/api/v1/notifications/unread-count` | JWT | Unread notification count |
| POST | `/api/v1/notifications/{id}/read` | JWT | Mark as read |
| POST | `/api/v1/notifications/read-all` | JWT | Mark all as read |
| GET | `/api/v1/notifications/vapid-key` | -- | Get VAPID public key |
| POST | `/api/v1/notifications/subscribe` | JWT | Subscribe to push |
| POST | `/api/v1/notifications/unsubscribe` | JWT | Unsubscribe from push |
| GET | `/api/v1/notifications/preferences` | JWT | Get notification prefs |
| PUT | `/api/v1/notifications/preferences` | JWT | Update notification prefs |

### Analytics

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/stats/overview` | JWT | Summary stats |
| GET | `/api/v1/stats/timeline?days=30` | JWT | Views by date |
| GET | `/api/v1/stats/top-posts?days=30` | JWT | Top posts by views |
| GET | `/api/v1/stats/referrers?days=30` | JWT | Referrer breakdown |

### Tags & Search

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/tags` | -- | List all tags with counts |
| GET | `/api/v1/tags/{slug}/posts` | -- | Posts for a tag |
| GET | `/api/v1/search?q={query}` | -- | Full-text search |
| GET | `/api/v1/search/suggest?q={query}` | -- | Search suggestions |

### Feeds

| Method | Endpoint | Format |
|---|---|---|
| GET | `/api/v1/feeds/rss` | RSS 2.0 |
| GET | `/api/v1/feeds/atom` | Atom 1.0 |
| GET | `/api/v1/feeds/json` | JSON Feed 1.1 |

### API Keys

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/api-keys` | JWT | Create new API key |
| GET | `/api/v1/api-keys` | JWT | List your API keys |
| DELETE | `/api/v1/api-keys/{id}` | JWT | Revoke an API key |

---

## Agent API

The Agent API provides AI-optimized endpoints that return structured data for LLM consumption. All endpoints require API key authentication.

```bash
curl -H "Authorization: Bearer nb_your_api_key" \
  https://yourdomain.com/api/v1/agent/posts
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/agent/posts` | List posts with AI metadata |
| GET | `/api/v1/agent/posts/{slug}` | Full post as structured markdown |
| GET | `/api/v1/agent/search?q={query}` | Full-text search |
| GET | `/api/v1/agent/authors` | List all authors |
| GET | `/api/v1/agent/tags` | List all tags |

Response includes `ai_summary`, `ai_keywords`, `structured_md`, and `reading_time` fields alongside standard post data.

---

## MCP Server

NowBind exposes an [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server for AI assistants like Claude to interact with your content directly.

### Configuration

Add to your `claude_desktop_config.json` or `.mcp.json`:

```json
{
  "mcpServers": {
    "nowbind": {
      "url": "https://yourdomain.com/mcp",
      "headers": {
        "Authorization": "Bearer nb_your_api_key"
      }
    }
  }
}
```

### Resources

| URI | Description |
|---|---|
| `nowbind://posts` | All published posts (JSON) |
| `nowbind://posts/{slug}` | Single post as markdown |
| `nowbind://authors` | List of authors (JSON) |
| `nowbind://tags` | All tags (JSON) |
| `nowbind://feed` | Recent posts feed (text) |

### Tools

| Tool | Description |
|---|---|
| `search_posts` | Full-text search across all content |
| `get_post` | Retrieve a specific post by slug |
| `list_posts` | Paginated post listing with optional tag filter |
| `get_author` | Get author profile and info |

---

## llms.txt

NowBind follows the [llmstxt.org](https://llmstxt.org) specification. Two endpoints provide AI-readable site indexes:

| Endpoint | Description |
|---|---|
| `GET /llms.txt` | Lightweight index with post titles, slugs, and metadata |
| `GET /llms-full.txt` | Full content dump of all published posts |

These are served as plain text and are automatically discoverable by AI agents and crawlers.

---

## Development

### Makefile Commands

```bash
make dev              # Start everything (db + backend + frontend)
make dev-backend      # Go backend with hot reload
make dev-frontend     # Next.js dev server
make db               # Start PostgreSQL via Docker
make db-down          # Stop PostgreSQL
make migrate          # Run database migrations
make build-backend    # Build Go binary
make build-frontend   # Build Next.js for production
make lint             # Lint frontend code
make clean            # Clean build artifacts
```

### Adding UI Components

NowBind uses [shadcn/ui](https://ui.shadcn.com) (new-york style). Add components with:

```bash
cd frontend && npx shadcn@latest add <component-name>
```

---

## License

MIT License. See [LICENSE](LICENSE) for details.
