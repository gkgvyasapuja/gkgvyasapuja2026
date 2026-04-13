/**
 * For each temple name that appears more than once, keeps one row (lexicographically
 * smallest id) and deletes the rest after reassigning users.temple_id.
 *
 *   npx tsx src/scripts/dedupe-temples-by-name.ts
 */

import { config } from "dotenv";
import { resolve } from "path";
import { eq } from "drizzle-orm";

config({ path: resolve(process.cwd(), ".env") });

async function main() {
  const { db, pool } = await import("../db/index");
  const { temples, users } = await import("../db/schema");

  const rows = await db.select().from(temples);
  const byName = new Map<string, typeof rows>();
  for (const t of rows) {
    if (!byName.has(t.name)) byName.set(t.name, []);
    byName.get(t.name)!.push(t);
  }

  let deleted = 0;
  let usersUpdated = 0;

  await db.transaction(async (tx) => {
    for (const [, list] of byName) {
      if (list.length <= 1) continue;
      list.sort((a, b) => a.id.localeCompare(b.id));
      const keeper = list[0]!;
      const duplicates = list.slice(1);

      for (const dup of duplicates) {
        const u = await tx
          .update(users)
          .set({ templeId: keeper.id })
          .where(eq(users.templeId, dup.id))
          .returning({ id: users.id });
        usersUpdated += u.length;

        await tx.delete(temples).where(eq(temples.id, dup.id));
        deleted += 1;
      }
    }
  });

  console.log(
    `Deduped temples by name: removed ${deleted} duplicate row(s), updated ${usersUpdated} user row(s).`,
  );
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
