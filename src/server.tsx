import handler, { createServerEntry } from "@tanstack/react-start/server-entry";
import { honoApp } from "#/server/api-routes";
import { runWithWorkerEnv } from "#/lib/worker-env";

type RequestContext = {
  isServer: true;
};

declare module "@tanstack/react-start" {
  interface Register {
    server: {
      requestContext: RequestContext;
    };
  }
}

type CloudflareServerEntry = {
  fetch: (
    request: Request,
    env: CloudflareBindings,
    ctx: ExecutionContext,
  ) => Promise<Response> | Response;
};

function isTmdbApiRoute(pathname: string) {
  return pathname.startsWith("/api/tmdb");
}

const serverEntry: CloudflareServerEntry = {
  async fetch(request, env, ctx) {
    const pathname = new URL(request.url).pathname;

    if (isTmdbApiRoute(pathname)) {
      return honoApp.fetch(request, env, ctx);
    }

    return runWithWorkerEnv(env, () => handler.fetch(request));
  },
};

export default createServerEntry(serverEntry as unknown as Parameters<typeof createServerEntry>[0]);
