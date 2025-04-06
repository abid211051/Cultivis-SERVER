import {
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const fieldPoly = pgTable("fields", {
  id: uuid().defaultRandom().primaryKey(),
  userId: varchar({ length: 25 }).notNull(),
  area: numeric().notNull(),
  geojson: jsonb().notNull(),
  image: text().default(""),
  editedAt: timestamp().defaultNow(),
});

export const cropInfo = pgTable("cropInfo", {
  id: uuid().defaultRandom().primaryKey(),
  fieldId: uuid()
    .notNull()
    .references(() => fieldPoly.id, { onDelete: "cascade" }),
  cropName: varchar({ length: 50 }).notNull(),
  cropType: varchar({ length: 50 }),
  maturityDay: numeric().notNull(),
  sowing: timestamp().notNull(),
  harvesting: timestamp(),
  soilType: varchar({ length: 30 }),
  soilMoist: numeric(),
  surfaceTemp: numeric(),
  ndvi: numeric(),
  ndwi: numeric(),
  lai: numeric(),
  editedAt: timestamp().defaultNow(),
});
