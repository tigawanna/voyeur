import { isAuthBypassEnabledOnServer } from "#/data-access-layer/auth/auth-bypass";
import { getWorkerEnv } from "#/lib/worker-env";
import { createServerFn } from "@tanstack/react-start";

export const getRuntimeConfig = createServerFn({ method: "GET" }).handler(async () => {
  return {
    authBypassEnabled: isAuthBypassEnabledOnServer(getWorkerEnv()),
  };
});
