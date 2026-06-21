import paginationCss from "#/components/pagination/pagination.css?url";
import type { TViewer } from "#/data-access-layer/auth/viewer";
import { bypassViewer, isAuthBypassEnabled } from "#/data-access-layer/auth/auth-bypass";
import { viewerqueryOptions } from "#/data-access-layer/auth/viewer";
import {
  TanstackQueryProvider,
  getTanstackQueryContext,
} from "#/lib/tanstack/query/query-provider";
import { AppDevtools } from "#/lib/tanstack/devtools/app-devtools";
import { NotFoundPage } from "#/routes/-components/NotFoundPage";
import appCss from "#/styles.css?url";
import { AppConfig } from "#/utils/system";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/tanstack/router/theme-provider";
import type { QueryClient } from "@tanstack/react-query";
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from "@tanstack/react-router";

interface RouterContext {
  queryClient: QueryClient;
  viewer?: TViewer;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  notFoundComponent: NotFoundPage,
  beforeLoad: async ({ context }) => {
    if (isAuthBypassEnabled()) {
      return { viewer: bypassViewer };
    }

    const viewer = await context.queryClient.ensureQueryData(viewerqueryOptions);
    return { viewer: viewer.data ?? undefined };
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: AppConfig.name },
      { name: "description", content: AppConfig.description },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: paginationCss },
    ],
  }),
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
