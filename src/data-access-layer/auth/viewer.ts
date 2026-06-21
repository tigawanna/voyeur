import { getSession } from "#/lib/auth.functions";
import { getAuth } from "#/lib/auth";
import { bypassViewer, isAuthBypassEnabled } from "#/data-access-layer/auth/auth-bypass";
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
  const viewerQuery = useSuspenseQuery(viewerqueryOptions);

  return {
    viewerQuery,
    viewer: {
      user: viewerQuery.data.data?.user,
      session: viewerQuery.data.data?.session,
    },
    logoutMutation,
  } as const;
}

export const viewerMiddleware = createMiddleware().server(async ({ next, request }) => {
  if (isAuthBypassEnabled()) {
    return await next({
      context: {
        viewer: bypassViewer,
      },
    });
  }

  const session = await getAuth().api.getSession({ headers: request.headers });
  if (!session) {
    const pathname = safeStringToUrl(request.url)?.pathname ?? "/";
    const returnTo = pathname === "/login" ? "/movies" : pathname;
    throw redirect({ to: "/login", search: { returnTo } });
  }
  return await next({
    context: {
      viewer: { user: session.user, session: session.session },
    },
  });
});
