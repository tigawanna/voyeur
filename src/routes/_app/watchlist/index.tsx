import { createFileRoute } from '@tanstack/react-router'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { LoadingState } from '@/components/common/LoadingState'
import { SavedMovieCard } from '#/features/movies/components/SavedMovieCard'
import { useWatchlistMovies } from '#/features/movies/hooks/useWatchlistMovies'

export const Route = createFileRoute('/_app/watchlist/')({
  component: WatchlistPage,
})

function WatchlistPage() {
  const { watchlist, isLoading } = useWatchlistMovies()

  return (
    <section>
      <div className="mb-8">
        <p className="island-kicker mb-2">Up next</p>
        <h1 className="display-title text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Watchlist
        </h1>
      </div>
      {isLoading ? <LoadingState /> : null}
      {!isLoading && watchlist.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Watchlist is empty</EmptyTitle>
            <EmptyDescription>
              Queue films from the timeline when you want a personal shortlist.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : null}
      <div className="grid gap-4">
        {watchlist.map((movie) => (
          <SavedMovieCard key={movie.movieId} movie={movie} kind="watchlist" />
        ))}
      </div>
    </section>
  )
}
