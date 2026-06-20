import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { LoadingState } from '@/components/common/LoadingState'
import { MovieCard } from '#/features/movies/components/MovieCard'
import { useMovieBrowse } from '#/features/movies/hooks/useMovieBrowse'
import { getRouteApi } from '@tanstack/react-router'

const browseRouteApi = getRouteApi('/_app/browse/')

export function MovieTimeline() {
  const { q } = browseRouteApi.useSearch()
  const { movies, isLoading, isError, isFetching, loadMore, loadingMore, hasMore } = useMovieBrowse()
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const isSearchActive = Boolean(q?.trim())

  useEffect(() => {
    const node = sentinelRef.current
    if (!node || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadMore()
        }
      },
      { rootMargin: '240px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore, loadMore])

  if (isLoading && movies.length === 0) {
    return <LoadingState label={isSearchActive ? 'Searching movies' : 'Loading the timeline'} />
  }

  if (isError) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Could not load movies</EmptyTitle>
          <EmptyDescription>
            Check that TMDB_API_KEY is set in .dev.vars and try again.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (movies.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>{isSearchActive ? 'No matches found' : 'Nothing playing yet'}</EmptyTitle>
          <EmptyDescription>
            {isSearchActive
              ? 'Try a different title or clear the search to browse the catalog.'
              : 'Movies will show up here soon.'}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="space-y-8">
      {isFetching && !isLoading && !loadingMore ? (
        <p className="text-sm text-muted-foreground">Updating results…</p>
      ) : null}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      <div ref={sentinelRef} className="flex justify-center py-4">
        {loadingMore ? <LoadingState label="Loading more" className="py-4" /> : null}
        {!hasMore ? (
          <p className="text-sm text-muted-foreground">You have reached the end of the reel.</p>
        ) : (
          <Button variant="secondary" onClick={() => void loadMore()} disabled={loadingMore}>
            Load more
          </Button>
        )}
      </div>
    </div>
  )
}
