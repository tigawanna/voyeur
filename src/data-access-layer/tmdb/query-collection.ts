import {
  parseMoviesBrowseSubset,
  moviesBrowseSubsetToFetchParams,
  stampMovieBrowseContext,
} from '#/data-access-layer/tmdb/movies-browse-subset'
import { browseMoviesQueryKey, fetchBrowseMovies } from '#/data-access-layer/tmdb/query-options'
import { getTanstackQueryContext } from '#/lib/tanstack/query/query-provider'
import type { SavedMovieRef } from '#/types/movie'
import {
  BrowserCollectionCoordinator,
  createBrowserWASQLitePersistence,
  openBrowserWASQLiteOPFSDatabase,
  persistedCollectionOptions,
} from '@tanstack/browser-db-sqlite-persistence'
import { BasicIndex, createCollection } from '@tanstack/db'
import { queryCollectionOptions } from '@tanstack/query-db-collection'

const globalQc = getTanstackQueryContext().queryClient

export const moviesCollection = createCollection(
  queryCollectionOptions({
    queryKey: browseMoviesQueryKey,
    queryFn: async (ctx) => {
      const subset = parseMoviesBrowseSubset(ctx.meta?.loadSubsetOptions)
      const response = await fetchBrowseMovies(
        moviesBrowseSubsetToFetchParams(subset),
      )

      return (response.results ?? []).map((item) =>
        stampMovieBrowseContext(item, subset, response.page),
      )
    },
    getKey: (item) => (item.id || item.title)!,
    queryClient: globalQc,
    syncMode: 'on-demand',
    defaultIndexType: BasicIndex,
  }),
)

moviesCollection.createIndex((row) => row.popularity)
moviesCollection.createIndex((row) => row.id)

const database = await openBrowserWASQLiteOPFSDatabase({
  databaseName: 'reelroom.sqlite',
})

const coordinator = new BrowserCollectionCoordinator({
  dbName: 'reelroom',
})

const persistence = createBrowserWASQLitePersistence({
  database,
  coordinator,
})

export const favoritesCollection = createCollection(
  persistedCollectionOptions<SavedMovieRef, number>({
    id: 'favorites',
    getKey: (item) => item.movieId,
    persistence,
    schemaVersion: 1,
    defaultIndexType: BasicIndex,
  }),
)

favoritesCollection.createIndex((row) => row.movieId)

export const watchlistCollection = createCollection(
  persistedCollectionOptions<SavedMovieRef, number>({
    id: 'watchlist',
    getKey: (item) => item.movieId,
    persistence,
    schemaVersion: 1,
    defaultIndexType: BasicIndex,
  }),
)

watchlistCollection.createIndex((row) => row.movieId)
