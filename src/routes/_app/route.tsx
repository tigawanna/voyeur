import { viewerMiddleware } from "#/data-access-layer/auth/viewer";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "./-components/AppShell";

export const Route = createFileRoute("/_app")({
  ssr: false,
  server: {
    middleware: [viewerMiddleware],
  },
  beforeLoad: ({ context, location, serverContext }) => {
    console.log("[voyeur:auth-bypass]", "_app:beforeLoad", {
      pathname: location.pathname,
      isServer: Boolean(serverContext?.isServer),
      authBypassEnabled: context.authBypassEnabled,
      hasViewer: Boolean(context.viewer?.user),
      viewerUserId: context.viewer?.user?.id ?? null,
    });

    if (context.authBypassEnabled) {
      console.log("[voyeur:auth-bypass]", "_app:beforeLoad:allow", {
        pathname: location.pathname,
        reason: "bypass",
      });
      return;
    }

    if (!serverContext?.isServer && !context.viewer?.user) {
      console.log("[voyeur:auth-bypass]", "_app:beforeLoad:redirect", {
        pathname: location.pathname,
        reason: "no-viewer-on-client",
      });
      throw redirect({
        to: "/login",
        search: { returnTo: location.pathname },
      });
    }

    console.log("[voyeur:auth-bypass]", "_app:beforeLoad:allow", {
      pathname: location.pathname,
      reason: context.viewer?.user ? "viewer" : "server-pass-through",
    });
  },
  component: AppShell,
});
