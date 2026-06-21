import { isAuthBypassEnabledOnServer } from "#/data-access-layer/auth/auth-bypass";
import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";

export const getRuntimeConfig = createServerFn({ method: "GET" }).handler(async () => {
  const authBypassEnabled = isAuthBypassEnabledOnServer(
    env as CloudflareBindings,
    "getRuntimeConfig",
  );

  console.log("[voyeur:auth-bypass]", "getRuntimeConfig:result", { authBypassEnabled });

  return { authBypassEnabled };
});
