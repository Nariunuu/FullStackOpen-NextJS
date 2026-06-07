import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

const envFile = existsSync(".env.test") ? ".env.test" : ".env.local";
dotenv.config({ path: envFile });

export default defineConfig({
  schema: "./app/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
