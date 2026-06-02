"use server";

import { headers } from "next/headers";
import { db } from "@/db";
import { appLogs, type AppLogType } from "@/db/schema";
import {
  buildServerLogFields,
  mergeAppLogMetadata,
  type AppLogMetadata,
} from "@/lib/app-log-context";

export async function recordAppLog(input: {
  logType: AppLogType;
  durationMs: number;
  success?: boolean;
  errorMessage?: string;
  metadata?: AppLogMetadata;
}) {
  try {
    const headersList = await headers();
    const metadata = mergeAppLogMetadata(
      input.metadata,
      buildServerLogFields(headersList),
    );

    await db.insert(appLogs).values({
      logType: input.logType,
      durationMs: Math.max(0, Math.round(input.durationMs)),
      success: input.success ?? true,
      errorMessage: input.errorMessage,
      metadata,
    });
  } catch (error) {
    console.error("Failed to record app log:", error);
  }
}
