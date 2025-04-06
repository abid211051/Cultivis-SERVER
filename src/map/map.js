import { Hono } from "hono";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { cropInfo, fieldPoly } from "../db/schema/mapSchema.js";
import { eq, ne } from "drizzle-orm";

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
        area: reqobj.area,
        geojson: reqobj.geojson,
        image: "",
      })
      .returning({
        id: fieldPoly.id,
        area: fieldPoly.area,
        geojson: fieldPoly.geojson,
        image: fieldPoly.image,
      });
    if (result?.length < 1) {
      throw Error("Something Went Wrong");
    }
    const retunobj = {
      ...result[0],
      cropName: null,
      cropType: null,
      maturityDay: null,
      sowing: null,
      harvesting: null,
      soilType: null,
      soilMoist: null,
      surfaceTemp: null,
      ndvi: null,
      ndwi: null,
      lai: null,
      editedAt: null,
    };
    return c.json(retunobj);
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
        area: fieldPoly.area,
        geojson: fieldPoly.geojson,
        image: fieldPoly.image,
        cropName: cropInfo.cropName,
        cropType: cropInfo.cropType,
        maturityDay: cropInfo.maturityDay,
        sowing: cropInfo.sowing,
        harvesting: cropInfo.harvesting,
        soilType: cropInfo.soilType,
        soilMoist: cropInfo.soilMoist,
        surfaceTemp: cropInfo.surfaceTemp,
        ndvi: cropInfo.ndvi,
        ndwi: cropInfo.ndwi,
        lai: cropInfo.lai,
        editedAt: cropInfo.editedAt,
      })
      .from(fieldPoly)
      .leftJoin(cropInfo, eq(fieldPoly.id, cropInfo.fieldId))
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
      .returning({
        id: fieldPoly.id,
        area: fieldPoly.area,
        geojson: fieldPoly.geojson,
      });

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

map.post("/setcropinfo", async (c) => {
  try {
    const body = await c.req.json();
    const db = connectdb(c);
    const cropdata = await db
      .insert(cropInfo)
      .values({
        fieldId: body.fieldId,
        cropName: body.cropname,
        maturityDay: body.maturity,
        cropType: body.croptype,
        sowing: new Date(body.sowing),
        harvesting: new Date(body.harvesting) || null,
        editedAt: new Date(),
      })
      .returning({
        cropId: cropInfo.id,
        cropName: cropInfo.cropName,
        cropType: cropInfo.cropType,
        maturityDay: cropInfo.maturityDay,
        sowing: cropInfo.sowing,
        harvesting: cropInfo.harvesting,
        soilType: cropInfo.soilType,
        soilMoist: cropInfo.soilMoist,
        surfaceTemp: cropInfo.surfaceTemp,
        ndvi: cropInfo.ndvi,
        ndwi: cropInfo.ndwi,
        lai: cropInfo.lai,
        editedAt: cropInfo.editedAt,
      });
    return c.json(cropdata[0]);
  } catch (error) {
    console.log(error);

    return c.json({ error: error?.message });
  }
});
export default map;
