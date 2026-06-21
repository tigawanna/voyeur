import { isAuthBypassEnabledOnServer } from "#/data-access-layer/auth/auth-bypass";
import { getWorkerEnv } from "#/lib/worker-env";
import { createServerFn } from "@tanstack/react-start";

export const getRuntimeConfig = createServerFn({ method: "GET" }).handler(async () => {
  const workerEnv = getWorkerEnv();
  const authBypassEnabled = isAuthBypassEnabledOnServer(workerEnv, "getRuntimeConfig");

  console.log("[voyeur:auth-bypass]", "getRuntimeConfig:result", {
    authBypassEnabled,
    bindingKeys: Object.keys(workerEnv).filter((key) => key.includes("BYPASS") || key.includes("AUTH")),
  });

  return { authBypassEnabled };
});
