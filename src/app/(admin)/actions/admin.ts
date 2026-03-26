"use server";

import { db } from "@/db";
import {
  countries,
  states,
  cities,
  temples,
  books,
  offerings,
  users,
} from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// --- Country Actions ---

export async function getCountries() {
  return db.select().from(countries).orderBy(desc(countries.createdAt));
}

export async function addCountry(data: typeof countries.$inferInsert) {
  try {
    await db.insert(countries).values(data);
    revalidatePath("/admin-dashboard/countries");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- State Actions ---

export async function getStates() {
  // We want to fetch states along with their country mapping maybe, but simple get is fine for now
  return db.select().from(states);
}

export async function addState(data: typeof states.$inferInsert) {
  try {
    await db.insert(states).values(data);
    revalidatePath("/admin-dashboard/states");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- City Actions ---

export async function getCities() {
  return db.select().from(cities);
}

export async function addCity(data: typeof cities.$inferInsert) {
  try {
    await db.insert(cities).values(data);
    revalidatePath("/admin-dashboard/cities");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- Temple Actions ---

export async function getTemples() {
  return db.select().from(temples);
}

export async function addTemple(data: typeof temples.$inferInsert) {
  try {
    await db.insert(temples).values(data);
    revalidatePath("/admin-dashboard/temples");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- Book Actions ---

export async function getBooks() {
  return db.select().from(books).orderBy(desc(books.createdAt));
}

export async function addBook(data: typeof books.$inferInsert) {
  try {
    await db.insert(books).values({
      ...data,
      downloadCount: data.downloadCount ?? 0,
      viewCount: data.viewCount ?? 0,
    });
    revalidatePath("/admin-dashboard/books");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- Offerings Actions ---

export async function getAdminOfferings(filters?: {
  countryId?: string;
  stateId?: string;
  cityId?: string;
  templeId?: string;
  language?: string;
}) {
  const conditions = [];

  if (filters?.countryId) {
    conditions.push(eq(users.countryId, filters.countryId));
  }
  if (filters?.stateId) {
    conditions.push(eq(users.stateId, filters.stateId));
  }
  if (filters?.cityId) {
    conditions.push(eq(users.cityId, filters.cityId));
  }
  if (filters?.templeId) {
    conditions.push(eq(users.templeId, filters.templeId));
  }
  if (filters?.language) {
    conditions.push(eq(offerings.language, filters.language as any));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db
    .select({
      id: offerings.id,
      year: offerings.year,
      offering: offerings.offering,
      language: offerings.language,
      createdAt: offerings.createdAt,
      user: {
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        initiatedName: users.initiatedName,
        countryId: users.countryId,
        stateId: users.stateId,
        cityId: users.cityId,
        templeId: users.templeId,
      },
    })
    .from(offerings)
    .innerJoin(users, eq(offerings.userId, users.id))
    .where(whereClause)
    .orderBy(desc(offerings.createdAt));
}

export async function editOffering(
  id: string,
  data: { offering: string; language: "Hindi" | "English" },
) {
  try {
    await db
      .update(offerings)
      .set({
        offering: data.offering,
        language: data.language,
        updatedAt: new Date(),
      })
      .where(eq(offerings.id, id));

    revalidatePath("/admin-dashboard/offerings");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
