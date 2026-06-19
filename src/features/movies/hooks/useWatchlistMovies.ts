import { useLiveQuery } from '@tanstack/react-db'
import { watchlistCollection } from '#/lib/collections/local-collections'
import type { SavedMovieRef } from '#/types/movie'

export function useWatchlistMovies() {
  const { data, isLoading } = useLiveQuery((query) =>
    query.from({ watchlist: watchlistCollection }).select(({ watchlist }) => ({
      movieId: watchlist.movieId,
      title: watchlist.title,
      posterPath: watchlist.posterPath,
      addedAt: watchlist.addedAt,
    })),
  )

  return {
    watchlist: (data ?? []) as unknown as SavedMovieRef[],
    isLoading,
  }
}
