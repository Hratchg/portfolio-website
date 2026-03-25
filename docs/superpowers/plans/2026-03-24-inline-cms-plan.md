# Inline CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add inline visual editing, PostgreSQL content storage, session auth, and Railway-ready deployment to the existing portfolio website.

**Architecture:** Migrate hardcoded portfolio data from `shared/portfolio.ts` to PostgreSQL via Drizzle ORM. Add Express API endpoints for reading/writing content. Build React edit mode with contentEditable text, inline add/delete for list items, and a batch save flow. Protect editing behind session-based auth on a secret login URL.

**Tech Stack:** React 18, Vite, Express, PostgreSQL, Drizzle ORM, bcryptjs, express-rate-limit, express-session, connect-pg-simple, shadcn/ui, Tailwind CSS

**Spec:** `docs/superpowers/specs/2026-03-24-inline-cms-design.md`

---

## Task 1: Cleanup — Remove Replit and unused dependencies

**Files:**
- Delete: `.replit`
- Modify: `package.json`
- Modify: `vite.config.ts`
- Modify: `script/build.ts`
- Modify: `.gitignore`

- [ ] **Step 1: Delete `.replit` file**

```bash
rm .replit
```

- [ ] **Step 2: Remove Replit devDependencies and unused packages from `package.json`**

Remove these from `devDependencies`:
```
@replit/vite-plugin-cartographer
@replit/vite-plugin-dev-banner
@replit/vite-plugin-runtime-error-modal
```

Remove these from `dependencies`:
```
passport
passport-local
memorystore
ws
```

Remove these from `devDependencies`:
```
@types/passport
@types/passport-local
@types/ws
```

Add these to `dependencies`:
```
bcryptjs: ^2.4.3
express-rate-limit: ^7.5.0
```

Add these to `devDependencies`:
```
@types/bcryptjs: ^2.4.6
```

- [ ] **Step 3: Clean up `vite.config.ts` — remove Replit plugin imports and conditional**

Replace the entire file with:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
```

- [ ] **Step 4: Clean up `script/build.ts` — remove unused packages from allowlist**

In the `allowlist` array, remove: `"memorystore"`, `"passport"`, `"passport-local"`, `"ws"`.

Add `"bcryptjs"` to the allowlist.

- [ ] **Step 5: Add `.superpowers/` to `.gitignore`**

Append to `.gitignore`:
```
.superpowers/
```

- [ ] **Step 6: Run `npm install` to update lockfile**

```bash
npm install
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: remove Replit configs and unused dependencies, add bcryptjs and express-rate-limit"
```

---

## Task 2: Database schema — Define all content tables with Drizzle

**Files:**
- Modify: `shared/schema.ts`

- [ ] **Step 1: Replace `shared/schema.ts` with the full content schema**

Replace the entire file. Remove the old `users` table and `insertUserSchema`. Define all new tables:

```typescript
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

// --- Content Tables ---

export const personalInfo = pgTable("personal_info", {
  id: varchar("id").primaryKey().default("main"),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  intro: text("intro").notNull(),
  email: text("email").notNull(),
  github: text("github").notNull(),
  linkedin: text("linkedin").notNull(),
  resumeUrl: text("resume_url").notNull(),
});

export const aboutInfo = pgTable("about_info", {
  id: varchar("id").primaryKey().default("main"),
  bio: text("bio").notNull(),
  currentFocus: text("current_focus").notNull(),
  education: jsonb("education").notNull(),
  interests: jsonb("interests").notNull(),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  highlights: jsonb("highlights").notNull(),
  techStack: jsonb("tech_stack").notNull(),
  category: varchar("category").notNull(),
  featured: boolean("featured").notNull().default(false),
  githubUrl: text("github_url"),
  liveUrl: text("live_url"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const experiences = pgTable("experiences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  role: text("role").notNull(),
  organization: text("organization").notNull(),
  location: text("location").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  bullets: jsonb("bullets").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const skills = pgTable("skills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: varchar("category").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const randomFacts = pgTable("random_facts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  emoji: text("emoji").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const navLinks = pgTable("nav_links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  label: text("label").notNull(),
  href: text("href").notNull(),
  icon: text("icon").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const adminUser = pgTable("admin_user", {
  id: varchar("id").primaryKey().default("admin"),
  username: text("username").notNull(),
  passwordHash: text("password_hash").notNull(),
});

// --- Zod Schemas ---

export const contactMessageSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactMessage = z.infer<typeof contactMessageSchema>;
```

- [ ] **Step 2: Commit**

```bash
git add shared/schema.ts
git commit -m "feat: define all content database tables with Drizzle ORM"
```

---

## Task 3: Storage layer — PostgreSQL implementation

**Files:**
- Modify: `server/storage.ts`

- [ ] **Step 1: Replace `server/storage.ts` with PostgreSQL-backed implementation**

Replace the entire file. Remove the old `MemStorage` class, `IStorage` interface, and all user-related methods. Implement direct Drizzle queries:

```typescript
import { eq, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import {
  personalInfo,
  aboutInfo,
  projects,
  experiences,
  skills,
  randomFacts,
  navLinks,
  contactMessages,
  adminUser,
  type ContactMessage,
} from "@shared/schema";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);

// --- Read operations (public) ---

export async function getPersonalInfo() {
  const rows = await db.select().from(personalInfo).where(eq(personalInfo.id, "main"));
  return rows[0] ?? null;
}

export async function getAboutInfo() {
  const rows = await db.select().from(aboutInfo).where(eq(aboutInfo.id, "main"));
  return rows[0] ?? null;
}

export async function getProjects() {
  return db.select().from(projects).orderBy(asc(projects.sortOrder));
}

export async function getExperiences() {
  return db.select().from(experiences).orderBy(asc(experiences.sortOrder));
}

export async function getSkills() {
  return db.select().from(skills).orderBy(asc(skills.sortOrder));
}

export async function getRandomFacts() {
  return db.select().from(randomFacts).orderBy(asc(randomFacts.sortOrder));
}

export async function getNavLinks() {
  return db.select().from(navLinks).orderBy(asc(navLinks.sortOrder));
}

// --- Write operations (protected) ---

export async function updatePersonalInfo(data: Partial<typeof personalInfo.$inferInsert>) {
  await db.update(personalInfo).set(data).where(eq(personalInfo.id, "main"));
}

export async function updateAboutInfo(data: Partial<typeof aboutInfo.$inferInsert>) {
  await db.update(aboutInfo).set(data).where(eq(aboutInfo.id, "main"));
}

export async function createProject(data: typeof projects.$inferInsert) {
  const rows = await db.insert(projects).values(data).returning();
  return rows[0];
}

export async function updateProject(id: string, data: Partial<typeof projects.$inferInsert>) {
  await db.update(projects).set(data).where(eq(projects.id, id));
}

export async function deleteProject(id: string) {
  await db.delete(projects).where(eq(projects.id, id));
}

export async function createExperience(data: typeof experiences.$inferInsert) {
  const rows = await db.insert(experiences).values(data).returning();
  return rows[0];
}

export async function updateExperience(id: string, data: Partial<typeof experiences.$inferInsert>) {
  await db.update(experiences).set(data).where(eq(experiences.id, id));
}

export async function deleteExperience(id: string) {
  await db.delete(experiences).where(eq(experiences.id, id));
}

export async function createSkill(data: typeof skills.$inferInsert) {
  const rows = await db.insert(skills).values(data).returning();
  return rows[0];
}

export async function updateSkill(id: string, data: Partial<typeof skills.$inferInsert>) {
  await db.update(skills).set(data).where(eq(skills.id, id));
}

export async function deleteSkill(id: string) {
  await db.delete(skills).where(eq(skills.id, id));
}

export async function createRandomFact(data: typeof randomFacts.$inferInsert) {
  const rows = await db.insert(randomFacts).values(data).returning();
  return rows[0];
}

export async function updateRandomFact(id: string, data: Partial<typeof randomFacts.$inferInsert>) {
  await db.update(randomFacts).set(data).where(eq(randomFacts.id, id));
}

export async function deleteRandomFact(id: string) {
  await db.delete(randomFacts).where(eq(randomFacts.id, id));
}

export async function createNavLink(data: typeof navLinks.$inferInsert) {
  const rows = await db.insert(navLinks).values(data).returning();
  return rows[0];
}

export async function updateNavLink(id: string, data: Partial<typeof navLinks.$inferInsert>) {
  await db.update(navLinks).set(data).where(eq(navLinks.id, id));
}

export async function deleteNavLink(id: string) {
  await db.delete(navLinks).where(eq(navLinks.id, id));
}

// --- Contact messages ---

export async function createContactMessage(data: ContactMessage) {
  const rows = await db.insert(contactMessages).values(data).returning();
  return rows[0];
}

// --- Admin ---

export async function getAdminUser() {
  const rows = await db.select().from(adminUser).where(eq(adminUser.id, "admin"));
  return rows[0] ?? null;
}

// --- Batch update (transactional) ---

const tableMap = {
  personal_info: { table: personalInfo, idCol: personalInfo.id },
  about_info: { table: aboutInfo, idCol: aboutInfo.id },
  projects: { table: projects, idCol: projects.id },
  experiences: { table: experiences, idCol: experiences.id },
  skills: { table: skills, idCol: skills.id },
  random_facts: { table: randomFacts, idCol: randomFacts.id },
  nav_links: { table: navLinks, idCol: navLinks.id },
} as const;

type TableName = keyof typeof tableMap;

interface BatchPayload {
  updates?: Array<{ table: TableName; id: string; data: Record<string, unknown> }>;
  creates?: Array<{ table: TableName; data: Record<string, unknown> }>;
  deletes?: Array<{ table: TableName; id: string }>;
}

export async function executeBatch(payload: BatchPayload) {
  await db.transaction(async (tx) => {
    for (const op of payload.updates ?? []) {
      const entry = tableMap[op.table];
      await tx.update(entry.table).set(op.data as any).where(eq(entry.idCol, op.id));
    }
    for (const op of payload.creates ?? []) {
      const entry = tableMap[op.table];
      await tx.insert(entry.table).values(op.data as any);
    }
    for (const op of payload.deletes ?? []) {
      const entry = tableMap[op.table];
      await tx.delete(entry.table).where(eq(entry.idCol, op.id));
    }
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add server/storage.ts
git commit -m "feat: replace in-memory storage with PostgreSQL-backed implementation"
```

---

## Task 4: Auth middleware and login/logout handlers

**Files:**
- Create: `server/auth.ts`

- [ ] **Step 1: Create `server/auth.ts`**

```typescript
import { type Request, type Response, type NextFunction } from "express";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import { getAdminUser } from "./storage";

// Rate limiter for login endpoint
export const loginRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: { message: "Too many login attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth middleware — rejects unauthenticated requests
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session && (req.session as any).isAdmin) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
}

// Login handler
export async function handleLogin(req: Request, res: Response) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const admin = await getAdminUser();
  if (!admin) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, admin.passwordHash);
  if (!isMatch || admin.username !== username) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  (req.session as any).isAdmin = true;
  return res.status(200).json({ message: "Login successful" });
}

// Logout handler
export async function handleLogout(req: Request, res: Response) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to logout" });
    }
    res.clearCookie("connect.sid");
    return res.status(200).json({ message: "Logged out" });
  });
}

// Auth status check
export async function handleAuthStatus(req: Request, res: Response) {
  const isAdmin = !!(req.session && (req.session as any).isAdmin);
  return res.status(200).json({ authenticated: isAdmin });
}
```

- [ ] **Step 2: Commit**

```bash
git add server/auth.ts
git commit -m "feat: add auth middleware with bcrypt login, rate limiting, and session management"
```

---

## Task 5: Seed script — Populate database from `portfolio.ts`

**Files:**
- Create: `server/seed.ts`

- [ ] **Step 1: Create `server/seed.ts`**

```typescript
import { db } from "./storage";
import { randomUUID } from "crypto";
import {
  personalInfo as personalInfoTable,
  aboutInfo as aboutInfoTable,
  projects as projectsTable,
  experiences as experiencesTable,
  skills as skillsTable,
  randomFacts as randomFactsTable,
  navLinks as navLinksTable,
  adminUser as adminUserTable,
} from "@shared/schema";
import {
  personalInfo,
  aboutInfo,
  projects,
  experiences,
  skills,
  randomFacts,
  navLinks,
} from "@shared/portfolio";

export async function seed() {
  // Check if already seeded
  const existing = await db.select().from(personalInfoTable);
  if (existing.length > 0) {
    console.log("Database already seeded, skipping.");
    return;
  }

  console.log("Seeding database from portfolio.ts...");

  // Personal info
  await db.insert(personalInfoTable).values({
    id: "main",
    name: personalInfo.name,
    tagline: personalInfo.tagline,
    intro: personalInfo.intro,
    email: personalInfo.email,
    github: personalInfo.github,
    linkedin: personalInfo.linkedin,
    resumeUrl: personalInfo.resumeUrl,
  });

  // About info
  await db.insert(aboutInfoTable).values({
    id: "main",
    bio: aboutInfo.bio,
    currentFocus: aboutInfo.currentFocus,
    education: aboutInfo.education,
    interests: aboutInfo.interests,
  });

  // Projects
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    await db.insert(projectsTable).values({
      id: p.id,
      title: p.title,
      description: p.description,
      highlights: p.highlights,
      techStack: p.techStack,
      category: p.category,
      featured: p.featured,
      githubUrl: p.githubUrl ?? null,
      liveUrl: p.liveUrl ?? null,
      sortOrder: i,
    });
  }

  // Experiences
  for (let i = 0; i < experiences.length; i++) {
    const e = experiences[i];
    await db.insert(experiencesTable).values({
      id: e.id,
      role: e.role,
      organization: e.organization,
      location: e.location,
      startDate: e.startDate,
      endDate: e.endDate,
      bullets: e.bullets,
      sortOrder: i,
    });
  }

  // Skills (no id in portfolio.ts, generate UUIDs)
  for (let i = 0; i < skills.length; i++) {
    const s = skills[i];
    await db.insert(skillsTable).values({
      id: randomUUID(),
      name: s.name,
      category: s.category,
      sortOrder: i,
    });
  }

  // Random facts
  for (let i = 0; i < randomFacts.length; i++) {
    const f = randomFacts[i];
    await db.insert(randomFactsTable).values({
      id: f.id,
      emoji: f.emoji,
      title: f.title,
      description: f.description,
      sortOrder: i,
    });
  }

  // Nav links (no id in portfolio.ts, generate UUIDs)
  for (let i = 0; i < navLinks.length; i++) {
    const n = navLinks[i];
    await db.insert(navLinksTable).values({
      id: randomUUID(),
      label: n.label,
      href: n.href,
      icon: n.icon,
      sortOrder: i,
    });
  }

  // Admin user (from env vars)
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  if (adminUsername && adminPasswordHash) {
    await db.insert(adminUserTable).values({
      id: "admin",
      username: adminUsername,
      passwordHash: adminPasswordHash,
    });
    console.log("Admin user seeded.");
  } else {
    console.warn("ADMIN_USERNAME or ADMIN_PASSWORD_HASH not set — skipping admin user seed.");
  }

  console.log("Database seeded successfully.");
}
```

- [ ] **Step 2: Commit**

```bash
git add server/seed.ts
git commit -m "feat: add database seed script to populate from portfolio.ts"
```

---

## Task 6: Server setup — Session, database connection, routes

**Files:**
- Modify: `server/index.ts`
- Modify: `server/routes.ts`

- [ ] **Step 1: Update `server/index.ts` — add session middleware and database seed**

Add these imports at the top:
```typescript
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { seed } from "./seed";
```

After the `app.use(express.urlencoded({ extended: false }));` line, add session middleware:

```typescript
const PgSession = connectPgSimple(session);

app.use(
  session({
    store: new PgSession({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || "dev-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);
```

Inside the `(async () => { ... })()` block, before `await registerRoutes(httpServer, app);`, add:

```typescript
  // Seed database on first run
  await seed();
```

- [ ] **Step 2: Replace `server/routes.ts` with content and auth routes**

Replace the entire file:

```typescript
import type { Express } from "express";
import type { Server } from "http";
import { contactMessageSchema } from "@shared/schema";
import {
  getPersonalInfo,
  getAboutInfo,
  getProjects,
  getExperiences,
  getSkills,
  getRandomFacts,
  getNavLinks,
  createContactMessage,
  updatePersonalInfo,
  updateAboutInfo,
  createProject,
  updateProject,
  deleteProject,
  createExperience,
  updateExperience,
  deleteExperience,
  createSkill,
  updateSkill,
  deleteSkill,
  createRandomFact,
  updateRandomFact,
  deleteRandomFact,
  createNavLink,
  updateNavLink,
  deleteNavLink,
  executeBatch,
} from "./storage";
import {
  requireAuth,
  loginRateLimiter,
  handleLogin,
  handleLogout,
  handleAuthStatus,
} from "./auth";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  // --- Auth routes ---
  app.post("/api/auth/login", loginRateLimiter, handleLogin);
  app.post("/api/auth/logout", handleLogout);
  app.get("/api/auth/status", handleAuthStatus);

  // --- Public content routes ---
  app.get("/api/content/personal-info", async (_req, res) => {
    const data = await getPersonalInfo();
    return res.json(data);
  });

  app.get("/api/content/about", async (_req, res) => {
    const data = await getAboutInfo();
    return res.json(data);
  });

  app.get("/api/content/projects", async (_req, res) => {
    const data = await getProjects();
    return res.json(data);
  });

  app.get("/api/content/experiences", async (_req, res) => {
    const data = await getExperiences();
    return res.json(data);
  });

  app.get("/api/content/skills", async (_req, res) => {
    const data = await getSkills();
    return res.json(data);
  });

  app.get("/api/content/random-facts", async (_req, res) => {
    const data = await getRandomFacts();
    return res.json(data);
  });

  app.get("/api/content/nav-links", async (_req, res) => {
    const data = await getNavLinks();
    return res.json(data);
  });

  // --- Contact form (existing) ---
  app.post("/api/contact", async (req, res) => {
    const result = contactMessageSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      });
    }
    const message = await createContactMessage(result.data);
    return res.json({ message: "Message received successfully", data: message });
  });

  // --- Protected content routes ---
  app.put("/api/content/personal-info", requireAuth, async (req, res) => {
    await updatePersonalInfo(req.body);
    return res.json({ message: "Updated" });
  });

  app.put("/api/content/about", requireAuth, async (req, res) => {
    await updateAboutInfo(req.body);
    return res.json({ message: "Updated" });
  });

  app.post("/api/content/projects", requireAuth, async (req, res) => {
    const project = await createProject(req.body);
    return res.json(project);
  });

  app.put("/api/content/projects/:id", requireAuth, async (req, res) => {
    await updateProject(req.params.id, req.body);
    return res.json({ message: "Updated" });
  });

  app.delete("/api/content/projects/:id", requireAuth, async (req, res) => {
    await deleteProject(req.params.id);
    return res.json({ message: "Deleted" });
  });

  app.post("/api/content/experiences", requireAuth, async (req, res) => {
    const experience = await createExperience(req.body);
    return res.json(experience);
  });

  app.put("/api/content/experiences/:id", requireAuth, async (req, res) => {
    await updateExperience(req.params.id, req.body);
    return res.json({ message: "Updated" });
  });

  app.delete("/api/content/experiences/:id", requireAuth, async (req, res) => {
    await deleteExperience(req.params.id);
    return res.json({ message: "Deleted" });
  });

  app.post("/api/content/skills", requireAuth, async (req, res) => {
    const skill = await createSkill(req.body);
    return res.json(skill);
  });

  app.put("/api/content/skills/:id", requireAuth, async (req, res) => {
    await updateSkill(req.params.id, req.body);
    return res.json({ message: "Updated" });
  });

  app.delete("/api/content/skills/:id", requireAuth, async (req, res) => {
    await deleteSkill(req.params.id);
    return res.json({ message: "Deleted" });
  });

  app.post("/api/content/random-facts", requireAuth, async (req, res) => {
    const fact = await createRandomFact(req.body);
    return res.json(fact);
  });

  app.put("/api/content/random-facts/:id", requireAuth, async (req, res) => {
    await updateRandomFact(req.params.id, req.body);
    return res.json({ message: "Updated" });
  });

  app.delete("/api/content/random-facts/:id", requireAuth, async (req, res) => {
    await deleteRandomFact(req.params.id);
    return res.json({ message: "Deleted" });
  });

  app.post("/api/content/nav-links", requireAuth, async (req, res) => {
    const link = await createNavLink(req.body);
    return res.json(link);
  });

  app.put("/api/content/nav-links/:id", requireAuth, async (req, res) => {
    await updateNavLink(req.params.id, req.body);
    return res.json({ message: "Updated" });
  });

  app.delete("/api/content/nav-links/:id", requireAuth, async (req, res) => {
    await deleteNavLink(req.params.id);
    return res.json({ message: "Deleted" });
  });

  // --- Batch update ---
  app.put("/api/content/batch", requireAuth, async (req, res) => {
    try {
      await executeBatch(req.body);
      return res.json({ message: "Batch update successful" });
    } catch (error) {
      console.error("Batch update failed:", error);
      return res.status(500).json({ message: "Batch update failed" });
    }
  });

  return httpServer;
}
```

- [ ] **Step 3: Commit**

```bash
git add server/index.ts server/routes.ts
git commit -m "feat: add session middleware, seed call, and all content/auth API routes"
```

---

## Task 7: Frontend — Edit mode context and content hooks

**Files:**
- Create: `client/src/lib/edit-context.tsx`
- Create: `client/src/lib/use-content.ts`

- [ ] **Step 1: Create `client/src/lib/edit-context.tsx`**

This provides global edit mode state, changeset tracking, and save functionality:

```typescript
import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "./queryClient";
import { useToast } from "@/hooks/use-toast";

interface Change {
  type: "update" | "create" | "delete";
  table: string;
  id?: string;
  data?: Record<string, unknown>;
}

interface EditModeContextType {
  isEditMode: boolean;
  changes: Change[];
  addChange: (change: Change) => void;
  removeChange: (index: number) => void;
  clearChanges: () => void;
  save: () => Promise<void>;
  isSaving: boolean;
  logout: () => Promise<void>;
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export function EditModeProvider({ children }: { children: React.ReactNode }) {
  const [changes, setChanges] = useState<Change[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: authStatus } = useQuery<{ authenticated: boolean }>({
    queryKey: ["/api/auth/status"],
    staleTime: Infinity,
  });

  const isEditMode = authStatus?.authenticated ?? false;

  // Warn before leaving with unsaved changes
  useEffect(() => {
    if (changes.length === 0) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [changes.length]);

  const addChange = useCallback((change: Change) => {
    setChanges((prev) => {
      // If updating the same table+id, replace the existing change
      const existing = prev.findIndex(
        (c) => c.type === "update" && c.table === change.table && c.id === change.id && change.type === "update"
      );
      if (existing !== -1) {
        const updated = [...prev];
        updated[existing] = {
          ...updated[existing],
          data: { ...updated[existing].data, ...change.data },
        };
        return updated;
      }
      return [...prev, change];
    });
  }, []);

  const removeChange = useCallback((index: number) => {
    setChanges((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearChanges = useCallback(() => {
    setChanges([]);
  }, []);

  const save = useCallback(async () => {
    if (changes.length === 0) return;
    setIsSaving(true);
    try {
      const payload = {
        updates: changes.filter((c) => c.type === "update").map(({ table, id, data }) => ({ table, id: id!, data: data! })),
        creates: changes.filter((c) => c.type === "create").map(({ table, data }) => ({ table, data: data! })),
        deletes: changes.filter((c) => c.type === "delete").map(({ table, id }) => ({ table, id: id! })),
      };
      await apiRequest("PUT", "/api/content/batch", payload);
      setChanges([]);
      // Invalidate all content queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({ title: "Changes saved!", description: "Your changes are now live." });
    } catch (error) {
      toast({ title: "Save failed", description: "Your changes are preserved. Please try again.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }, [changes, queryClient, toast]);

  const logout = useCallback(async () => {
    await apiRequest("POST", "/api/auth/logout");
    queryClient.setQueryData(["/api/auth/status"], { authenticated: false });
    setChanges([]);
  }, [queryClient]);

  return (
    <EditModeContext.Provider value={{ isEditMode, changes, addChange, removeChange, clearChanges, save, isSaving, logout }}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  const context = useContext(EditModeContext);
  if (!context) {
    throw new Error("useEditMode must be used within EditModeProvider");
  }
  return context;
}
```

- [ ] **Step 2: Create `client/src/lib/use-content.ts`**

A thin wrapper around `useQuery` for fetching content:

```typescript
import { useQuery } from "@tanstack/react-query";

export function useContent<T>(endpoint: string) {
  return useQuery<T>({
    queryKey: [endpoint],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

- [ ] **Step 3: Commit**

```bash
git add client/src/lib/edit-context.tsx client/src/lib/use-content.ts
git commit -m "feat: add EditModeContext provider and useContent hook"
```

---

## Task 8: Frontend — Editable component and EditBar

**Files:**
- Create: `client/src/components/editable.tsx`
- Create: `client/src/components/editable-list.tsx`
- Create: `client/src/components/edit-bar.tsx`

- [ ] **Step 1: Create `client/src/components/editable.tsx`**

A wrapper that makes any text element inline-editable in edit mode. Uses an uncontrolled pattern — sets text via ref on mount to avoid React overwriting user edits on re-render:

```typescript
import { useRef, useState, useEffect } from "react";
import { useEditMode } from "@/lib/edit-context";

interface EditableProps {
  value: string;
  table: string;
  id: string;
  field: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  "data-testid"?: string;
}

export function Editable({
  value,
  table,
  id,
  field,
  as: Tag = "span",
  className = "",
  ...props
}: EditableProps) {
  const { isEditMode, addChange } = useEditMode();
  const [isEditing, setIsEditing] = useState(false);
  const ref = useRef<HTMLElement>(null);

  // Set text content via ref (uncontrolled) to avoid React overwriting edits on re-render
  useEffect(() => {
    if (ref.current && !isEditing) {
      ref.current.textContent = value;
    }
  }, [value, isEditing]);

  if (!isEditMode) {
    return <Tag className={className} {...props}>{value}</Tag>;
  }

  const handleBlur = () => {
    setIsEditing(false);
    const newValue = ref.current?.textContent ?? "";
    if (newValue !== value) {
      addChange({
        type: "update",
        table,
        id,
        data: { [field]: newValue },
      });
    }
  };

  return (
    <Tag
      ref={ref as any}
      className={`${className} ${isEditing ? "outline outline-2 outline-primary/50 bg-primary/5 rounded px-1" : "hover:outline-dashed hover:outline-1 hover:outline-muted-foreground/30 hover:rounded cursor-text"}`}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onClick={() => setIsEditing(true)}
      onBlur={handleBlur}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          (e.target as HTMLElement).blur();
        }
        if (e.key === "Escape") {
          if (ref.current) ref.current.textContent = value;
          setIsEditing(false);
        }
      }}
    />
  );
}
```

- [ ] **Step 2: Create `client/src/components/editable-list.tsx`**

Handles add/delete affordances for list items in edit mode:

```typescript
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditMode } from "@/lib/edit-context";

interface EditableListProps {
  table: string;
  onAdd: () => void;
  addLabel: string;
  children: React.ReactNode;
}

export function EditableList({ table, onAdd, addLabel, children }: EditableListProps) {
  const { isEditMode } = useEditMode();

  return (
    <>
      {children}
      {isEditMode && (
        <Button
          variant="outline"
          className="border-dashed border-2 border-muted-foreground/30 hover:border-primary/50 w-full h-24 flex items-center justify-center gap-2 text-muted-foreground hover:text-primary"
          onClick={onAdd}
        >
          <Plus className="h-5 w-5" />
          {addLabel}
        </Button>
      )}
    </>
  );
}

interface DeleteButtonProps {
  table: string;
  id: string;
  label: string;
}

export function DeleteButton({ table, id, label }: DeleteButtonProps) {
  const { isEditMode, addChange } = useEditMode();

  if (!isEditMode) return null;

  const handleDelete = () => {
    if (confirm(`Delete this ${label}?`)) {
      addChange({ type: "delete", table, id });
    }
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={handleDelete}
      aria-label={`Delete ${label}`}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
```

- [ ] **Step 3: Create `client/src/components/edit-bar.tsx`**

The floating save/exit bar that appears in edit mode:

```typescript
import { Save, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditMode } from "@/lib/edit-context";

export function EditBar() {
  const { isEditMode, changes, save, isSaving, logout } = useEditMode();

  if (!isEditMode) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-14 bg-background/90 backdrop-blur-lg border-t border-border">
      <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between">
        <span className="text-sm font-medium text-primary">Edit Mode</span>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            onClick={save}
            disabled={changes.length === 0 || isSaving}
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {changes.length > 0 ? `Save (${changes.length} changes)` : "Save"}
          </Button>

          <Button size="sm" variant="outline" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Exit
          </Button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add client/src/components/editable.tsx client/src/components/editable-list.tsx client/src/components/edit-bar.tsx
git commit -m "feat: add Editable, EditableList, DeleteButton, and EditBar components"
```

---

## Task 9: Frontend — Admin login page

**Files:**
- Create: `client/src/pages/admin-login.tsx`

- [ ] **Step 1: Create `client/src/pages/admin-login.tsx`**

```typescript
import { useState } from "react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await apiRequest("POST", "/api/auth/login", { username, password });
      queryClient.setQueryData(["/api/auth/status"], { authenticated: true });
      setLocation("/");
    } catch (err: any) {
      setError(err.message?.includes("401") ? "Invalid credentials" : "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-sm">
        <CardContent className="p-6">
          <h1 className="text-xl font-semibold mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/pages/admin-login.tsx
git commit -m "feat: add admin login page"
```

---

## Task 10: Frontend — Wire up App.tsx with EditModeProvider and login route

**Files:**
- Modify: `client/src/App.tsx`

- [ ] **Step 1: Update `client/src/App.tsx`**

Add imports for `EditModeProvider`, `EditBar`, and `AdminLoginPage`. Add the login route and wrap the app with the provider:

```typescript
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { EditModeProvider } from "@/lib/edit-context";
import { EditBar } from "@/components/edit-bar";
import { GradientBackground } from "@/components/gradient-background";
import AboutPage from "@/pages/about";
import ExperiencePage from "@/pages/experience";
import RandomFactsPage from "@/pages/random-facts";
import AdminLoginPage from "@/pages/admin-login";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={AboutPage} />
      <Route path="/experience" component={ExperiencePage} />
      <Route path="/random-facts" component={RandomFactsPage} />
      <Route path="/admin-login" component={AdminLoginPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <EditModeProvider>
          <TooltipProvider>
            <GradientBackground variant="vibrant">
              <Toaster />
              <Router />
              <EditBar />
            </GradientBackground>
          </TooltipProvider>
        </EditModeProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
```

- [ ] **Step 2: Commit**

```bash
git add client/src/App.tsx
git commit -m "feat: add EditModeProvider, EditBar, and admin login route to App"
```

---

## Task 11: Frontend — Shared TypeScript types for API responses

**Files:**
- Create: `client/src/lib/types.ts`

- [ ] **Step 1: Create `client/src/lib/types.ts`**

Define TypeScript interfaces that match the API response shapes (mirroring the Drizzle schema column names). These replace the interfaces previously imported from `shared/portfolio.ts`:

```typescript
export interface PersonalInfo {
  id: string;
  name: string;
  tagline: string;
  intro: string;
  email: string;
  github: string;
  linkedin: string;
  resumeUrl: string;
}

export interface AboutInfo {
  id: string;
  bio: string;
  currentFocus: string;
  education: {
    school: string;
    degree: string;
    period: string;
    gpa: string;
    coursework: string[];
  };
  interests: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  highlights: string[];
  techStack: string[];
  category: "SWE" | "Data" | "ML";
  featured: boolean;
  githubUrl: string | null;
  liveUrl: string | null;
  sortOrder: number;
}

export interface Experience {
  id: string;
  role: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
  sortOrder: number;
}

export interface Skill {
  id: string;
  name: string;
  category: "Languages/Frameworks" | "Database Technologies" | "Cloud/Dev Tools";
  sortOrder: number;
}

export interface RandomFact {
  id: string;
  emoji: string;
  title: string;
  description: string;
  sortOrder: number;
}

export interface NavLink {
  id: string;
  label: string;
  href: string;
  icon: string;
  sortOrder: number;
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/lib/types.ts
git commit -m "feat: add shared TypeScript types for API response shapes"
```

---

## Task 12: Frontend — Add EditableSelect and EditableBullets components

**Files:**
- Create: `client/src/components/editable-select.tsx`
- Create: `client/src/components/editable-bullets.tsx`

- [ ] **Step 1: Create `client/src/components/editable-select.tsx`**

Dropdown selector for category fields and boolean toggle for featured flag:

```typescript
import { useEditMode } from "@/lib/edit-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface EditableSelectProps {
  value: string;
  options: string[];
  table: string;
  id: string;
  field: string;
  className?: string;
}

export function EditableSelect({ value, options, table, id, field, className }: EditableSelectProps) {
  const { isEditMode, addChange } = useEditMode();

  if (!isEditMode) {
    return <span className={className}>{value}</span>;
  }

  return (
    <Select
      value={value}
      onValueChange={(newValue) => {
        addChange({ type: "update", table, id, data: { [field]: newValue } });
      }}
    >
      <SelectTrigger className={`w-auto h-auto inline-flex ${className}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface EditableToggleProps {
  value: boolean;
  table: string;
  id: string;
  field: string;
  label: string;
}

export function EditableToggle({ value, table, id, field, label }: EditableToggleProps) {
  const { isEditMode, addChange } = useEditMode();

  if (!isEditMode) return null;

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={value}
        onCheckedChange={(checked) => {
          addChange({ type: "update", table, id, data: { [field]: checked } });
        }}
      />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
```

- [ ] **Step 2: Create `client/src/components/editable-bullets.tsx`**

Handles inline editing of bullet point arrays (experience bullets, project highlights):

```typescript
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditMode } from "@/lib/edit-context";
import { Editable } from "./editable";
import { useState } from "react";

interface EditableBulletsProps {
  bullets: string[];
  table: string;
  id: string;
  field: string;
  className?: string;
}

export function EditableBullets({ bullets, table, id, field, className }: EditableBulletsProps) {
  const { isEditMode, addChange } = useEditMode();
  const [localBullets, setLocalBullets] = useState(bullets);

  // Sync with prop changes (e.g., after save refetch)
  if (JSON.stringify(bullets) !== JSON.stringify(localBullets) && !isEditMode) {
    setLocalBullets(bullets);
  }

  const updateBullets = (newBullets: string[]) => {
    setLocalBullets(newBullets);
    addChange({ type: "update", table, id, data: { [field]: newBullets } });
  };

  const handleBulletChange = (index: number, newValue: string) => {
    const updated = [...localBullets];
    updated[index] = newValue;
    updateBullets(updated);
  };

  const addBullet = () => {
    updateBullets([...localBullets, "New bullet point"]);
  };

  const removeBullet = (index: number) => {
    updateBullets(localBullets.filter((_, i) => i !== index));
  };

  return (
    <ul className={`space-y-3 ml-1 ${className ?? ""}`}>
      {localBullets.map((bullet, idx) => (
        <li key={idx} className="text-muted-foreground flex items-start gap-3 group/bullet">
          <span className="text-primary mt-1.5 flex-shrink-0">•</span>
          {isEditMode ? (
            <>
              <Editable
                value={bullet}
                table={table}
                id={id}
                field={`__bullet_${idx}`}
                as="span"
                // Override the default addChange — handle bullet array updates locally
              />
              <Button
                size="icon"
                variant="ghost"
                className="h-5 w-5 flex-shrink-0 text-muted-foreground hover:text-destructive opacity-0 group-hover/bullet:opacity-100 transition-opacity mt-1"
                onClick={() => removeBullet(idx)}
              >
                <X className="h-3 w-3" />
              </Button>
            </>
          ) : (
            <span>{bullet}</span>
          )}
        </li>
      ))}
      {isEditMode && (
        <li>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary text-xs"
            onClick={addBullet}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add bullet
          </Button>
        </li>
      )}
    </ul>
  );
}
```

**Note:** The `EditableBullets` component manages its own local state for the bullet array and submits the full array as a single change. The individual `Editable` wrapping per bullet is for the visual contentEditable affordance — the actual change recorded uses the `handleBulletChange` function. The implementing agent should wire the `onBlur` of each bullet's contentEditable span to call `handleBulletChange(idx, newText)` instead of the default `Editable` addChange. This may require a small refactor to accept an `onChange` callback prop on `Editable`, or use a simpler inline contentEditable span here directly.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/editable-select.tsx client/src/components/editable-bullets.tsx
git commit -m "feat: add EditableSelect, EditableToggle, and EditableBullets components"
```

---

## Task 13: Frontend — Migrate About page to API data + editable

**Files:**
- Modify: `client/src/pages/about.tsx`

- [ ] **Step 1: Update `client/src/pages/about.tsx`**

Replace the entire file. Key changes from the original:
- Remove `import { personalInfo, aboutInfo } from "@shared/portfolio"`
- Add imports for `useContent`, `Editable`, types
- Fetch data from API with loading state
- Wrap all text in `Editable` components

```typescript
import { ArrowRight, Github, FileText, Mail } from "lucide-react";
import { SiLinkedin } from "react-icons/si";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";
import { Sparkles, Target, Loader2 } from "lucide-react";
import { useContent } from "@/lib/use-content";
import { Editable } from "@/components/editable";
import type { PersonalInfo, AboutInfo } from "@/lib/types";

export default function AboutPage() {
  const { data: personalInfo, isLoading: piLoading } = useContent<PersonalInfo>("/api/content/personal-info");
  const { data: aboutInfo, isLoading: aiLoading } = useContent<AboutInfo>("/api/content/about");

  if (piLoading || aiLoading || !personalInfo || !aboutInfo) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
        <section className="relative min-h-[70vh] flex items-center justify-center pt-16">
          <div className="max-w-6xl mx-auto px-6 py-16 text-center">
            <div className="space-y-6">
              <Editable
                value={personalInfo.name}
                table="personal_info"
                id="main"
                field="name"
                as="h1"
                className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight"
                data-testid="text-hero-name"
              />
              <Editable
                value={personalInfo.tagline}
                table="personal_info"
                id="main"
                field="tagline"
                as="p"
                className="text-xl sm:text-2xl text-muted-foreground font-medium"
                data-testid="text-hero-tagline"
              />
              <Editable
                value={personalInfo.intro}
                table="personal_info"
                id="main"
                field="intro"
                as="p"
                className="max-w-2xl mx-auto text-lg leading-relaxed text-[#fafafa]"
                data-testid="text-hero-intro"
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
              <Button size="lg" asChild data-testid="button-view-experience">
                <Link href="/experience">
                  View Experience
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild data-testid="button-github">
                <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild data-testid="button-resume">
                <a href={personalInfo.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="mr-2 h-4 w-4" />
                  Resume
                </a>
              </Button>
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <Button size="icon" variant="ghost" asChild aria-label="LinkedIn" data-testid="button-linkedin">
                <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
                  <SiLinkedin className="h-5 w-5" />
                </a>
              </Button>
              <Button size="icon" variant="ghost" asChild aria-label="Email" data-testid="button-email">
                <a href={`mailto:${personalInfo.email}`}>
                  <Mail className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section id="about" className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-12" data-testid="text-about-heading">
              About Me
            </h2>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <div className="space-y-6">
                <Editable
                  value={aboutInfo.bio}
                  table="about_info"
                  id="main"
                  field="bio"
                  as="p"
                  className="text-lg text-muted-foreground leading-relaxed"
                  data-testid="text-about-bio"
                />
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                  <Editable
                    value={aboutInfo.currentFocus}
                    table="about_info"
                    id="main"
                    field="currentFocus"
                    as="p"
                    className="text-muted-foreground"
                    data-testid="text-about-focus"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-md bg-primary/10">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3">Interests</h3>
                        <div className="flex flex-wrap gap-2">
                          {aboutInfo.interests.map((interest: string) => (
                            <Badge
                              key={interest}
                              variant="secondary"
                              data-testid={`badge-interest-${interest.toLowerCase().replace(/\s+/g, "-")}`}
                            >
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        </main>
        <Footer />
      </div>
    </PageWrapper>
  );
}
```

- [ ] **Step 2: Verify the page renders correctly with API data**

Run the dev server and check `/` loads the About page with data from the API.

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/about.tsx
git commit -m "feat: migrate About page to API data with inline editing"
```

---

## Task 14: Frontend — Migrate Experience page to API data + editable

**Files:**
- Modify: `client/src/pages/experience.tsx`

- [ ] **Step 1: Update `client/src/pages/experience.tsx`**

Replace the entire file. Key changes:
- Replace all `@shared/portfolio` imports with `useContent` hooks and types from `@/lib/types`
- Fetch experiences, aboutInfo, projects, skills from API
- Wrap text fields in `Editable`, category fields in `EditableSelect`, bullets in `EditableBullets`
- Add `DeleteButton` to projects, experiences, skills
- Add `EditableList` with "Add" buttons
- Add `EditableToggle` for project featured flag
- Add pending-delete visual state (opacity-50 for items marked for deletion)
- Keep all existing styling intact — the `SkillCategory` component stays, skill icons map stays

The implementing agent should follow this pattern for each editable section:

For **experiences**, each entry wraps its text fields:
```typescript
<Editable value={exp.organization} table="experiences" id={exp.id} field="organization" as="h3" className="font-bold text-2xl" />
<Editable value={exp.role} table="experiences" id={exp.id} field="role" as="p" className="text-primary font-medium" />
<EditableBullets bullets={exp.bullets} table="experiences" id={exp.id} field="bullets" />
```

For **projects**, each card wraps its fields and adds category dropdown + featured toggle:
```typescript
<Editable value={project.title} table="projects" id={project.id} field="title" as="h3" className="font-semibold text-lg" />
<Editable value={project.description} table="projects" id={project.id} field="description" as="p" className="text-sm text-muted-foreground mb-4" />
<EditableSelect value={project.category} options={["SWE", "Data", "ML"]} table="projects" id={project.id} field="category" />
<EditableToggle value={project.featured} table="projects" id={project.id} field="featured" label="Featured" />
<DeleteButton table="projects" id={project.id} label="project" />
```

For **skills**, each badge wraps its name and adds delete:
```typescript
<EditableSelect value={skill.category} options={["Languages/Frameworks", "Database Technologies", "Cloud/Dev Tools"]} table="skills" id={skill.id} field="category" />
<DeleteButton table="skills" id={skill.id} label="skill" />
```

Each list section wraps items in `EditableList` for the "Add" button.

For **pending-delete visual state**: check if the item's id appears in the changes array as a delete operation. If so, add `opacity-50 pointer-events-none` to the item's container.

```typescript
const { changes } = useEditMode();
const isDeleted = (table: string, id: string) =>
  changes.some((c) => c.type === "delete" && c.table === table && c.id === id);

// In JSX:
<div className={`... ${isDeleted("projects", project.id) ? "opacity-50 pointer-events-none" : ""}`}>
```

- [ ] **Step 2: Verify the page renders correctly**

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/experience.tsx
git commit -m "feat: migrate Experience page to API data with inline editing"
```

---

## Task 15: Frontend — Migrate Random Facts page to API data + editable

**Files:**
- Modify: `client/src/pages/random-facts.tsx`

- [ ] **Step 1: Update `client/src/pages/random-facts.tsx`**

Replace the entire file. Follow the same pattern:
- Replace `import { randomFacts } from "@shared/portfolio"` with `useContent` + types
- Fetch random facts from API
- Add loading spinner
- Wrap title and description with `Editable`
- Use `IconPicker` for the emoji/icon field (from Task 17)
- Add `DeleteButton` on each card, `EditableList` for "Add Fact"
- Add pending-delete visual state (opacity-50)

```typescript
import { Coffee, Mountain, Crown, Globe, Music, ChefHat, Heart, Star, Zap, BookOpen, Camera, Gamepad2, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";
import { useContent } from "@/lib/use-content";
import { Editable } from "@/components/editable";
import { EditableList, DeleteButton } from "@/components/editable-list";
import { IconPicker } from "@/components/icon-picker";
import { useEditMode } from "@/lib/edit-context";
import type { RandomFact } from "@/lib/types";

const iconMap: Record<string, typeof Coffee> = {
  coffee: Coffee, hiking: Mountain, chess: Crown, languages: Globe,
  music: Music, cooking: ChefHat, heart: Heart, star: Star,
  zap: Zap, book: BookOpen, camera: Camera, gaming: Gamepad2,
};

const colorMap: Record<string, string> = {
  coffee: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  hiking: "bg-green-500/10 text-green-600 dark:text-green-400",
  chess: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  languages: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  music: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  cooking: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
};

export default function RandomFactsPage() {
  const { data: facts, isLoading } = useContent<RandomFact[]>("/api/content/random-facts");
  const { isEditMode, changes, addChange } = useEditMode();

  const isDeleted = (id: string) =>
    changes.some((c) => c.type === "delete" && c.table === "random_facts" && c.id === id);

  if (isLoading || !facts) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageWrapper>
    );
  }

  const handleAddFact = () => {
    const tempId = `temp-${Date.now()}`;
    addChange({
      type: "create",
      table: "random_facts",
      data: {
        emoji: "star",
        title: "New Fact",
        description: "Description here...",
        sortOrder: facts.length,
      },
    });
  };

  return (
    <PageWrapper>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16">
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-random-facts-heading">
              Random Facts
            </h1>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
              Beyond the code and data, here are some fun things about me that make me who I am.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <EditableList table="random_facts" onAdd={handleAddFact} addLabel="Add Fact">
                {facts.map((fact) => {
                  const Icon = iconMap[fact.emoji] || Coffee;
                  const colorClass = colorMap[fact.emoji] || "bg-primary/10 text-primary";

                  return (
                    <Card
                      key={fact.id}
                      className={`transition-transform duration-200 hover:-translate-y-1 group relative ${isDeleted(fact.id) ? "opacity-50 pointer-events-none" : ""}`}
                      data-testid={`card-fact-${fact.id}`}
                    >
                      <DeleteButton table="random_facts" id={fact.id} label="fact" />
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-md ${colorClass}`}>
                            {isEditMode ? (
                              <IconPicker
                                currentIcon={fact.emoji}
                                table="random_facts"
                                id={fact.id}
                                onSelect={(key) => addChange({ type: "update", table: "random_facts", id: fact.id, data: { emoji: key } })}
                              />
                            ) : (
                              <Icon className="h-6 w-6" />
                            )}
                          </div>
                          <div className="space-y-2">
                            <Editable
                              value={fact.title}
                              table="random_facts"
                              id={fact.id}
                              field="title"
                              as="h3"
                              className="font-semibold text-lg"
                              data-testid={`text-fact-title-${fact.id}`}
                            />
                            <Editable
                              value={fact.description}
                              table="random_facts"
                              id={fact.id}
                              field="description"
                              as="p"
                              className="text-muted-foreground text-sm leading-relaxed"
                              data-testid={`text-fact-desc-${fact.id}`}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </EditableList>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Want to know more?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              I'm always happy to chat about coffee recommendations, hiking trails, or anything else. Feel free to reach out!
            </p>
          </div>
        </section>
        </main>
        <Footer />
      </div>
    </PageWrapper>
  );
}
```

- [ ] **Step 2: Verify the page renders correctly**

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/random-facts.tsx
git commit -m "feat: migrate Random Facts page to API data with inline editing"
```

---

## Task 16: Frontend — Migrate shared components (Navbar, Footer, Contact) and add admin-logout route

**Files:**
- Modify: `client/src/components/navbar.tsx`
- Modify: `client/src/components/footer.tsx`
- Modify: `client/src/components/contact-section.tsx`
- Modify: `client/src/App.tsx` (add `/admin-logout` route)

- [ ] **Step 1: Update `navbar.tsx`**

Replace `import { navLinks, personalInfo } from "@shared/portfolio"` with:

```typescript
import { useContent } from "@/lib/use-content";
import type { NavLink, PersonalInfo } from "@/lib/types";
```

Inside the component, fetch data:

```typescript
const { data: navLinksData } = useContent<NavLink[]>("/api/content/nav-links");
const { data: personalInfoData } = useContent<PersonalInfo>("/api/content/personal-info");

// Fallback while loading
const currentNavLinks = navLinksData ?? [];
```

Replace all references to `navLinks` with `currentNavLinks` and `personalInfo` with `personalInfoData` (guard with `?.` for the loading state). The rest of the component stays identical.

- [ ] **Step 2: Update `footer.tsx`**

Replace `import { personalInfo } from "@shared/portfolio"` with:

```typescript
import { useContent } from "@/lib/use-content";
import type { PersonalInfo } from "@/lib/types";
```

Inside the component:

```typescript
const { data: personalInfo } = useContent<PersonalInfo>("/api/content/personal-info");
if (!personalInfo) return null; // Hide footer while loading
```

Rest of the component stays identical.

- [ ] **Step 3: Update `contact-section.tsx`**

Same pattern — replace the portfolio import with `useContent`, add loading guard. The form logic and layout stay identical.

- [ ] **Step 4: Add `/admin-logout` route to `App.tsx`**

Create a simple logout page component inline or as a separate file. Add to the Router:

```typescript
import { useEffect } from "react";
import { useLocation } from "wouter";
import { useEditMode } from "@/lib/edit-context";

function AdminLogoutPage() {
  const { logout } = useEditMode();
  const [, setLocation] = useLocation();

  useEffect(() => {
    logout().then(() => setLocation("/"));
  }, [logout, setLocation]);

  return null;
}
```

Add to Router:
```typescript
<Route path="/admin-logout" component={AdminLogoutPage} />
```

- [ ] **Step 5: Verify all components render correctly**

- [ ] **Step 6: Commit**

```bash
git add client/src/components/navbar.tsx client/src/components/footer.tsx client/src/components/contact-section.tsx client/src/App.tsx
git commit -m "feat: migrate shared components to API data and add admin-logout route"
```

---

## Task 17: Frontend — Icon picker for random facts

**Files:**
- Create: `client/src/components/icon-picker.tsx`

- [ ] **Step 1: Create `client/src/components/icon-picker.tsx`**

A simple dropdown that shows available icon options for random facts:

```typescript
import { Coffee, Mountain, Crown, Globe, Music, ChefHat, Heart, Star, Zap, BookOpen, Camera, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEditMode } from "@/lib/edit-context";
import { useState } from "react";

const iconOptions = [
  { key: "coffee", Icon: Coffee },
  { key: "hiking", Icon: Mountain },
  { key: "chess", Icon: Crown },
  { key: "languages", Icon: Globe },
  { key: "music", Icon: Music },
  { key: "cooking", Icon: ChefHat },
  { key: "heart", Icon: Heart },
  { key: "star", Icon: Star },
  { key: "zap", Icon: Zap },
  { key: "book", Icon: BookOpen },
  { key: "camera", Icon: Camera },
  { key: "gaming", Icon: Gamepad2 },
];

interface IconPickerProps {
  currentIcon: string;
  table: string;
  id: string;
  onSelect: (iconKey: string) => void;
}

export function IconPicker({ currentIcon, table, id, onSelect }: IconPickerProps) {
  const { isEditMode } = useEditMode();
  const [open, setOpen] = useState(false);
  const CurrentIcon = iconOptions.find((o) => o.key === currentIcon)?.Icon ?? Coffee;

  if (!isEditMode) {
    return <CurrentIcon className="h-6 w-6" />;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
          <CurrentIcon className="h-6 w-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <div className="grid grid-cols-4 gap-1">
          {iconOptions.map(({ key, Icon }) => (
            <Button
              key={key}
              variant={key === currentIcon ? "secondary" : "ghost"}
              size="icon"
              className="h-9 w-9"
              onClick={() => {
                onSelect(key);
                setOpen(false);
              }}
            >
              <Icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/icon-picker.tsx
git commit -m "feat: add IconPicker component for random facts editing"
```

---

## Task 18: Database push and end-to-end verification

**Files:** None new — this is a verification task.

- [ ] **Step 1: Ensure PostgreSQL is running locally**

Either use a local PostgreSQL instance or set up Docker:
```bash
# Option: Docker
docker run --name portfolio-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=portfolio -p 5432:5432 -d postgres:16
```

Set the environment variable:
```bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/portfolio"
export SESSION_SECRET="dev-session-secret"
export ADMIN_USERNAME="admin"
export ADMIN_PASSWORD_HASH="$(node -e "require('bcryptjs').hash('admin123', 10).then(h => console.log(h))")"
```

- [ ] **Step 2: Push schema to database**

```bash
npx drizzle-kit push
```

- [ ] **Step 3: Start dev server and verify seed runs**

```bash
npm run dev
```

Check console output for "Database seeded successfully."

- [ ] **Step 4: Verify public pages load from API**

- Visit `http://localhost:5000/` — About page should render with all data
- Visit `http://localhost:5000/experience` — Experience page with projects, skills, education
- Visit `http://localhost:5000/random-facts` — Random facts page

- [ ] **Step 5: Verify auth flow**

- Visit `http://localhost:5000/admin-login` — login form appears
- Login with admin/admin123 — redirects to `/` in edit mode
- Verify floating edit bar appears at bottom
- Click "Exit" — returns to visitor mode

- [ ] **Step 6: Verify inline editing**

- Login again
- Click on your name in the hero — should become editable
- Change it, verify "Save (1 changes)" appears in the bar
- Click Save — verify toast appears and change persists after page refresh
- Test adding a project, deleting a skill, editing an experience bullet

- [ ] **Step 7: Commit any fixes**

```bash
git add -A
git commit -m "fix: end-to-end verification fixes"
```

---

## Task 19: Deployment preparation

**Files:**
- Modify: `package.json` (if needed for build script adjustments)

- [ ] **Step 1: Verify production build works**

```bash
npm run build
```

Ensure no errors in client or server build.

- [ ] **Step 2: Test production mode locally**

```bash
npm start
```

Visit `http://localhost:5000/` and verify the site works in production mode.

- [ ] **Step 3: Push to GitHub**

Create a GitHub repo and push:
```bash
git remote add origin <your-github-repo-url>
git push -u origin main
```

- [ ] **Step 4: Deploy to Railway**

1. Create a new project on Railway (railway.app)
2. Connect your GitHub repo
3. Add a PostgreSQL plugin
4. Set environment variables: `DATABASE_URL` (from Railway Postgres), `SESSION_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `NODE_ENV=production`
5. Railway auto-detects the build/start scripts from `package.json`
6. Verify the deployed site works

- [ ] **Step 5: Configure custom domain**

1. Purchase domain from Namecheap or similar
2. In Railway dashboard, add custom domain
3. Update DNS CNAME to Railway's provided domain
4. Verify HTTPS works

- [ ] **Step 6: Final commit with any deployment fixes**

```bash
git add -A
git commit -m "chore: deployment configuration"
git push
```
