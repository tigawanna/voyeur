import { isAuthBypassEnabled } from "#/data-access-layer/auth/auth-bypass";
import { viewerMiddleware } from "#/data-access-layer/auth/viewer";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "./-components/AppShell";

export const Route = createFileRoute("/_app")({
  ssr: false,
  server: {
    middleware: [viewerMiddleware],
  },
  beforeLoad: ({ context, location, serverContext }) => {
    if (isAuthBypassEnabled()) {
      return;
    }

    if (!serverContext?.isServer && !context.viewer?.user) {
      throw redirect({
        to: "/login",
        search: { returnTo: location.pathname },
      });
    }
  },
  component: AppShell,
});
