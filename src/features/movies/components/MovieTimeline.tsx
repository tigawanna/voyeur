import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { LoadingState } from '@/components/common/LoadingState'
import { MovieCard } from '#/features/movies/components/MovieCard'
import { useMovieTimeline } from '#/features/movies/hooks/useMovieTimeline'

export function MovieTimeline() {
  const { movies, isLoading, isError, loadMore, loadingMore, hasMore } = useMovieTimeline()
  const sentinelRef = useRef<HTMLDivElement | null>(null)

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
    return <LoadingState label="Loading the timeline" />
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
          <EmptyTitle>Nothing playing yet</EmptyTitle>
          <EmptyDescription>Popular movies will show up here soon.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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
