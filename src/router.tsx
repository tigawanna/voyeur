import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { getTanstackQueryContext } from '#/lib/tanstack/query/query-provider'
import { routeTree } from '#/routeTree.gen'

export function getRouter() {
  const tanstackQueryContext = getTanstackQueryContext()

  const router = createRouter({
    routeTree,
    context: {
      ...tanstackQueryContext,
    },
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient: tanstackQueryContext.queryClient,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
