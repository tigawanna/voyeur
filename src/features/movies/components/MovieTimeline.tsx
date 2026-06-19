import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/EmptyState'
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
      <EmptyState
        title="Could not load movies"
        description="Check that TMDB_API_KEY is set in .dev.vars and try again."
      />
    )
  }

  if (movies.length === 0) {
    return (
      <EmptyState title="Nothing playing yet" description="Popular movies will show up here soon." />
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
