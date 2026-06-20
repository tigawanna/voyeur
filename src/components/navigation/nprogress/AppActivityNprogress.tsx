import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import type { Query } from '@tanstack/react-query'
import { useRouterState } from '@tanstack/react-router'
import Nprogress from './Nprogress'

function isBackgroundFetch(query: Query) {
  return query.state.fetchStatus === 'fetching' && query.state.data !== undefined
}

export function AppActivityNprogress() {
  const isNavigating = useRouterState({ select: (state) => state.status === 'pending' })
  const isMutating = useIsMutating() > 0
  const isRefetching = useIsFetching({ predicate: isBackgroundFetch }) > 0

  return <Nprogress isAnimating={isNavigating || isMutating || isRefetching} />
}
