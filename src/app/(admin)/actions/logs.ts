"use server";

import { db } from "@/db";
import { appLogs, type AppLogType } from "@/db/schema";

export async function recordAppLog(input: {
  logType: AppLogType;
  durationMs: number;
  success?: boolean;
  errorMessage?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await db.insert(appLogs).values({
      logType: input.logType,
      durationMs: Math.max(0, Math.round(input.durationMs)),
      success: input.success ?? true,
      errorMessage: input.errorMessage,
      metadata: input.metadata,
    });
  } catch (error) {
    console.error("Failed to record app log:", error);
  }
}
