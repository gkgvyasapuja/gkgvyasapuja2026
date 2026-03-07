import {
  boolean,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const countries = pgTable("country", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  numericCode: varchar("numeric_code", { length: 10 }),
  phoneCode: varchar("phone_code", { length: 20 }),
  currencyCode: varchar("currency_code", { length: 10 }),
  CurrencyName: varchar("currency_name", { length: 255 }),
  CurrencySymbol: varchar("currency_symbol", { length: 20 }),
  nationality: varchar("nationality", { length: 255 }),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const states = pgTable("state", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  countryId: uuid("country_id").notNull(),
});

export const cities = pgTable("city", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  stateId: uuid("state_id").notNull(),
});

export const temples = pgTable("temple", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  cityId: uuid("city_id").notNull(),
});

export const users = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),

  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),

  gender: varchar("gender", { length: 255 })
    .$type<"male" | "female" | "other">()
    .notNull(),

  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 255 }).notNull(),

  countryId: uuid("country_id").notNull(),
  stateId: uuid("state_id").notNull(),
  cityId: uuid("city_id").notNull(),

  initiated: boolean("initiated").default(false).notNull(),

  initiationType: varchar("initiation_type", { length: 255 }).notNull(),
  initiationYear: varchar("initiation_year", { length: 255 }).notNull(),

  initiatedName: varchar("initiated_name", { length: 255 }).notNull(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const books = pgTable("book", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),

  thumbnail: varchar("thumbnail", { length: 255 }).notNull(),
  viewUrl: varchar("view_url", { length: 255 }).notNull(),
  downloadUrl: varchar("download_url", { length: 255 }).notNull(),

  publishedYear: varchar("published_year", { length: 255 }).notNull(),

  downloadCount: integer("download_count").default(0).notNull(),
  viewCount: integer("view_count").default(0).notNull(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const offerings = pgTable("offering", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: uuid("user_id").notNull(),
  year: varchar("year", { length: 255 }).notNull(),

  offering: varchar("offering", { length: 10000 }).notNull(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
