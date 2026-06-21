function isTruthy(value: string | undefined) {
  return value === "true";
}

type AuthBypassEnv = Pick<CloudflareBindings, "BYPASS_AUTH"> & {
  VITE_BYPASS_AUTH?: string;
};

export function isAuthBypassEnabledOnServer(env?: AuthBypassEnv) {
  return (
    isTruthy(env?.BYPASS_AUTH) ||
    isTruthy(env?.VITE_BYPASS_AUTH) ||
    isTruthy(process.env.BYPASS_AUTH) ||
    isTruthy(process.env.VITE_BYPASS_AUTH) ||
    isTruthy(process.env.E2E)
  );
}

export function canAccessApp(context: {
  viewer?: { user?: unknown };
  authBypassEnabled?: boolean;
}) {
  return Boolean(context.authBypassEnabled || context.viewer?.user);
}
