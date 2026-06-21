import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/drizzle/schema/index.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      "file:.wrangler/state/v3/d1/miniflare-D1DatabaseObject/a36f84ea60804f30bb0c7f7cad9f5336a6cca0165abdab8b9241d93dbf0b6006.sqlite",
  },
});
