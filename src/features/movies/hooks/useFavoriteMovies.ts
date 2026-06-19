import { useLiveQuery } from '@tanstack/react-db'
import { favoritesCollection } from '#/lib/collections/local-collections'
import type { SavedMovieRef } from '#/types/movie'

export function useFavoriteMovies() {
  const { data, isLoading } = useLiveQuery((query) =>
    query.from({ favorite: favoritesCollection }).select(({ favorite }) => ({
      movieId: favorite.movieId,
      title: favorite.title,
      posterPath: favorite.posterPath,
      addedAt: favorite.addedAt,
    })),
  )

  return {
    favorites: (data ?? []) as unknown as SavedMovieRef[],
    isLoading,
  }
}
