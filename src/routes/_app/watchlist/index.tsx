import { watchlistCollection } from '#/data-access-layer/tmdb/query-collection'
import { SavedMovieCard } from '#/features/movies/components/SavedMovieCard'
import { LoadingState } from '@/components/common/LoadingState'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { useLiveQuery } from '@tanstack/react-db'
import { createFileRoute } from '@tanstack/react-router'
import type { SavedMovieRef } from '#/types/movie'

export const Route = createFileRoute('/_app/watchlist/')({
  component: WatchlistPage,
})

function WatchlistPage() {
  const { data, isLoading } = useLiveQuery(
    (query) =>
      query.from({ watchlist: watchlistCollection }).select(({ watchlist }) => ({
        movieId: watchlist.movieId,
        title: watchlist.title,
        posterPath: watchlist.posterPath,
        addedAt: watchlist.addedAt,
      })),
    [],
  )

  const watchlist = (data ?? []) as SavedMovieRef[]

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
