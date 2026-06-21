import { createAuthClient } from "better-auth/react";
import { clientEnv } from "#/lib/client-env";

export const authClient = createAuthClient({
  baseURL: clientEnv.VITE_APP_URL,
  basePath: "/api/auth",
});

export type BetterAuthSession = typeof authClient.$Infer.Session;
