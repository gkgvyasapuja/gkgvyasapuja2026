import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

/** Known app log types; the column accepts any string for future types. */
export type AppLogType = "doc_parse" | "doc_ai_analysis";

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
  stateId: uuid("state_id").notNull(),
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
  /** Nullable: when the devotee selects "Other" for temple, this is left null and `otherTempleName` holds the proposed name until admin/maintainer approval. */
  templeId: uuid("temple_id"),
  /** Free-text temple name supplied when the devotee chose "Other"; cleared once the matching `temple_request` is approved. */
  otherTempleName: varchar("other_temple_name", { length: 255 }),

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

export const maintainers = pgTable("maintainer", {
  id: uuid("id").primaryKey().defaultRandom(),
  loginId: varchar("login_id", { length: 64 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  label: varchar("label", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const offerings = pgTable("offering", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: uuid("user_id").notNull(),
  year: varchar("year", { length: 255 }).notNull(),

  offering: text("offering").notNull(),

  /** Public URL of the uploaded .docx in S3. */
  documentUrl: varchar("document_url", { length: 2048 }),

  language: varchar("language", { length: 255 })
    .$type<"Hindi" | "English">()
    .notNull(),

  /** Internal staff note (admin/maintainer only). */
  note: text("note"),

  /** Manual review flag — green row when set (admin/maintainer). */
  markedEditedAt: timestamp("marked_edited_at"),
  markedEditedByRole: varchar("marked_edited_by_role", {
    length: 32,
  }).$type<"admin" | "maintainer" | null>(),
  markedEditedByMaintainerId: uuid("marked_edited_by_maintainer_id").references(
    () => maintainers.id,
    { onDelete: "set null" },
  ),

  /** Last time staff changed offering content (audit; does not affect row color). */
  lastEditedAt: timestamp("last_edited_at"),
  lastEditedByRole: varchar("last_edited_by_role", { length: 32 }).$type<
    "admin" | "maintainer" | null
  >(),
  lastEditedByMaintainerId: uuid("last_edited_by_maintainer_id").references(
    () => maintainers.id,
    { onDelete: "set null" },
  ),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/** Admin-uploaded files in S3; `public_url` is the public HTTPS URL (bucket policy must allow read). */
export const adminMedia = pgTable("admin_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  s3Key: varchar("s3_key", { length: 1024 }).notNull(),
  publicUrl: varchar("public_url", { length: 2048 }).notNull(),
  fileName: varchar("file_name", { length: 512 }).notNull(),
  contentType: varchar("content_type", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

/** Devotee-submitted "Other" temple proposals awaiting admin/maintainer review. */
export const templeRequests = pgTable("temple_request", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  /** Proposed temple name as typed by the devotee. */
  name: varchar("name", { length: 255 }).notNull(),

  countryId: uuid("country_id").notNull(),
  stateId: uuid("state_id").notNull(),
  cityId: uuid("city_id").notNull(),

  status: varchar("status", { length: 32 })
    .$type<"pending" | "approved" | "rejected">()
    .notNull()
    .default("pending"),

  /** On approval: the temple row that was created (or matched) from this request. */
  approvedTempleId: uuid("approved_temple_id").references(() => temples.id, {
    onDelete: "set null",
  }),

  reviewedAt: timestamp("reviewed_at"),
  reviewerRole: varchar("reviewer_role", { length: 32 }).$type<
    "admin" | "maintainer" | null
  >(),
  reviewerMaintainerId: uuid("reviewer_maintainer_id").references(
    () => maintainers.id,
    { onDelete: "set null" },
  ),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/** Performance and timing logs for upload flows and other app events. */
export const appLogs = pgTable("app_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  logType: varchar("log_type", { length: 64 })
    .notNull()
    .$type<AppLogType>(),
  /** Elapsed time in milliseconds. */
  durationMs: integer("duration_ms").notNull(),
  success: boolean("success").default(true).notNull(),
  errorMessage: text("error_message"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/** Append-only log of staff edits to offerings. */
export const offeringEditLogs = pgTable("offering_edit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  offeringId: uuid("offering_id")
    .notNull()
    .references(() => offerings.id, { onDelete: "cascade" }),
  editedAt: timestamp("edited_at").defaultNow().notNull(),
  editorRole: varchar("editor_role", { length: 32 })
    .notNull()
    .$type<"admin" | "maintainer">(),
  maintainerId: uuid("maintainer_id").references(() => maintainers.id, {
    onDelete: "set null",
  }),
});
