/**
 * One-off, idempotent migration of the LIVE about-page copy, reflecting that
 * Hratch has graduated from UCSB.
 *
 *   personal_info.intro : "a senior at UCSB"          -> "a UCSB graduate"
 *   about_info.bio      : "a Data Science student at" -> "a Data Science graduate from"
 *
 * Safe to re-run: it rewrites only those phrases and reports "already applied"
 * for any value that no longer contains them.
 *
 * Run locally with your production connection string (keeps the secret on your
 * machine, never in chat):
 *
 *   cd ~/portfolio-website
 *   DATABASE_URL='<DATABASE_PUBLIC_URL>' npx tsx script/apply-graduate-updates.ts
 *
 * IMPORTANT (Railway): use the *public* connection string, not the internal one.
 *   Railway → Postgres service → Variables tab → copy DATABASE_PUBLIC_URL
 *   (host looks like ...proxy.rlwy.net:PORT). The plain DATABASE_URL points at
 *   postgres.railway.internal and only resolves inside Railway's network.
 *
 * If you hit "server does not support SSL connections", re-run with DB_SSL=disable.
 */
import "dotenv/config";
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { personalInfo, aboutInfo } from "../shared/schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("✗ DATABASE_URL is not set. Aborting (no changes made).");
  process.exit(1);
}

const isLocal = /localhost|127\.0\.0\.1/.test(connectionString);
const sslDisabled = process.env.DB_SSL === "disable";
const pool = new pg.Pool({
  connectionString,
  ssl: isLocal || sslDisabled ? undefined : { rejectUnauthorized: false },
});
const db = drizzle(pool);

const EDITS = [
  {
    label: "personal_info.intro",
    table: personalInfo,
    idCol: personalInfo.id,
    field: "intro" as const,
    old: "a senior at UCSB",
    new: "a UCSB graduate",
  },
  {
    label: "about_info.bio",
    table: aboutInfo,
    idCol: aboutInfo.id,
    field: "bio" as const,
    old: "a Data Science student at UC Santa Barbara",
    new: "a Data Science graduate from UC Santa Barbara",
  },
];

async function main() {
  let changed = 0;
  let skipped = 0;

  for (const edit of EDITS) {
    console.log(`\n${edit.label}`);
    const [row] = await db.select().from(edit.table as any).where(eq(edit.idCol, "main"));
    if (!row) {
      console.error(`  \u2717 No row with id='main'. Skipping (no changes made).`);
      continue;
    }

    const current = (row as any)[edit.field] as string;
    console.log(`  before: ${current}`);

    if (!current.includes(edit.old)) {
      console.log(`  \u2713 Already applied (no "${edit.old}"). No change.`);
      skipped++;
      continue;
    }

    const updated = current.replace(edit.old, edit.new);
    await db.update(edit.table as any).set({ [edit.field]: updated }).where(eq(edit.idCol, "main"));

    const [check] = await db.select().from(edit.table as any).where(eq(edit.idCol, "main"));
    const after = (check as any)[edit.field] as string;
    console.log(`  after:  ${after}`);
    if (after === updated) {
      console.log("  \u2713 Applied and verified.");
      changed++;
    } else {
      console.error("  \u2717 Write did not stick \u2014 check manually.");
      process.exitCode = 1;
    }
  }

  console.log(`\n${changed} updated, ${skipped} already applied.`);
}

main()
  .catch((err) => {
    console.error("\u2717 Failed:", err.message);
    process.exit(1);
  })
  .finally(() => pool.end());
