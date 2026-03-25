# Inline CMS for Portfolio Website

## Overview

Add an inline visual editing system to the existing portfolio website so the owner (Hratch) can click on any content directly on the live site and edit it in place. The site will be hosted online on Railway with a custom domain and PostgreSQL for persistent content storage.

## Goals

- Edit all portfolio content inline without touching code
- Single-user system with simple auth
- Manual save for full control over when changes go live
- Host publicly with a custom domain
- Preserve the current site design exactly as-is

## Non-Goals

- Multi-user accounts or roles
- Drag-and-drop page builder / section reordering
- Rich text formatting (bold, italic, etc.)
- Blog or CMS for arbitrary new pages
- Visual/design changes to the existing site

---

## Architecture

### Current State

- React 18 + Vite frontend with wouter routing
- Express backend with in-memory storage
- All content hardcoded in `shared/portfolio.ts`
- shadcn/ui component library, Tailwind CSS, framer-motion
- Contact form API exists but messages stored in memory

### Target State

- Same frontend stack, extended with edit mode capabilities
- Express backend with PostgreSQL (via Drizzle ORM, already a dependency)
- Content served from database via API endpoints
- Session-based authentication for edit mode
- Deployed on Railway with managed PostgreSQL

---

## Database Schema

All content currently in `shared/portfolio.ts` moves to PostgreSQL. Drizzle ORM (already installed) manages the schema.

### Tables

**`personal_info`** (single row)
| Column | Type | Notes |
|--------|------|-------|
| id | varchar PK | Default: 'main' |
| name | text | |
| tagline | text | |
| intro | text | |
| email | text | |
| github | text | URL |
| linkedin | text | URL |
| resume_url | text | |

**`about_info`** (single row)
| Column | Type | Notes |
|--------|------|-------|
| id | varchar PK | Default: 'main' |
| bio | text | |
| current_focus | text | |
| education | jsonb | `{ school, degree, period, gpa, coursework[] }` |
| interests | jsonb | string array |

**`projects`**
| Column | Type | Notes |
|--------|------|-------|
| id | varchar PK | UUID |
| title | text | |
| description | text | |
| highlights | jsonb | string array |
| tech_stack | jsonb | string array |
| category | varchar | 'SWE' \| 'Data' \| 'ML' |
| featured | boolean | |
| github_url | text | nullable |
| live_url | text | nullable |
| sort_order | integer | |

**`experiences`**
| Column | Type | Notes |
|--------|------|-------|
| id | varchar PK | UUID |
| role | text | |
| organization | text | |
| location | text | |
| start_date | text | |
| end_date | text | |
| bullets | jsonb | string array |
| sort_order | integer | |

**`skills`**
| Column | Type | Notes |
|--------|------|-------|
| id | varchar PK | UUID |
| name | text | |
| category | varchar | 'Languages/Frameworks' \| 'Database Technologies' \| 'Cloud/Dev Tools' |
| sort_order | integer | |

**`random_facts`**
| Column | Type | Notes |
|--------|------|-------|
| id | varchar PK | UUID |
| emoji | text | Icon key (coffee, hiking, etc.) |
| title | text | |
| description | text | |
| sort_order | integer | |

**`nav_links`**
| Column | Type | Notes |
|--------|------|-------|
| id | varchar PK | UUID |
| label | text | |
| href | text | |
| icon | text | Icon key |
| sort_order | integer | |

**`admin_user`** (single row)
| Column | Type | Notes |
|--------|------|-------|
| id | varchar PK | Default: 'admin' |
| username | text | |
| password_hash | text | bcrypt |

### Seed Script

A seed script runs on first deploy (or when the database is empty). It reads the existing data from `shared/portfolio.ts` and inserts it into all tables. This ensures zero content loss during migration.

---

## API Endpoints

All endpoints under `/api/`.

### Public (no auth required)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/content/personal-info` | Get personal info |
| GET | `/api/content/about` | Get about info |
| GET | `/api/content/projects` | Get all projects (ordered by sort_order) |
| GET | `/api/content/experiences` | Get all experiences (ordered by sort_order) |
| GET | `/api/content/skills` | Get all skills (ordered by sort_order) |
| GET | `/api/content/random-facts` | Get all random facts (ordered by sort_order) |
| GET | `/api/content/nav-links` | Get all nav links (ordered by sort_order) |
| POST | `/api/contact` | Submit contact form (existing) |

### Auth

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Login with username/password, sets session cookie |
| POST | `/api/auth/logout` | Destroy session |
| GET | `/api/auth/status` | Check if current session is authenticated |

### Protected (auth required)

| Method | Path | Description |
|--------|------|-------------|
| PUT | `/api/content/personal-info` | Update personal info |
| PUT | `/api/content/about` | Update about info |
| POST | `/api/content/projects` | Create project |
| PUT | `/api/content/projects/:id` | Update project |
| DELETE | `/api/content/projects/:id` | Delete project |
| POST | `/api/content/experiences` | Create experience |
| PUT | `/api/content/experiences/:id` | Update experience |
| DELETE | `/api/content/experiences/:id` | Delete experience |
| POST | `/api/content/skills` | Create skill |
| PUT | `/api/content/skills/:id` | Update skill |
| DELETE | `/api/content/skills/:id` | Delete skill |
| POST | `/api/content/random-facts` | Create random fact |
| PUT | `/api/content/random-facts/:id` | Update random fact |
| DELETE | `/api/content/random-facts/:id` | Delete random fact |
| POST | `/api/content/nav-links` | Create nav link |
| PUT | `/api/content/nav-links/:id` | Update nav link |
| DELETE | `/api/content/nav-links/:id` | Delete nav link |
| PUT | `/api/content/batch` | Batch update — accepts a changeset of multiple operations |

### Batch Update Format

The Save button sends all pending changes as a single batch request:

```json
{
  "updates": [
    { "table": "personal_info", "id": "main", "data": { "name": "..." } },
    { "table": "projects", "id": "abc-123", "data": { "title": "..." } }
  ],
  "creates": [
    { "table": "projects", "data": { "title": "New Project", ... } }
  ],
  "deletes": [
    { "table": "skills", "id": "xyz-789" }
  ]
}
```

This runs in a database transaction — all changes succeed or none do.

---

## Authentication & Edit Mode

### Login Flow

1. Navigate to `/admin-login` (secret URL, not linked anywhere on the site)
2. Simple login form: username + password fields
3. POST to `/api/auth/login` — validates credentials against `admin_user` table
4. On success: session cookie set, redirect to `/` in edit mode (query param `?edit=1` or session flag)
5. On failure: error message, rate-limited (5 attempts per minute)

### Edit Mode Detection

- The React app checks `/api/auth/status` on mount
- If authenticated, a global `isEditMode` state is set via React Context
- Components conditionally render edit affordances (contentEditable, add/delete buttons, etc.)

### Session Management

- `express-session` with `connect-pg-simple` for PostgreSQL session store (already a dependency)
- Session expires after 24 hours of inactivity
- Logout via floating bar "Exit" button or `/admin-logout`

### Security

- bcrypt password hashing
- Rate limiting on login endpoint (5 attempts/minute)
- Session cookie with `httpOnly`, `secure` (in production), `sameSite: strict`
- All protected API routes check session before processing

---

## Inline Editing UX

### Edit Mode Indicators

- A floating bar at the bottom of the viewport: "Edit Mode" label (left), "Save (N changes)" button (center, disabled when no changes), "Exit" button (right)
- The bar is fixed position, subtle dark background with blur, doesn't interfere with content

### Text Editing

- In edit mode, all editable text elements get:
  - Dashed border on hover (subtle, 1px, muted color)
  - `contentEditable` on click
  - Light highlight background while actively editing
  - Click away (blur) to finish — change captured in local state
- Works for: name, tagline, intro, bio, project titles/descriptions, experience roles/bullets, skill names, fact titles/descriptions, etc.

### Structural Editing

**Adding items:**
- "Add Project" — dashed-border placeholder card at the end of the project grid with a + icon. Click to create a new blank card with placeholder text in each field.
- "Add Experience" — dashed-border block at the bottom of the experience timeline
- "Add Skill" — small "+ Add" button after each skill category's badges
- "Add Random Fact" — dashed-border placeholder card at the end of the facts grid
- "Add Bullet" — small "+ Add bullet" link at the end of each bullet list (experiences, project highlights)

**Removing items:**
- Each project card, experience entry, skill badge, random fact card gets a small trash/X icon in edit mode (top-right corner)
- Click trash → confirmation prompt ("Delete this project?") → marks for deletion
- Item visually fades/grays out but remains visible until Save (so you can undo by refreshing without saving)

**Category and type fields:**
- Project category (SWE/Data/ML) — click to show a dropdown
- Skill category — click to show a dropdown
- Featured toggle on projects — click to toggle
- Fact emoji/icon — click to show icon picker

### Save Flow

1. All edits tracked in a local React state "changeset" (using React Context or Zustand)
2. Floating bar shows "Save (N changes)" with the count of pending modifications
3. Click Save → POST to `/api/content/batch` with the full changeset
4. Loading state on the button while saving
5. Success → green toast "Changes saved!", changeset cleared, count resets
6. Failure → red toast with error, changes preserved for retry
7. If you navigate away with unsaved changes → browser `beforeunload` warning

---

## Frontend Data Flow

### Current → New

**Current:** Components import directly from `shared/portfolio.ts`
```
Component → import { projects } from "@shared/portfolio" → hardcoded data
```

**New:** Components fetch from API, with edit mode overlay
```
Component → useQuery("/api/content/projects") → database data
         → if editMode: contentEditable + change tracking
```

### Key Changes

- Create a `useContent(endpoint)` hook that wraps `useQuery` for fetching content
- Create an `EditModeContext` provider wrapping the app
- Create an `Editable` component that wraps any text element — in view mode it renders normally, in edit mode it adds contentEditable behavior and change tracking
- Create an `EditableList` component for arrays (projects, experiences, etc.) — adds "Add" and "Delete" affordances in edit mode
- Pages import these components instead of directly using `portfolio.ts` data

---

## Hosting & Deployment

### Platform: Railway

- Node.js service running the Express server
- Managed PostgreSQL add-on
- Auto-deploy from GitHub main branch
- Custom domain with automatic SSL

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (provided by Railway) |
| `SESSION_SECRET` | Random string for session encryption |
| `ADMIN_USERNAME` | Login username |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of login password |
| `NODE_ENV` | `production` |
| `PORT` | Set by Railway automatically |

### Domain Setup

1. Purchase domain (e.g., `hratchghanime.com`) from Namecheap or similar
2. In Railway dashboard, add custom domain
3. Update DNS: CNAME record pointing to Railway's provided domain
4. Railway provisions SSL automatically

### Cleanup Before Deploy

- Remove `.replit` file
- Remove Replit-specific Vite plugins (`@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner`, `@replit/vite-plugin-runtime-error-modal`)
- Remove corresponding devDependencies from `package.json`
- Update `vite.config.ts` to remove Replit plugin conditional
- Add `.superpowers/` to `.gitignore`

### Seed on First Deploy

- The seed script checks if the `personal_info` table is empty
- If empty, reads from `shared/portfolio.ts` and populates all tables
- `shared/portfolio.ts` remains in the codebase as a reference/fallback but is no longer the runtime data source

---

## File Structure (New/Modified)

```
server/
  index.ts              (modified - add session, pg connection)
  routes.ts             (modified - add content + auth routes)
  storage.ts            (modified - PostgreSQL implementation)
  auth.ts               (new - auth middleware, login/logout handlers)
  seed.ts               (new - database seed script)
shared/
  schema.ts             (modified - add all content table schemas)
  portfolio.ts          (kept as seed data source, no longer runtime)
client/src/
  lib/
    edit-context.tsx     (new - EditModeContext provider)
    use-content.ts       (new - useContent hook for API data)
  components/
    editable.tsx         (new - Editable text wrapper component)
    editable-list.tsx    (new - EditableList for arrays)
    edit-bar.tsx         (new - floating edit mode bar)
    icon-picker.tsx      (new - icon selector for facts)
  pages/
    admin-login.tsx      (new - login page)
    about.tsx            (modified - use API data + Editable components)
    experience.tsx       (modified - use API data + Editable components)
    random-facts.tsx     (modified - use API data + Editable components)
  App.tsx                (modified - add EditModeContext, auth check, login route)
drizzle.config.ts        (modified - point to DATABASE_URL)
```
