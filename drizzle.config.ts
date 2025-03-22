import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_URL!,
  },
});
