"use server";

import {
  assertCanManageOfferings,
  getOfferingEditorContext,
} from "@/lib/auth";
import { db } from "@/db";
import {
  cities,
  countries,
  maintainers,
  states,
  templeRequests,
  temples,
  users,
} from "@/db/schema";
import { and, asc, count, desc, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { revalidatePath } from "next/cache";

const reviewerMaintainer = alias(maintainers, "reviewer_maintainer");

const ALLOWED_STATUSES = ["pending", "approved", "rejected"] as const;
export type TempleRequestStatus = (typeof ALLOWED_STATUSES)[number];

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

function normalizeStatus(value: string | undefined): TempleRequestStatus {
  return ALLOWED_STATUSES.find((s) => s === value) ?? "pending";
}

export async function getTempleRequests(filters?: {
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  await assertCanManageOfferings();

  const status = normalizeStatus(filters?.status);
  const pageSize = Math.min(
    Math.max(filters?.pageSize ?? DEFAULT_PAGE_SIZE, 1),
    MAX_PAGE_SIZE,
  );
  const page = Math.max(filters?.page ?? 1, 1);
  const offset = (page - 1) * pageSize;

  const whereClause = eq(templeRequests.status, status);

  /* Pending rows surface oldest-first (older requests reviewed sooner);
   * processed rows surface newest-first (most recent decisions on top). */
  const orderBy =
    status === "pending"
      ? asc(templeRequests.createdAt)
      : desc(templeRequests.reviewedAt);

  const items = await db
    .select({
      id: templeRequests.id,
      name: templeRequests.name,
      status: templeRequests.status,
      createdAt: templeRequests.createdAt,
      reviewedAt: templeRequests.reviewedAt,
      reviewerRole: templeRequests.reviewerRole,
      countryId: templeRequests.countryId,
      stateId: templeRequests.stateId,
      cityId: templeRequests.cityId,
      approvedTempleId: templeRequests.approvedTempleId,
      countryName: countries.name,
      stateName: states.name,
      cityName: cities.name,
      approvedTempleName: temples.name,
      reviewerLabel: reviewerMaintainer.label,
      reviewerLoginId: reviewerMaintainer.loginId,
      user: {
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        phone: users.phone,
        initiatedName: users.initiatedName,
      },
    })
    .from(templeRequests)
    .innerJoin(users, eq(templeRequests.userId, users.id))
    .leftJoin(countries, eq(templeRequests.countryId, countries.id))
    .leftJoin(states, eq(templeRequests.stateId, states.id))
    .leftJoin(cities, eq(templeRequests.cityId, cities.id))
    .leftJoin(temples, eq(templeRequests.approvedTempleId, temples.id))
    .leftJoin(
      reviewerMaintainer,
      eq(templeRequests.reviewerMaintainerId, reviewerMaintainer.id),
    )
    .where(whereClause)
    .orderBy(orderBy)
    .limit(pageSize)
    .offset(offset);

  const countRows = await db
    .select({ total: count() })
    .from(templeRequests)
    .where(whereClause);
  const total = Number(countRows[0]?.total ?? 0);

  const pendingRows = await db
    .select({ total: count() })
    .from(templeRequests)
    .where(eq(templeRequests.status, "pending"));
  const pendingTotal = Number(pendingRows[0]?.total ?? 0);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: total === 0 ? 0 : Math.ceil(total / pageSize),
    status,
    pendingTotal,
  };
}

export type TempleRequestRow = Awaited<
  ReturnType<typeof getTempleRequests>
>["items"][number];

function revalidateReviewPages() {
  revalidatePath("/admin-dashboard/temple-requests");
  revalidatePath("/maintainer-dashboard/temple-requests");
}

export async function approveTempleRequest(id: string) {
  await assertCanManageOfferings();

  try {
    const ctx = await getOfferingEditorContext();
    const reviewerRole = ctx.role === "admin" ? "admin" : "maintainer";
    const reviewerMaintainerId =
      ctx.role === "maintainer" ? ctx.maintainerId : null;
    const now = new Date();

    await db.transaction(async (tx) => {
      const [request] = await tx
        .select()
        .from(templeRequests)
        .where(eq(templeRequests.id, id))
        .limit(1);

      if (!request) {
        throw new Error("Request not found.");
      }
      if (request.status !== "pending") {
        throw new Error("This request has already been reviewed.");
      }

      const cleanName = request.name.trim();
      if (!cleanName) {
        throw new Error("Proposed temple name is empty.");
      }

      /* Re-use an existing temple in the same city if the name matches
       * case-insensitively to avoid duplicate rows. */
      const matchingTemples = await tx
        .select({ id: temples.id, name: temples.name })
        .from(temples)
        .where(eq(temples.cityId, request.cityId));
      const lowerName = cleanName.toLowerCase();
      let templeId = matchingTemples.find(
        (t) => t.name.trim().toLowerCase() === lowerName,
      )?.id;

      if (!templeId) {
        const [inserted] = await tx
          .insert(temples)
          .values({
            name: cleanName,
            cityId: request.cityId,
            stateId: request.stateId,
          })
          .returning({ id: temples.id });
        if (!inserted) {
          throw new Error("Failed to create the approved temple row.");
        }
        templeId = inserted.id;
      }

      await tx
        .update(users)
        .set({
          templeId,
          otherTempleName: null,
          updatedAt: now,
        })
        .where(eq(users.id, request.userId));

      await tx
        .update(templeRequests)
        .set({
          status: "approved",
          approvedTempleId: templeId,
          reviewedAt: now,
          reviewerRole,
          reviewerMaintainerId,
          updatedAt: now,
        })
        .where(eq(templeRequests.id, id));
    });

    revalidateReviewPages();
    revalidatePath("/admin-dashboard/temples");
    return { success: true as const };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not approve the request.";
    return { success: false as const, error: message };
  }
}

export async function rejectTempleRequest(id: string) {
  await assertCanManageOfferings();

  try {
    const ctx = await getOfferingEditorContext();
    const reviewerRole = ctx.role === "admin" ? "admin" : "maintainer";
    const reviewerMaintainerId =
      ctx.role === "maintainer" ? ctx.maintainerId : null;
    const now = new Date();

    await db.transaction(async (tx) => {
      const [request] = await tx
        .select({ status: templeRequests.status })
        .from(templeRequests)
        .where(eq(templeRequests.id, id))
        .limit(1);

      if (!request) {
        throw new Error("Request not found.");
      }
      if (request.status !== "pending") {
        throw new Error("This request has already been reviewed.");
      }

      /* On reject we keep the user's `otherTempleName` and null `templeId`
       * so they can edit/resubmit later if they choose. */
      await tx
        .update(templeRequests)
        .set({
          status: "rejected",
          reviewedAt: now,
          reviewerRole,
          reviewerMaintainerId,
          updatedAt: now,
        })
        .where(and(eq(templeRequests.id, id), eq(templeRequests.status, "pending")));
    });

    revalidateReviewPages();
    return { success: true as const };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not reject the request.";
    return { success: false as const, error: message };
  }
}
