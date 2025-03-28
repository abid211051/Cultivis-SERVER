import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const fieldPoly = pgTable("fields", {
  id: uuid().defaultRandom().primaryKey(),
  userId: varchar({ length: 25 }).notNull(),
  polygon: jsonb().notNull(),
  image: text().default(""),
  croptype: varchar({ length: 50 }).default("Add Crop").notNull(),
  editedat: timestamp().defaultNow(),
});
