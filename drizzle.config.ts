import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/lib/drizzle/schema/index.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      'file:.wrangler/state/v3/d1/miniflare-D1DatabaseObject/reelroom.sqlite',
  },
})
