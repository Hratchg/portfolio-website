/**
 * One-off, idempotent sync of the LIVE project cards and hero copy from
 * shared/portfolio.ts (the seed only runs on an empty database, so edits to
 * portfolio.ts never reach production on their own).
 *
 *   projects            : every field of each project in portfolio.ts, matched by id
 *                         (CoursePick rename + live link, accurate tech stacks,
 *                         only the top 4 marked Featured, new sort order)
 *   personal_info       : tagline, intro
 *
 * Rows that already match are reported as "already applied". Projects that exist
 * in the database but not in portfolio.ts are left untouched.
 *
 * Preview first (no writes):
 *
 *   cd ~/portfolio-website
 *   DRY_RUN=1 DATABASE_URL='<DATABASE_PUBLIC_URL>' npx tsx script/apply-project-updates.ts
 *
 * Then apply:
 *
 *   DATABASE_URL='<DATABASE_PUBLIC_URL>' npx tsx script/apply-project-updates.ts
 *
 * Railway: use the *public* connection string (Postgres service -> Variables ->
 * DATABASE_PUBLIC_URL). If you hit "server does not support SSL connections",
 * re-run with DB_SSL=disable.
 */
import "dotenv/config";
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { personalInfo as personalInfoTable, projects as projectsTable } from "../shared/schema";
import { personalInfo, projects } from "../shared/portfolio";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("✗ DATABASE_URL is not set. Aborting (no changes made).");
  process.exit(1);
}
const dryRun = process.env.DRY_RUN === "1";

const isLocal = /localhost|127\.0\.0\.1/.test(connectionString);
const sslDisabled = process.env.DB_SSL === "disable";
const pool = new pg.Pool({
  connectionString,
  ssl: isLocal || sslDisabled ? undefined : { rejectUnauthorized: false },
});
const db = drizzle(pool);

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

function diff(current: Record<string, unknown>, desired: Record<string, unknown>) {
  return Object.keys(desired).filter((k) => !same(current[k], desired[k]));
}

async function main() {
  let changed = 0;
  let skipped = 0;
  if (dryRun) console.log("DRY RUN: nothing will be written.\n");

  // Hero copy
  const [pi] = await db.select().from(personalInfoTable).where(eq(personalInfoTable.id, "main"));
  if (!pi) {
    console.error("✗ No personal_info row with id='main'. Skipping hero copy.");
  } else {
    const desired = { tagline: personalInfo.tagline, intro: personalInfo.intro };
    const fields = diff(pi as any, desired);
    console.log("personal_info");
    if (fields.length === 0) {
      console.log("  ✓ Already applied.");
      skipped++;
    } else {
      for (const f of fields) console.log(`  ${f}: ${JSON.stringify((pi as any)[f])} -> ${JSON.stringify((desired as any)[f])}`);
      if (!dryRun) await db.update(personalInfoTable).set(desired).where(eq(personalInfoTable.id, "main"));
      changed++;
    }
  }

  // Project cards
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    const desired = {
      title: p.title,
      description: p.description,
      highlights: p.highlights,
      techStack: p.techStack,
      category: p.category,
      featured: p.featured,
      githubUrl: p.githubUrl ?? null,
      liveUrl: p.liveUrl ?? null,
      sortOrder: p.sortOrder ?? i,
    };
    console.log(`\nprojects/${p.id} (${p.title})`);
    const [row] = await db.select().from(projectsTable).where(eq(projectsTable.id, p.id));
    if (!row) {
      console.log("  + Not in database, inserting.");
      if (!dryRun) await db.insert(projectsTable).values({ id: p.id, ...desired });
      changed++;
      continue;
    }
    const fields = diff(row as any, desired);
    if (fields.length === 0) {
      console.log("  ✓ Already applied.");
      skipped++;
      continue;
    }
    for (const f of fields) console.log(`  ${f}: ${JSON.stringify((row as any)[f])} -> ${JSON.stringify((desired as any)[f])}`);
    if (!dryRun) {
      await db.update(projectsTable).set(desired).where(eq(projectsTable.id, p.id));
      const [check] = await db.select().from(projectsTable).where(eq(projectsTable.id, p.id));
      if (diff(check as any, desired).length > 0) {
        console.error("  ✗ Write did not stick, check manually.");
        process.exitCode = 1;
        continue;
      }
      console.log("  ✓ Applied and verified.");
    }
    changed++;
  }

  console.log(`\n${changed} ${dryRun ? "would change" : "updated"}, ${skipped} already applied.`);
}

main()
  .catch((err) => {
    console.error("✗ Failed:", err.message);
    process.exit(1);
  })
  .finally(() => pool.end());
