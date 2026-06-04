/**
 * One-off, idempotent migration of the LIVE experiences content.
 *
 * Adds two new entries (MainCard, CoursePick), edits Hopin, and renumbers
 * sortOrder so the list reads reverse-chronological. Safe to re-run: new rows
 * are upserted by id; existing rows are updated in place.
 *
 * Run locally with your production connection string (keeps the secret on your
 * machine, never in chat):
 *
 *   cd ~/portfolio-website
 *   npm install                      # first time only — installs tsx/pg/drizzle
 *   DATABASE_URL='<DATABASE_PUBLIC_URL>' npx tsx script/apply-experience-updates.ts
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
import { eq, asc } from "drizzle-orm";
import { experiences } from "../shared/schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("✗ DATABASE_URL is not set. Aborting (no changes made).");
  process.exit(1);
}

const isLocal = /localhost|127\.0\.0\.1/.test(connectionString);
const sslDisabled = process.env.DB_SSL === "disable";
const pool = new pg.Pool({
  connectionString,
  // Railway's public proxy supports SSL; use it for any non-local connection.
  // Override with DB_SSL=disable if the proxy rejects SSL.
  ssl: isLocal || sslDisabled ? undefined : { rejectUnauthorized: false },
});
const db = drizzle(pool);

// --- New entries (upserted by id) ---
const newRows = [
  {
    id: "exp-maincard-ufc",
    role: "Contract Engineer",
    organization: "MainCard – Fantasy UFC platform",
    location: "Remote",
    startDate: "April 2026",
    endDate: "Present",
    bullets: [
      "Created a UFC fight-prediction system in Python, building the core modeling workflow, feature engineering logic, and Elo-based fighter ranking system to evaluate matchups from fight data, fighter statistics, and betting-market information.",
      "Developed data scrapers and preprocessing workflows for UFCStats, Sherdog, and BestFightOdds, turning raw fighter, fight, and odds data into features for model training.",
      "Corrected a critical label-ordering issue that inflated model accuracy, improving the pipeline and reported evaluation metrics.",
    ],
    sortOrder: 0,
  },
  {
    id: "exp-coursepick",
    role: "Founder & Full-Stack Developer",
    organization: "CoursePick",
    location: "Goleta, California",
    startDate: "January 2026",
    endDate: "Present",
    bullets: [
      "Built a PostgreSQL-backed course planning engine that helps UCSB students schedule classes by merging grade distributions, course data, and RateMyProfessors sentiment into a configurable ranking system.",
      "Created a multi-pass professor matching pipeline and a VADER + TF-IDF sentiment layer over scraped RMP GraphQL data and official UCSB grade CSVs, persisted to PostgreSQL.",
      "Deployed a 3-service Docker Compose stack (Postgres, Streamlit, APScheduler) on Neon-managed Postgres with GitHub Actions for CI gating, nightly schedule sync, and weekly DB backups.",
    ],
    sortOrder: 1,
  },
];

// --- In-place updates to existing rows (by id) ---
const updates: { id: string; set: Record<string, unknown> }[] = [
  { id: "exp-lastbite", set: { sortOrder: 2 } },
  { id: "92f293f4-f121-47a0-aa56-c0910081214f", set: { sortOrder: 3 } }, // MarzipAni
  { id: "exp-3", set: { sortOrder: 4 } }, // Go Baby Go
  {
    id: "d5cbd62d-3230-4029-9aa9-5d495e9f3bf8", // Hopin
    set: {
      role: "Summer SWE Intern",
      startDate: "June 2019",
      endDate: "September 2019",
      sortOrder: 5,
    },
  },
];

async function main() {
  for (const row of newRows) {
    await db
      .insert(experiences)
      .values(row)
      .onConflictDoUpdate({ target: experiences.id, set: row });
    console.log(`✓ upserted  ${row.organization} (${row.id})`);
  }

  for (const u of updates) {
    const res = await db.update(experiences).set(u.set).where(eq(experiences.id, u.id));
    console.log(`✓ updated   ${u.id} →`, u.set);
  }

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
