import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import weather from "./weather/weather.js";
import map from "./map/map.js";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// All The Route Start Here
app.route("/weather", weather);
app.route("/map", map);

serve(
  {
    fetch: app.fetch,
    port: parseInt(process.env.PORT as string),
  },
  () => console.log("Server started at", process.env.PORT)
);
