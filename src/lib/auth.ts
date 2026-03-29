import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { maintainers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getAdminSession(): Promise<boolean> {
  const c = await cookies();
  return c.get("admin_session")?.value === "true";
}

export async function requireAdminSession(): Promise<void> {
  if (!(await getAdminSession())) {
    redirect("/admin");
  }
}

/** For API routes: same access as offerings UI (admin or valid maintainer). */
export async function canManageOfferings(): Promise<boolean> {
  if (await getAdminSession()) return true;

  const c = await cookies();
  const mid = c.get("maintainer_session")?.value;
  if (!mid) return false;

  const row = await db
    .select({ id: maintainers.id })
    .from(maintainers)
    .where(eq(maintainers.id, mid))
    .limit(1);

  return !!row[0];
}

export async function assertCanManageOfferings(): Promise<void> {
  if (await getAdminSession()) return;

  const c = await cookies();
  const mid = c.get("maintainer_session")?.value;
  if (!mid) {
    redirect("/admin");
  }

  const row = await db
    .select({ id: maintainers.id })
    .from(maintainers)
    .where(eq(maintainers.id, mid))
    .limit(1);

  if (!row[0]) {
    c.delete("maintainer_session");
    redirect("/maintainer");
  }
}

export async function requireMaintainerDashboardAccess(): Promise<string> {
  const c = await cookies();
  const mid = c.get("maintainer_session")?.value;
  if (!mid) {
    redirect("/maintainer");
  }

  const row = await db
    .select({ id: maintainers.id })
    .from(maintainers)
    .where(eq(maintainers.id, mid))
    .limit(1);

  if (!row[0]) {
    c.delete("maintainer_session");
    redirect("/maintainer");
  }

  return mid;
}
