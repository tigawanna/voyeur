import { getSession } from "#/lib/auth.functions";
import { getAuth } from "#/lib/auth";
import { isAuthBypassEnabledOnServer } from "#/data-access-layer/auth/auth-bypass";
import { getWorkerEnv } from "#/lib/worker-env";
import { authClient, type BetterAuthSession } from "#/lib/better-auth/client";
import { safeStringToUrl } from "#/utils/url";
import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";

type ViewerUser = BetterAuthSession["user"];
type ViewerSession = BetterAuthSession["session"];

export type TViewer = {
  user?: ViewerUser;
  session?: ViewerSession;
};

export const viewerqueryOptions = queryOptions({
  queryKey: ["viewer"],
  queryFn: async () => {
    const session = await getSession();
    if (!session) {
      return { data: null, error: null };
    }
    return {
      data: { user: session.user, session: session.session },
      error: null,
    };
  },
});

export function useViewer() {
  const queryClient = useQueryClient();
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await authClient.signOut();
      void queryClient.invalidateQueries(viewerqueryOptions);
      throw redirect({ to: "/login", search: { returnTo: "/" } });
    },
  });
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const result = await authClient.deleteUser({ callbackURL: "/" });
      if (result.error) {
        throw new Error(result.error.message ?? "Unable to delete account.");
      }
      void queryClient.invalidateQueries(viewerqueryOptions);
      throw redirect({ to: "/" });
    },
  });
  const viewerQuery = useSuspenseQuery(viewerqueryOptions);

  return {
    viewerQuery,
    viewer: {
      user: viewerQuery.data.data?.user,
      session: viewerQuery.data.data?.session,
    },
    logoutMutation,
    deleteAccountMutation,
  } as const;
}

export const viewerMiddleware = createMiddleware().server(async ({ next, request }) => {
  const pathname = safeStringToUrl(request.url)?.pathname ?? "/";
  const workerEnv = getWorkerEnv();
  const authBypassEnabled = isAuthBypassEnabledOnServer(workerEnv, "viewerMiddleware");

  if (authBypassEnabled) {
    console.log("[voyeur:auth-bypass]", "viewerMiddleware:allow", { pathname, reason: "bypass" });
    return await next();
  }

  const session = await getAuth().api.getSession({ headers: request.headers });
  if (!session) {
    const returnTo = pathname === "/login" ? "/movies" : pathname;
    console.log("[voyeur:auth-bypass]", "viewerMiddleware:redirect", {
      pathname,
      returnTo,
      reason: "no-session",
    });
    throw redirect({ to: "/login", search: { returnTo } });
  }

  console.log("[voyeur:auth-bypass]", "viewerMiddleware:allow", {
    pathname,
    reason: "session",
    userId: session.user.id,
  });

  return await next({
    context: {
      viewer: { user: session.user, session: session.session },
    },
  });
});
