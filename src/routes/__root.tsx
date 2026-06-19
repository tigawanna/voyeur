import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import {
  TanstackQueryProvider,
  getTanstackQueryContext,
} from '#/lib/tanstack/query/query-provider'
import { MoviesCollectionProvider } from '#/lib/collections/movies-collection-context'
import { AppConfig } from '#/utils/system'
import appCss from '#/styles.css?url'

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: AppConfig.name },
      { name: 'description', content: AppConfig.description },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
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
      <body className="font-sans antialiased [overflow-wrap:anywhere]">
        <TanstackQueryProvider queryClient={queryClient}>
          <MoviesCollectionProvider>
            <Outlet />
          </MoviesCollectionProvider>
        </TanstackQueryProvider>
        <Scripts />
      </body>
    </html>
  )
}
