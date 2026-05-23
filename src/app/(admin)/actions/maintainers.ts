"use server";

import { db } from "@/db";
import { maintainers } from "@/db/schema";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/password";

async function requireAdminForMaintainerActions() {
  if (!(await getAdminSession())) {
    redirect("/admin");
  }
}

function normalizeMaintainerEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const email = raw.trim().toLowerCase();
  if (!email || email.length > 64) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

function validateMaintainerPassword(raw: unknown): string | null {
  if (typeof raw !== "string" || raw.length < 8) return null;
  return raw;
}

export async function getMaintainersList() {
  await requireAdminForMaintainerActions();
  return db
    .select({
      id: maintainers.id,
      loginId: maintainers.loginId,
      label: maintainers.label,
      createdAt: maintainers.createdAt,
    })
    .from(maintainers)
    .orderBy(desc(maintainers.createdAt));
}

export async function createMaintainer(
  _prevState: unknown,
  formData: FormData,
) {
  await requireAdminForMaintainerActions();

  const labelRaw = formData.get("label");
  const label =
    typeof labelRaw === "string" && labelRaw.trim().length > 0
      ? labelRaw.trim()
      : null;

  const email = normalizeMaintainerEmail(formData.get("email"));
  if (!email) {
    return {
      success: false as const,
      error: "Please enter a valid email address.",
    };
  }

  const password = validateMaintainerPassword(formData.get("password"));
  if (!password) {
    return {
      success: false as const,
      error: "Password must be at least 8 characters.",
    };
  }

  const passwordHash = hashPassword(password);

  try {
    await db.insert(maintainers).values({
      loginId: email,
      passwordHash,
      label,
    });
    revalidatePath("/admin-dashboard/maintainers");
    return { success: true as const };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "";
    if (message.includes("unique") || message.includes("duplicate")) {
      return {
        success: false as const,
        error: "A maintainer with this email already exists.",
      };
    }
    return {
      success: false as const,
      error: "Could not create maintainer. Try again.",
    };
  }
}

export async function updateMaintainer(
  _prevState: unknown,
  formData: FormData,
) {
  await requireAdminForMaintainerActions();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { success: false as const, error: "Missing maintainer id." };
  }

  const labelRaw = formData.get("label");
  const label =
    typeof labelRaw === "string" && labelRaw.trim().length > 0
      ? labelRaw.trim()
      : null;

  const passwordRaw = formData.get("password");
  const password =
    typeof passwordRaw === "string" && passwordRaw.length > 0
      ? passwordRaw
      : null;

  if (password !== null && password.length < 8) {
    return {
      success: false as const,
      error: "Password must be at least 8 characters.",
    };
  }

  if (password) {
    const passwordHash = hashPassword(password);
    await db
      .update(maintainers)
      .set({
        label,
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(maintainers.id, id));
    revalidatePath("/admin-dashboard/maintainers");
    return { success: true as const };
  }

  await db
    .update(maintainers)
    .set({
      label,
      updatedAt: new Date(),
    })
    .where(eq(maintainers.id, id));
  revalidatePath("/admin-dashboard/maintainers");
  return { success: true as const };
}

export async function deleteMaintainer(id: string) {
  await requireAdminForMaintainerActions();
  try {
    await db.delete(maintainers).where(eq(maintainers.id, id));
    revalidatePath("/admin-dashboard/maintainers");
    return { success: true as const };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Could not delete.";
    return { success: false as const, error: message };
  }
}

export async function loginMaintainer(prevState: unknown, formData: FormData) {
  const email = normalizeMaintainerEmail(formData.get("email"));
  const password = formData.get("password");

  if (!email || typeof password !== "string") {
    return { error: "Invalid credentials" };
  }

  const rows = await db
    .select()
    .from(maintainers)
    .where(sql`lower(${maintainers.loginId}) = ${email}`)
    .limit(1);

  const row = rows[0];
  if (!row || !verifyPassword(password, row.passwordHash)) {
    return { error: "Invalid credentials" };
  }

  const cookieStore = await cookies();
  cookieStore.set("maintainer_session", row.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  redirect("/maintainer-dashboard/offerings");
}

export async function logoutMaintainer() {
  const c = await cookies();
  c.delete("maintainer_session");
  redirect("/maintainer");
}
