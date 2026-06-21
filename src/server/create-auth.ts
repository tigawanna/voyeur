import { createDb } from "#/lib/drizzle/db";
import * as authSchema from "#/lib/drizzle/schema/auth-schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";

export function createAuth(env: CloudflareBindings) {
  const trustedOrigins = String(env.BETTER_AUTH_URL)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const db = createDb(env.DB);

  return betterAuth({
    database: drizzleAdapter(db, { provider: "sqlite", schema: authSchema }),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    basePath: "/api/auth",
    trustedOrigins,
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },
    user: {
      deleteUser: {
        enabled: true,
      },
    },
    plugins: [tanstackStartCookies()],
  });
}
