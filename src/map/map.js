import { Hono } from "hono";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { fieldPoly } from "../db/schema/mapSchema.js";

const map = new Hono();

map.post("/createpoly", async (c) => {
  try {
    const pgsql = neon(c.env.DB_URL);
    const db = drizzle({ client: pgsql });
    const reqobj = await c.req.json();
    const result = await db
      .insert(fieldPoly)
      .values({ corrdinates: reqobj })
      .returning();
    return c.json(result);
  } catch (error) {
    return c.json({ error: error?.message });
  }
});

export default map;
