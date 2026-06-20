import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/lib/tanstack/router/theme-provider'
import {
  TanstackQueryProvider,
  getTanstackQueryContext,
} from '#/lib/tanstack/query/query-provider'
import { MoviesCollectionProvider } from '#/lib/collections/movies-collection-context'
import { viewerMiddleware, viewerqueryOptions  } from '#/data-access-layer/auth/viewer'
import type {TViewer} from '#/data-access-layer/auth/viewer';
import { NotFoundPage } from '#/routes/-components/NotFoundPage'
import { AppConfig } from '#/utils/system'
import appCss from '#/styles.css?url'
import paginationCss from '#/components/pagination/pagination.css?url'

interface RouterContext {
  queryClient: QueryClient
  viewer?: TViewer
}

export const Route = createRootRouteWithContext<RouterContext>()({
  notFoundComponent: NotFoundPage,
  server: {
    middleware: [viewerMiddleware],
  },
  beforeLoad: async ({ context }) => {
    const viewer = await context.queryClient.ensureQueryData(viewerqueryOptions)
    return { viewer: viewer.data ?? undefined }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: AppConfig.name },
      { name: 'description', content: AppConfig.description },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'stylesheet', href: paginationCss },
    ],
  }),
  component: RootDocument,
})

function RootDocument() {
  const { queryClient } = getTanstackQueryContext()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased wrap-anywhere">
        <ThemeProvider storageKey={AppConfig.themeStorageKey}>
          <TanstackQueryProvider queryClient={queryClient}>
            <TooltipProvider>
              <MoviesCollectionProvider>
                <Outlet />
              </MoviesCollectionProvider>
              <Toaster />
            </TooltipProvider>
          </TanstackQueryProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
