import { favoritesCollection, watchlistCollection } from '#/lib/collections/local-collections'
import type { Movie } from '#/types/movie'
import { useCallback } from 'react'

function toSavedRef(movie: Movie) {
  return {
    movieId: movie.id,
    title: movie.title,
    posterPath: movie.posterPath,
    addedAt: new Date().toISOString(),
  }
}

export function useMovieLibraryActions(movie: Movie) {
  const toggleFavorite = useCallback(
    async (isFavorite: boolean) => {
      if (isFavorite) {
        await favoritesCollection.delete(movie.id)
        return
      }

      await favoritesCollection.insert(toSavedRef(movie))
    },
    [movie],
  )

  const toggleWatchlist = useCallback(
    async (isWatchlisted: boolean) => {
      if (isWatchlisted) {
        await watchlistCollection.delete(movie.id)
        return
      }

      await watchlistCollection.insert(toSavedRef(movie))
    },
    [movie],
  )

  return {
    toggleFavorite,
    toggleWatchlist,
  }
}
