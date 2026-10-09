/**
 * One-off, idempotent migration of the LIVE experiences content.
 *
 * Deletes the MainCard entry and renumbers the remaining entries, preserving
 * their current live order. Safe to re-run: deleting a missing row is a no-op.
 *
 * Run locally with your production connection string (keeps the secret on your
 * machine, never in chat):
 *
 *   cd ~/portfolio-website
 *   DATABASE_URL='<DATABASE_PUBLIC_URL>' npx tsx script/remove-maincard-experience.ts
 *
 * IMPORTANT (Railway): use the *public* connection string, not the internal one.
 *   Railway → Postgres service → Variables tab → copy DATABASE_PUBLIC_URL
 *   (host looks like ...proxy.rlwy.net:PORT).
 *
 * If you hit "server does not support SSL connections", re-run with DB_SSL=disable.
 */
import "dotenv/config";
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq, asc } from "drizzle-orm";
import { experiences } from "../shared/schema";

const MAINCARD_ID = "exp-maincard-ufc";

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

async function main() {
  await db.transaction(async (tx) => {
    const deleted = await tx
      .delete(experiences)
      .where(eq(experiences.id, MAINCARD_ID))
      .returning({ id: experiences.id });
    console.log(
      deleted.length ? `✓ deleted   ${MAINCARD_ID}` : `• ${MAINCARD_ID} already absent`,
    );

    const remaining = await tx.select().from(experiences).orderBy(asc(experiences.sortOrder));
    for (let i = 0; i < remaining.length; i++) {
      await tx
        .update(experiences)
        .set({ sortOrder: i })
        .where(eq(experiences.id, remaining[i].id));
    }
    console.log(`✓ renumbered ${remaining.length} entries`);
  });

  console.log("\n=== Live experiences after migration ===");
  const all = await db.select().from(experiences).orderBy(asc(experiences.sortOrder));
  for (const e of all) {
    console.log(`  [${e.sortOrder}] ${e.role} @ ${e.organization} (${e.startDate}–${e.endDate})`);
  }

  await pool.end();
  console.log("\n✅ Done. Refresh hratchghanime.com/experience (client cache ~5 min).");
}

main().catch(async (err) => {
  console.error("✗ Migration failed:", err);
  await pool.end();
  process.exit(1);
});
