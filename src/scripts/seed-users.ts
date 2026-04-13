import { readFileSync } from "fs";
import { resolve } from "path";
import { config } from "dotenv";
import { eq } from "drizzle-orm";

config({ path: resolve(process.cwd(), ".env") });

type JsonUserRow = {
  Id: string;
  FirstName: string;
  LastName: string;
  Gender: string;
  Status?: string;
  Email: string | null;
  PhoneNumber: string | null;
  CountryId: string;
  StateId: string;
  CityId: string;
  CreatedOn?: string;
};

type JsonCity = {
  id: string;
  name: string;
  state_name: string;
  country_name: string;
};

function stateLookupKey(countryName: string, stateName: string) {
  return `${countryName}\n${stateName}`;
}

function extractUsersFromExport(raw: string): JsonUserRow[] {
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error("Expected users export to be a JSON array");
  }

  const table = parsed.find(
    (x): x is { type: string; name: string; data: JsonUserRow[] } =>
      typeof x === "object" &&
      x !== null &&
      "type" in x &&
      (x as { type: string }).type === "table" &&
      "name" in x &&
      (x as { name: string }).name === "users" &&
      "data" in x &&
      Array.isArray((x as { data: unknown }).data),
  );

  if (table) {
    return table.data;
  }

  if (
    parsed.length > 0 &&
    typeof parsed[0] === "object" &&
    parsed[0] !== null &&
    "Email" in parsed[0] &&
    "CityId" in parsed[0] &&
    !("type" in parsed[0])
  ) {
    return parsed as JsonUserRow[];
  }

  throw new Error(
    'Could not find users rows: expected phpMyAdmin export with type "table" and name "users", or a flat array of user objects.',
  );
}

function extractCitiesFromExport(raw: string): JsonCity[] {
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error("Expected cities export to be a JSON array");
  }

  const table = parsed.find(
    (x): x is { type: string; name: string; data: JsonCity[] } =>
      typeof x === "object" &&
      x !== null &&
      "type" in x &&
      (x as { type: string }).type === "table" &&
      "name" in x &&
      (x as { name: string }).name === "cities" &&
      "data" in x &&
      Array.isArray((x as { data: unknown }).data),
  );

  if (table) {
    return table.data;
  }

  if (
    parsed.length > 0 &&
    typeof parsed[0] === "object" &&
    parsed[0] !== null &&
    "state_name" in parsed[0] &&
    "name" in parsed[0] &&
    !("type" in parsed[0])
  ) {
    return parsed as JsonCity[];
  }

  throw new Error(
    'Could not find cities rows: expected phpMyAdmin export with type "table" and name "cities", or a flat array.',
  );
}

function normalizeGender(g: string): "male" | "female" | "other" {
  const x = g.trim().toLowerCase();
  if (x === "male" || x === "female" || x === "other") return x;
  return "other";
}

function parseCreatedAt(s: string | undefined): Date | undefined {
  if (!s || s.startsWith("0000-00-00")) return undefined;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

const CHUNK = 100;

async function main() {
  const usersPath =
    process.argv[2] ??
    resolve(process.env.HOME ?? "", "Downloads/users (1).json");
  const citiesPath =
    process.argv[3] ?? resolve(process.env.HOME ?? "", "Downloads/cities.json");

  const userRows = extractUsersFromExport(readFileSync(usersPath, "utf-8"));
  const cityRowsFromFile = extractCitiesFromExport(readFileSync(citiesPath, "utf-8"));

  const legacyCityRow = new Map<string, JsonCity>();
  for (const c of cityRowsFromFile) {
    legacyCityRow.set(c.id, c);
  }

  const { db, pool } = await import("../db/index");
  const { countries, states, cities, temples, users } = await import("../db/schema");

  const countryRowsDb = await db
    .select({ id: countries.id, name: countries.name })
    .from(countries);
  const countryUuidByName = new Map<string, string>();
  for (const c of countryRowsDb) {
    countryUuidByName.set(c.name, c.id);
  }

  const stateJoinRows = await db
    .select({
      stateId: states.id,
      stateName: states.name,
      countryName: countries.name,
    })
    .from(states)
    .innerJoin(countries, eq(states.countryId, countries.id));

  const idsByKey = new Map<string, Set<string>>();
  for (const r of stateJoinRows) {
    const key = stateLookupKey(r.countryName, r.stateName);
    if (!idsByKey.has(key)) idsByKey.set(key, new Set());
    idsByKey.get(key)!.add(r.stateId);
  }

  const stateUuidByKey = new Map<string, string>();
  let duplicateStateKeys = 0;
  for (const [key, ids] of idsByKey) {
    const sorted = [...ids].sort();
    stateUuidByKey.set(key, sorted[0]!);
    if (sorted.length > 1) duplicateStateKeys += 1;
  }

  if (duplicateStateKeys > 0) {
    console.warn(
      `Warning: ${duplicateStateKeys} (country, state) key(s) have multiple "state" rows; using lexicographically smallest UUID per key.`,
    );
  }

  const allCities = await db
    .select({ id: cities.id, name: cities.name, stateId: cities.stateId })
    .from(cities);

  const cityUuidByStateAndName = new Map<string, string>();
  for (const c of allCities) {
    const k = `${c.stateId}\n${c.name}`;
    if (!cityUuidByStateAndName.has(k)) cityUuidByStateAndName.set(k, c.id);
  }

  const existingEmails = new Set(
    (
      await db.select({ email: users.email }).from(users)
    ).map((r) => r.email.trim().toLowerCase()),
  );

  const templesInCity = await db
    .select({ id: temples.id, cityId: temples.cityId })
    .from(temples)
    .orderBy(temples.name);

  const templeIdsByCity = new Map<string, string[]>();
  for (const t of templesInCity) {
    if (!templeIdsByCity.has(t.cityId)) templeIdsByCity.set(t.cityId, []);
    templeIdsByCity.get(t.cityId)!.push(t.id);
  }

  const templesInState = await db
    .select({ id: temples.id, stateId: temples.stateId })
    .from(temples)
    .orderBy(temples.name);

  const templeIdsByState = new Map<string, string[]>();
  for (const t of templesInState) {
    if (!templeIdsByState.has(t.stateId)) templeIdsByState.set(t.stateId, []);
    templeIdsByState.get(t.stateId)!.push(t.id);
  }

  type InsertUser = typeof users.$inferInsert;
  const values: InsertUser[] = [];
  const skipped: string[] = [];
  const seenEmail = new Set<string>();

  for (const u of userRows) {
    const emailRaw = u.Email?.trim();
    if (!emailRaw) {
      skipped.push(`legacy Id=${u.Id}: empty email`);
      continue;
    }
    const emailKey = emailRaw.toLowerCase();
    if (seenEmail.has(emailKey)) {
      skipped.push(`legacy Id=${u.Id}: duplicate email in file (${emailRaw})`);
      continue;
    }
    if (existingEmails.has(emailKey)) {
      skipped.push(`legacy Id=${u.Id}: email already in DB (${emailRaw})`);
      continue;
    }
    seenEmail.add(emailKey);

    const cityMeta = legacyCityRow.get(u.CityId);
    if (!cityMeta) {
      skipped.push(`legacy Id=${u.Id}: CityId=${u.CityId} not in cities.json`);
      continue;
    }

    const stateKey = stateLookupKey(cityMeta.country_name, cityMeta.state_name);
    const stateUuid = stateUuidByKey.get(stateKey);
    if (!stateUuid) {
      skipped.push(
        `legacy Id=${u.Id}: no DB state for city ${cityMeta.name} (${stateKey.replace("\n", " / ")})`,
      );
      continue;
    }

    const cityLookupKey = `${stateUuid}\n${cityMeta.name}`;
    const cityUuid = cityUuidByStateAndName.get(cityLookupKey);
    if (!cityUuid) {
      skipped.push(
        `legacy Id=${u.Id}: city "${cityMeta.name}" not found in DB for state`,
      );
      continue;
    }

    const countryUuid = countryUuidByName.get(cityMeta.country_name);
    if (!countryUuid) {
      skipped.push(
        `legacy Id=${u.Id}: country "${cityMeta.country_name}" not in DB (from city row)`,
      );
      continue;
    }

    let templeId: string | undefined = templeIdsByCity.get(cityUuid)?.[0];
    if (!templeId) {
      templeId = templeIdsByState.get(stateUuid)?.[0];
    }
    if (!templeId) {
      const [inserted] = await db
        .insert(temples)
        .values({
          name: `Imported (${cityMeta.name})`.slice(0, 255),
          cityId: cityUuid,
          stateId: stateUuid,
        })
        .returning({ id: temples.id });
      templeId = inserted?.id;
      if (templeId) {
        if (!templeIdsByCity.has(cityUuid)) templeIdsByCity.set(cityUuid, []);
        templeIdsByCity.get(cityUuid)!.push(templeId);
        if (!templeIdsByState.has(stateUuid)) templeIdsByState.set(stateUuid, []);
        templeIdsByState.get(stateUuid)!.push(templeId);
      }
    }
    if (!templeId) {
      skipped.push(`legacy Id=${u.Id}: could not resolve temple`);
      continue;
    }

    const phone = (u.PhoneNumber?.trim() || "—").slice(0, 255);
    const firstName = (u.FirstName || "—").trim().slice(0, 255) || "—";
    const lastName = (u.LastName || "—").trim().slice(0, 255) || "—";
    const createdAt = parseCreatedAt(u.CreatedOn);

    const row: InsertUser = {
      firstName,
      lastName,
      gender: normalizeGender(u.Gender || "other"),
      email: emailRaw.slice(0, 255),
      phone,
      countryId: countryUuid,
      stateId: stateUuid,
      cityId: cityUuid,
      templeId,
      initiated: false,
      initiationType: "Unknown",
      initiationYear: "Unknown",
      initiatedName: "—",
      ...(createdAt ? { createdAt, updatedAt: createdAt } : {}),
    };

    values.push(row);
  }

  for (let i = 0; i < values.length; i += CHUNK) {
    await db.insert(users).values(values.slice(i, i + CHUNK));
  }

  console.log(`Inserted ${values.length} user(s) from ${usersPath}`);
  if (skipped.length > 0) {
    console.warn(`Skipped ${skipped.length} row(s). First 30 reasons:`);
    console.warn(skipped.slice(0, 30).join("\n"));
  }

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
