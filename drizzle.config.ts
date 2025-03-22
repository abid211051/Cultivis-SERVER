import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({
  path: ".dev.vars",
});

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_URL!,
  },
});
