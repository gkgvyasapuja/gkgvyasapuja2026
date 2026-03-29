"use server";

import { assertCanManageOfferings } from "@/lib/auth";
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
import { eq, desc, and, asc, count, ilike, or, gte, lte } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// --- Country Actions ---

export async function getCountries() {
  return db.select().from(countries).orderBy(desc(countries.createdAt));
}

const DEFAULT_COUNTRIES_PAGE_SIZE = 20;
const MAX_COUNTRIES_PAGE_SIZE = 100;

export async function getCountriesPaginated(options?: {
  page?: number;
  pageSize?: number;
}) {
  const pageSize = Math.min(
    Math.max(options?.pageSize ?? DEFAULT_COUNTRIES_PAGE_SIZE, 1),
    MAX_COUNTRIES_PAGE_SIZE,
  );
  const page = Math.max(options?.page ?? 1, 1);
  const offset = (page - 1) * pageSize;

  const items = await db
    .select()
    .from(countries)
    .orderBy(desc(countries.createdAt))
    .limit(pageSize)
    .offset(offset);

  const countRows = await db.select({ total: count() }).from(countries);
  const total = Number(countRows[0]?.total ?? 0);
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages,
  };
}

const SEARCH_LIMIT = 25;

function sanitizeIlikePattern(q: string) {
  return q.replace(/[%_\\]/g, "").trim();
}

export async function searchCountries(query: string) {
  const safe = sanitizeIlikePattern(query);
  const base = db
    .select({ id: countries.id, name: countries.name })
    .from(countries);
  if (safe.length === 0) {
    return base.orderBy(asc(countries.name)).limit(SEARCH_LIMIT);
  }
  const pattern = `%${safe}%`;
  return base
    .where(ilike(countries.name, pattern))
    .orderBy(asc(countries.name))
    .limit(SEARCH_LIMIT);
}

export async function getCountryById(id: string) {
  const rows = await db
    .select({ id: countries.id, name: countries.name })
    .from(countries)
    .where(eq(countries.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function searchStates(
  query: string,
  options?: { countryId?: string },
) {
  const safe = sanitizeIlikePattern(query);
  const base = db
    .select({ id: states.id, name: states.name })
    .from(states);
  const countryFilter = options?.countryId
    ? eq(states.countryId, options.countryId)
    : undefined;
  if (safe.length === 0) {
    const q = countryFilter ? base.where(countryFilter) : base;
    return q.orderBy(asc(states.name)).limit(SEARCH_LIMIT);
  }
  const pattern = `%${safe}%`;
  const nameMatch = ilike(states.name, pattern);
  const whereExpr = countryFilter
    ? and(nameMatch, countryFilter)
    : nameMatch;
  return base
    .where(whereExpr)
    .orderBy(asc(states.name))
    .limit(SEARCH_LIMIT);
}

export async function getStateById(id: string) {
  const rows = await db
    .select({
      id: states.id,
      name: states.name,
      countryId: states.countryId,
    })
    .from(states)
    .where(eq(states.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function getCityById(id: string) {
  const rows = await db
    .select({
      id: cities.id,
      name: cities.name,
      stateId: cities.stateId,
    })
    .from(cities)
    .where(eq(cities.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function getTempleById(id: string) {
  const rows = await db
    .select({
      id: temples.id,
      name: temples.name,
      cityId: temples.cityId,
      stateId: temples.stateId,
    })
    .from(temples)
    .where(eq(temples.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function searchCities(
  query: string,
  options?: { stateId?: string; countryId?: string },
) {
  const safe = sanitizeIlikePattern(query);
  const joinBase = db
    .select({ id: cities.id, name: cities.name })
    .from(cities)
    .innerJoin(states, eq(cities.stateId, states.id));
  const conds = [];
  if (options?.stateId) conds.push(eq(cities.stateId, options.stateId));
  if (options?.countryId) conds.push(eq(states.countryId, options.countryId));
  if (safe.length === 0) {
    const whereClause = conds.length > 0 ? and(...conds) : undefined;
    const q = whereClause ? joinBase.where(whereClause) : joinBase;
    return q.orderBy(asc(cities.name)).limit(SEARCH_LIMIT);
  }
  const pattern = `%${safe}%`;
  conds.push(ilike(cities.name, pattern));
  const whereClause = and(...conds);
  return joinBase
    .where(whereClause)
    .orderBy(asc(cities.name))
    .limit(SEARCH_LIMIT);
}

export async function searchTemples(
  query: string,
  options?: { cityId?: string; stateId?: string },
) {
  const safe = sanitizeIlikePattern(query);
  const base = db
    .select({ id: temples.id, name: temples.name })
    .from(temples);
  const conds = [];
  if (options?.cityId) conds.push(eq(temples.cityId, options.cityId));
  if (options?.stateId) conds.push(eq(temples.stateId, options.stateId));
  if (safe.length === 0) {
    const whereClause = conds.length > 0 ? and(...conds) : undefined;
    const q = whereClause ? base.where(whereClause) : base;
    return q.orderBy(asc(temples.name)).limit(SEARCH_LIMIT);
  }
  const pattern = `%${safe}%`;
  conds.push(ilike(temples.name, pattern));
  const whereClause = and(...conds);
  return base
    .where(whereClause)
    .orderBy(asc(temples.name))
    .limit(SEARCH_LIMIT);
}

/** Resolve hierarchy labels for filter comboboxes when URL omits parent ids. */
export async function resolveOfferingFilterSelections(raw: {
  country?: string;
  state?: string;
  city?: string;
  temple?: string;
}) {
  const pCountry = raw.country;
  const pState = raw.state;
  const pCity = raw.city;
  const pTemple = raw.temple;

  let cityId = pCity;
  let stateId = pState;

  const templeRow = pTemple ? await getTempleById(pTemple) : null;
  if (templeRow) {
    if (!cityId) cityId = templeRow.cityId;
    if (!stateId) stateId = templeRow.stateId;
  }

  const cityRow = cityId ? await getCityById(cityId) : null;
  if (cityRow && !pState) stateId = cityRow.stateId;

  const stateRow = stateId ? await getStateById(stateId) : null;
  const countryId = pCountry ?? stateRow?.countryId;

  const [cRow, sRow, ciRow, tRow] = await Promise.all([
    countryId ? getCountryById(countryId) : null,
    stateId ? getStateById(stateId) : null,
    cityId ? getCityById(cityId) : null,
    pTemple ? getTempleById(pTemple) : null,
  ]);

  const toItem = (r: { id: string; name: string } | null) =>
    r ? { id: r.id, name: r.name } : null;

  return {
    filter: {
      countryId: pCountry,
      stateId: pState,
      cityId: pCity,
      templeId: pTemple,
    },
    initialSelections: {
      country: toItem(cRow),
      state: toItem(sRow),
      city: toItem(ciRow),
      temple: toItem(tRow),
    },
  };
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

export async function deleteCountry(id: string) {
  try {
    await db.delete(countries).where(eq(countries.id, id));
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

const DEFAULT_STATES_PAGE_SIZE = 20;
const MAX_STATES_PAGE_SIZE = 100;

export async function getStatesPaginated(options?: {
  countryId?: string;
  page?: number;
  pageSize?: number;
}) {
  const pageSize = Math.min(
    Math.max(options?.pageSize ?? DEFAULT_STATES_PAGE_SIZE, 1),
    MAX_STATES_PAGE_SIZE,
  );
  const page = Math.max(options?.page ?? 1, 1);
  const offset = (page - 1) * pageSize;

  const baseList = db.select().from(states);
  const listQuery = options?.countryId
    ? baseList.where(eq(states.countryId, options.countryId))
    : baseList;
  const items = await listQuery
    .orderBy(asc(states.name))
    .limit(pageSize)
    .offset(offset);

  const baseCount = db.select({ total: count() }).from(states);
  const countQuery = options?.countryId
    ? baseCount.where(eq(states.countryId, options.countryId))
    : baseCount;
  const countRows = await countQuery;
  const total = Number(countRows[0]?.total ?? 0);
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages,
  };
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

export async function deleteState(id: string) {
  try {
    await db.delete(states).where(eq(states.id, id));
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

const DEFAULT_CITIES_PAGE_SIZE = 20;
const MAX_CITIES_PAGE_SIZE = 100;

export async function getCitiesPaginated(options?: {
  countryId?: string;
  stateId?: string;
  page?: number;
  pageSize?: number;
}) {
  const pageSize = Math.min(
    Math.max(options?.pageSize ?? DEFAULT_CITIES_PAGE_SIZE, 1),
    MAX_CITIES_PAGE_SIZE,
  );
  const page = Math.max(options?.page ?? 1, 1);
  const offset = (page - 1) * pageSize;

  const conditions = [];
  if (options?.countryId) {
    conditions.push(eq(states.countryId, options.countryId));
  }
  if (options?.stateId) {
    conditions.push(eq(cities.stateId, options.stateId));
  }
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const joinBase = db
    .select({
      id: cities.id,
      name: cities.name,
      stateId: cities.stateId,
      stateName: states.name,
    })
    .from(cities)
    .innerJoin(states, eq(cities.stateId, states.id));

  const listQuery = whereClause ? joinBase.where(whereClause) : joinBase;
  const items = await listQuery
    .orderBy(asc(cities.name))
    .limit(pageSize)
    .offset(offset);

  const countJoin = db
    .select({ total: count() })
    .from(cities)
    .innerJoin(states, eq(cities.stateId, states.id));
  const countQuery = whereClause ? countJoin.where(whereClause) : countJoin;
  const countRows = await countQuery;
  const total = Number(countRows[0]?.total ?? 0);
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages,
  };
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

const DEFAULT_TEMPLES_PAGE_SIZE = 20;
const MAX_TEMPLES_PAGE_SIZE = 100;

export async function getTemplesPaginated(options?: {
  page?: number;
  pageSize?: number;
  search?: string;
}) {
  const pageSize = Math.min(
    Math.max(options?.pageSize ?? DEFAULT_TEMPLES_PAGE_SIZE, 1),
    MAX_TEMPLES_PAGE_SIZE,
  );
  const page = Math.max(options?.page ?? 1, 1);
  const offset = (page - 1) * pageSize;

  const safe = sanitizeIlikePattern(options?.search ?? "");
  const searchMatch =
    safe.length > 0
      ? or(
          ilike(temples.name, `%${safe}%`),
          ilike(cities.name, `%${safe}%`),
          ilike(states.name, `%${safe}%`),
        )
      : undefined;

  const joinBase = db
    .select({
      id: temples.id,
      name: temples.name,
      cityId: temples.cityId,
      stateId: temples.stateId,
      cityName: cities.name,
      stateName: states.name,
    })
    .from(temples)
    .innerJoin(cities, eq(temples.cityId, cities.id))
    .innerJoin(states, eq(temples.stateId, states.id));

  const listQuery = searchMatch ? joinBase.where(searchMatch) : joinBase;

  const items = await listQuery
    .orderBy(asc(temples.name))
    .limit(pageSize)
    .offset(offset);

  const countJoin = db
    .select({ total: count() })
    .from(temples)
    .innerJoin(cities, eq(temples.cityId, cities.id))
    .innerJoin(states, eq(temples.stateId, states.id));
  const countQuery = searchMatch ? countJoin.where(searchMatch) : countJoin;
  const countRows = await countQuery;
  const total = Number(countRows[0]?.total ?? 0);
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages,
  };
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

export async function deleteTemple(id: string) {
  try {
    await db.delete(temples).where(eq(temples.id, id));
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

const DEFAULT_OFFERINGS_PAGE_SIZE = 20;
const MAX_OFFERINGS_PAGE_SIZE = 100;

function parseIsoDateStart(s?: string) {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return undefined;
  const d = new Date(`${s}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function parseIsoDateEnd(s?: string) {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return undefined;
  const d = new Date(`${s}T23:59:59.999Z`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function buildOfferingWhereConditions(filters?: {
  countryId?: string;
  stateId?: string;
  cityId?: string;
  templeId?: string;
  language?: string;
  dateFrom?: string;
  dateTo?: string;
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
    conditions.push(eq(offerings.language, filters.language as "Hindi" | "English"));
  }
  const from = parseIsoDateStart(filters?.dateFrom);
  if (from) {
    conditions.push(gte(offerings.createdAt, from));
  }
  const to = parseIsoDateEnd(filters?.dateTo);
  if (to) {
    conditions.push(lte(offerings.createdAt, to));
  }

  return conditions.length > 0 ? and(...conditions) : undefined;
}

export async function getAdminOfferings(filters?: {
  countryId?: string;
  stateId?: string;
  cityId?: string;
  templeId?: string;
  language?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}) {
  await assertCanManageOfferings();

  const pageSize = Math.min(
    Math.max(filters?.pageSize ?? DEFAULT_OFFERINGS_PAGE_SIZE, 1),
    MAX_OFFERINGS_PAGE_SIZE,
  );
  const page = Math.max(filters?.page ?? 1, 1);
  const offset = (page - 1) * pageSize;

  const whereClause = buildOfferingWhereConditions(filters);

  const listQuery = db
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
        phone: users.phone,
        countryId: users.countryId,
        stateId: users.stateId,
        cityId: users.cityId,
        templeId: users.templeId,
      },
      countryName: countries.name,
      stateName: states.name,
      cityName: cities.name,
      templeName: temples.name,
    })
    .from(offerings)
    .innerJoin(users, eq(offerings.userId, users.id))
    .leftJoin(countries, eq(users.countryId, countries.id))
    .leftJoin(states, eq(users.stateId, states.id))
    .leftJoin(cities, eq(users.cityId, cities.id))
    .leftJoin(temples, eq(users.templeId, temples.id))
    .where(whereClause)
    .orderBy(desc(offerings.createdAt))
    .limit(pageSize)
    .offset(offset);

  const countQuery = db
    .select({ total: count() })
    .from(offerings)
    .innerJoin(users, eq(offerings.userId, users.id))
    .where(whereClause);

  const [items, countRows] = await Promise.all([listQuery, countQuery]);
  const total = Number(countRows[0]?.total ?? 0);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: total === 0 ? 0 : Math.ceil(total / pageSize),
  };
}

const MAX_EXPORT_ROWS = 10_000;

export async function getAdminOfferingsForExport(filters?: {
  countryId?: string;
  stateId?: string;
  cityId?: string;
  templeId?: string;
  language?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  /** Auth must be checked by the caller (e.g. API route via `canManageOfferings`). */
  const whereClause = buildOfferingWhereConditions(filters);

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
        phone: users.phone,
        countryId: users.countryId,
        stateId: users.stateId,
        cityId: users.cityId,
        templeId: users.templeId,
      },
      countryName: countries.name,
      stateName: states.name,
      cityName: cities.name,
      templeName: temples.name,
    })
    .from(offerings)
    .innerJoin(users, eq(offerings.userId, users.id))
    .leftJoin(countries, eq(users.countryId, countries.id))
    .leftJoin(states, eq(users.stateId, states.id))
    .leftJoin(cities, eq(users.cityId, cities.id))
    .leftJoin(temples, eq(users.templeId, temples.id))
    .where(whereClause)
    .orderBy(desc(offerings.createdAt))
    .limit(MAX_EXPORT_ROWS);
}

export type AdminOfferingExportRow = Awaited<
  ReturnType<typeof getAdminOfferingsForExport>
>[number];

export async function editOffering(
  id: string,
  data: { offering: string; language: "Hindi" | "English" },
) {
  await assertCanManageOfferings();

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
    revalidatePath("/maintainer-dashboard/offerings");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
