/**
 * One-off, idempotent migration of the LIVE experiences content.
 *
 * Adds the Altheros Capital entry at the top of the list and shifts every other
 * entry down, preserving their current live order. Also updates MainCard's role
 * and end date to match the resume (bullets are left untouched). Safe to re-run:
 * the new row is upserted by id and the rest are renumbered from their existing
 * sortOrder.
 *
 * Run locally with your production connection string (keeps the secret on your
 * machine, never in chat):
 *
 *   cd ~/portfolio-website
 *   DATABASE_URL='<DATABASE_PUBLIC_URL>' npx tsx script/add-altheros-experience.ts
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
import { experiences as staticExperiences } from "../shared/portfolio";

const ALTHEROS_ID = "exp-altheros-capital";
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

const altheros = staticExperiences.find((e) => e.id === ALTHEROS_ID);
const maincard = staticExperiences.find((e) => e.id === MAINCARD_ID);
if (!altheros || !maincard) {
  console.error(`✗ ${ALTHEROS_ID} or ${MAINCARD_ID} not found in shared/portfolio.ts. Aborting.`);
  process.exit(1);
}

async function main() {
  const row = { ...altheros!, sortOrder: 0 };

  await db.transaction(async (tx) => {
    await tx
      .insert(experiences)
      .values(row)
      .onConflictDoUpdate({ target: experiences.id, set: row });
    console.log(`✓ upserted  ${row.organization} (${row.id})`);

    const maincardSet = {
      role: maincard!.role,
      startDate: maincard!.startDate,
      endDate: maincard!.endDate,
    };
    await tx.update(experiences).set(maincardSet).where(eq(experiences.id, MAINCARD_ID));
    console.log(`✓ updated   ${MAINCARD_ID} →`, maincardSet);

    const others = (
      await tx.select().from(experiences).orderBy(asc(experiences.sortOrder))
    ).filter((e) => e.id !== ALTHEROS_ID);

    for (let i = 0; i < others.length; i++) {
      await tx
        .update(experiences)
        .set({ sortOrder: i + 1 })
        .where(eq(experiences.id, others[i].id));
    }
    console.log(`✓ renumbered ${others.length} existing entries`);
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
