import { createCollection } from '@tanstack/db'
import { localStorageCollectionOptions } from '@tanstack/db-collections'
import { z } from 'zod'
import type { SavedMovieRef } from '#/types/movie'

const savedMovieSchema = z.object({
  movieId: z.number(),
  title: z.string(),
  posterPath: z.string().nullable(),
  addedAt: z.string(),
})

function createSavedMovieCollection(id: string, storageKey: string) {
  return createCollection(
    localStorageCollectionOptions({
      id,
      storageKey,
      schema: savedMovieSchema,
      getKey: (item: SavedMovieRef) => item.movieId,
    }) as never,
  )
}

export const favoritesCollection = createSavedMovieCollection('favorites', 'voyeur.favorites')
export const watchlistCollection = createSavedMovieCollection('watchlist', 'voyeur.watchlist')
