import { jsonb, pgTable, uuid } from "drizzle-orm/pg-core";

export const fieldPoly = pgTable("fields", {
  id: uuid().defaultRandom().primaryKey(),
  // userId: uuid().references(()=>users.id,{onDelete:'cascade'}),
  polygon: jsonb().notNull(),
});
