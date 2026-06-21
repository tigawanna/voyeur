function isTruthy(value: string | undefined) {
  return value === "true";
}

type AuthBypassSource =
  | "cloudflare:workers.BYPASS_AUTH"
  | "cloudflare:workers.VITE_BYPASS_AUTH"
  | "process.env.BYPASS_AUTH"
  | "process.env.VITE_BYPASS_AUTH"
  | "process.env.E2E";

type AuthBypassEnv = Pick<CloudflareBindings, "BYPASS_AUTH"> & {
  VITE_BYPASS_AUTH?: string;
};

export function isAuthBypassEnabledOnServer(
  env?: AuthBypassEnv,
  scope = "isAuthBypassEnabledOnServer",
) {
  const workerBypass = env?.BYPASS_AUTH;
  const workerViteBypass = env?.VITE_BYPASS_AUTH;
  const processBypass = process.env.BYPASS_AUTH;
  const processViteBypass = process.env.VITE_BYPASS_AUTH;
  const processE2e = process.env.E2E;

  let source: AuthBypassSource | null = null;

  if (isTruthy(workerBypass)) {
    source = "cloudflare:workers.BYPASS_AUTH";
  } else if (isTruthy(workerViteBypass)) {
    source = "cloudflare:workers.VITE_BYPASS_AUTH";
  } else if (isTruthy(processBypass)) {
    source = "process.env.BYPASS_AUTH";
  } else if (isTruthy(processViteBypass)) {
    source = "process.env.VITE_BYPASS_AUTH";
  } else if (isTruthy(processE2e)) {
    source = "process.env.E2E";
  }

  const enabled = source !== null;

  console.log("[voyeur:auth-bypass]", scope, {
    enabled,
    source,
    workerBypass: workerBypass ?? null,
    workerViteBypass: workerViteBypass ?? null,
    processBypass: processBypass ?? null,
    processViteBypass: processViteBypass ?? null,
    processE2e: processE2e ?? null,
  });

  return enabled;
}

export function canAccessApp(context: {
  viewer?: { user?: unknown };
  authBypassEnabled?: boolean;
}) {
  return Boolean(context.authBypassEnabled || context.viewer?.user);
}
