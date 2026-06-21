import { parseMovieDetailId } from '#/data-access-layer/tmdb/movie-detail-subset'
import { toBasicMovieRecord } from '#/data-access-layer/tmdb/movie-basic-record'
import {
  parseMoviesBrowseSubset,
  moviesBrowseSubsetToFetchParams,
  stampMovieBrowseContext,
} from '#/data-access-layer/tmdb/movies-browse-subset'
import {
  browseMoviesQueryKey,
  fetchBrowseMovies,
  fetchMovieDetails,
  movieBasicQueryKey,
  movieDetailQueryKey,
} from '#/data-access-layer/tmdb/query-options'
import type { MovieDetailsQueryResponse } from '#/data-access-layer/tmdb/generated/models/MovieDetails'
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
        stampMovieBrowseContext(item, subset, response.page, {
          total_results: response.total_results,
          total_pages: response.total_pages,
        }),
      )
    },
    getKey: (item) => (item.id || item.title)!,
    queryClient: globalQc,
    syncMode: 'on-demand',
    defaultIndexType: BasicIndex,
    staleTime: 1000 * 60 * 60, // 5 minutes
  }),
)

export const movieBasicCollection = createCollection(
  queryCollectionOptions({
    queryKey: (opts) => {
      const movieId = parseMovieDetailId(opts)
      return movieId != null ? [...movieBasicQueryKey, movieId] : movieBasicQueryKey
    },
    queryFn: async () => [],
    getKey: (item: MovieDetailsQueryResponse) => item.id!,
    queryClient: globalQc,
    syncMode: 'on-demand',
    defaultIndexType: BasicIndex,
    staleTime: 1000 * 60 * 60,
  }),
)

export const movieDetailCollection = createCollection(
  queryCollectionOptions({
    queryKey: (opts) => {
      const movieId = parseMovieDetailId(opts)
      return movieId != null ? [...movieDetailQueryKey, movieId] : movieDetailQueryKey
    },
    queryFn: async (ctx) => {
      const movieId = parseMovieDetailId(ctx.meta?.loadSubsetOptions)
      if (movieId == null || !Number.isFinite(movieId)) {
        return []
      }

      const details = await fetchMovieDetails(movieId)
      movieBasicCollection.utils.writeUpsert(toBasicMovieRecord(details))
      return [details]
    },
    getKey: (item: MovieDetailsQueryResponse) => item.id!,
    queryClient: globalQc,
    syncMode: 'on-demand',
    defaultIndexType: BasicIndex,
    staleTime: 1000 * 60 * 60,
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
