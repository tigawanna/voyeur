import paginationCss from "#/components/pagination/pagination.css?url";
import type { TViewer } from "#/data-access-layer/auth/viewer";
import { viewerqueryOptions } from "#/data-access-layer/auth/viewer";
import { runtimeConfigQueryOptions } from "#/lib/runtime-config";
import { getRuntimeConfig } from "#/lib/runtime-config.functions";
import {
  TanstackQueryProvider,
  getTanstackQueryContext,
} from "#/lib/tanstack/query/query-provider";
import { AppDevtools } from "#/lib/tanstack/devtools/app-devtools";
import { NotFoundPage } from "#/routes/-components/NotFoundPage";
import appCss from "#/styles.css?url";
import { AppConfig } from "#/utils/system";
import { getAppUrl } from "#/lib/client-env";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/tanstack/router/theme-provider";
import type { QueryClient } from "@tanstack/react-query";
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from "@tanstack/react-router";

interface RouterContext {
  queryClient: QueryClient;
  viewer?: TViewer;
  authBypassEnabled?: boolean;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  notFoundComponent: NotFoundPage,
  loader: async () => getRuntimeConfig(),
  beforeLoad: async ({ context }) => {
    const [viewer, runtimeConfig] = await Promise.all([
      context.queryClient.ensureQueryData(viewerqueryOptions),
      context.queryClient.ensureQueryData(runtimeConfigQueryOptions),
    ]);

    return {
      viewer: viewer.data ?? undefined,
      authBypassEnabled: runtimeConfig.authBypassEnabled,
    };
  },
  head: () => {
    const ogImageUrl = `${getAppUrl()}/og.png`;

    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: AppConfig.name },
        { name: "description", content: AppConfig.description },
        { property: "og:type", content: "website" },
        { property: "og:title", content: AppConfig.name },
        { property: "og:description", content: AppConfig.description },
        { property: "og:image", content: ogImageUrl },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: AppConfig.name },
        { name: "twitter:description", content: AppConfig.description },
        { name: "twitter:image", content: ogImageUrl },
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "stylesheet", href: paginationCss },
        { rel: "icon", href: "/icon.svg", type: "image/svg+xml" },
        { rel: "icon", href: "/favicon.png", type: "image/png", sizes: "48x48" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
        { rel: "manifest", href: "/manifest.json" },
      ],
    };
  },
  component: RootDocument,
});

function RootDocument() {
  const { queryClient } = getTanstackQueryContext();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased wrap-anywhere">
        <ThemeProvider storageKey={AppConfig.themeStorageKey}>
          <TanstackQueryProvider queryClient={queryClient}>
            <TooltipProvider>
              <Outlet />
              <Toaster />
            </TooltipProvider>
            <AppDevtools />
          </TanstackQueryProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
