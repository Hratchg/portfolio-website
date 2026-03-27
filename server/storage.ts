import * as dotenv from "dotenv";
dotenv.config();
import { eq, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import {
  personalInfo,
  aboutInfo,
  projects,
  experiences,
  skills,
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
