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

export default app;
