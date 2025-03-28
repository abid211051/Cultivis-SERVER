import { Hono } from "hono";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { fieldPoly } from "../db/schema/mapSchema.js";
import { eq } from "drizzle-orm";

const map = new Hono();
function connectdb(c) {
  const pgsql = neon(c.env.DB_URL);
  const db = drizzle({ client: pgsql });
  return db;
}

map.post("/createpoly", async (c) => {
  try {
    const db = connectdb(c);
    const reqobj = await c.req.json();
    const result = await db
      .insert(fieldPoly)
      .values({
        userId: reqobj.userId,
        polygon: {
          area: reqobj.polygon.area || 0,
          coordinates: reqobj.polygon.coordinates || [],
          polyid: reqobj.polygon.polyid || "",
        },
        image: "",
      })
      .returning({
        id: fieldPoly.id,
        polygon: fieldPoly.polygon,
        image: fieldPoly.image,
        croptype: fieldPoly.croptype,
      });

    return c.json(result[0]);
  } catch (error) {
    return c.json({ error: error?.message });
  }
});
map.get("/getpoly/:userId", async (c) => {
  try {
    const { userId } = c.req.param();
    const db = connectdb(c);
    const field = await db
      .select({
        id: fieldPoly.id,
        polygon: fieldPoly.polygon,
        image: fieldPoly.image,
        croptype: fieldPoly.croptype,
      })
      .from(fieldPoly)
      .where(eq(fieldPoly.userId, userId));
    if (field.length > 0) {
      return c.json(field);
    }
    return c.json({ error: "Please Create a Field" });
  } catch (error) {
    return c.json({ error: error?.message });
  }
});

map.put("/editpoly/:id", async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();
    const db = connectdb(c);
    const updatedField = await db
      .update(fieldPoly)
      .set(body)
      .where(eq(fieldPoly.id, id))
      .returning({ id: fieldPoly.id, polygon: fieldPoly.polygon });
    console.log(updatedField);

    return c.json(updatedField[0]);
  } catch (error) {
    return c.json({ error: error?.message });
  }
});

map.delete("/deletepoly/:id", async (c) => {
  try {
    const { id } = c.req.param();
    const db = connectdb(c);
    const deleted = await db
      .delete(fieldPoly)
      .where(eq(fieldPoly.id, id))
      .returning({ id: fieldPoly.id });
    return c.json(deleted[0]);
  } catch (error) {
    return c.json({ error: error?.message });
  }
});
export default map;
