"use server";

import { revalidatePath } from "next/cache";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { adminMedia } from "@/db/schema";
import { requireAdminSession } from "@/lib/auth";
import { deleteObjectByKey, uploadAdminMediaFile } from "@/lib/s3";

const MEDIA_PAGE = "/admin-dashboard/media";

export async function listAdminMedia() {
  await requireAdminSession();
  return db
    .select()
    .from(adminMedia)
    .orderBy(desc(adminMedia.createdAt));
}

export type UploadAdminMediaResult =
  | { ok: true }
  | { ok: false; error: string };

const MAX_BYTES = 50 * 1024 * 1024;

export async function uploadAdminMediaAction(
  _prev: UploadAdminMediaResult | undefined,
  formData: FormData,
): Promise<UploadAdminMediaResult> {
  await requireAdminSession();

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false, error: "No file selected." };
  }
  if (file.size === 0) {
    return { ok: false, error: "The file is empty." };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: "File is too large (maximum 50 MB)." };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const { key, url } = await uploadAdminMediaFile({
      buffer,
      originalFileName: file.name,
      contentType: file.type || undefined,
    });

    await db.insert(adminMedia).values({
      s3Key: key,
      publicUrl: url,
      fileName: file.name.slice(0, 512),
      contentType: file.type ? file.type.slice(0, 255) : null,
    });

    revalidatePath(MEDIA_PAGE);
    return { ok: true };
  } catch (e) {
    console.error("uploadAdminMediaAction", e);
    return {
      ok: false,
      error:
        e instanceof Error ? e.message : "Upload failed. Check S3 configuration.",
    };
  }
}

export async function deleteAdminMediaAction(id: string): Promise<{ ok: boolean }> {
  await requireAdminSession();

  const [row] = await db
    .select()
    .from(adminMedia)
    .where(eq(adminMedia.id, id))
    .limit(1);

  if (!row) {
    return { ok: false };
  }

  try {
    await deleteObjectByKey(row.s3Key);
  } catch (e) {
    console.error("deleteAdminMediaAction S3", e);
  }

  await db.delete(adminMedia).where(eq(adminMedia.id, id));
  revalidatePath(MEDIA_PAGE);
  return { ok: true };
}
