/**
 * TanStack DB collection definitions for movies and the local library.
 *
 * See COLLECTIONS.md in this folder for architecture, live-query usage, and detail-page loading.
 */
import { parseMovieDetailId } from "#/data-access-layer/tmdb/movie-detail-subset";
import { toBasicMovieRecord } from "#/data-access-layer/tmdb/movie-basic-record";
import {
  parseMoviesBrowseSubset,
  moviesBrowseSubsetToFetchParams,
  stampMovieBrowseContext,
} from "#/data-access-layer/tmdb/movies-browse-subset";
import {
  parseRecommendationSourceId,
  stampMovieRecommendationContext,
} from "#/data-access-layer/tmdb/movies-recommendations-subset";
import {
  browseMoviesQueryKey,
  fetchBrowseMovies,
  fetchMovieDetails,
  fetchMovieRecommendations,
  movieBasicQueryKey,
  movieDetailQueryKey,
  movieRecommendationsQueryKey,
} from "#/data-access-layer/tmdb/query-options";
import type { MovieDetailsQueryResponse } from "#/data-access-layer/tmdb/generated/models/MovieDetails";
import { getTanstackQueryContext } from "#/lib/tanstack/query/query-provider";
import { BasicIndex, createCollection } from "@tanstack/db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";

const globalQc = getTanstackQueryContext().queryClient;

// Browse grid: on-demand TMDB list pages. queryFn receives filters/page/sort from useLiveQuery.
export const moviesCollection = createCollection(
  queryCollectionOptions({
    queryKey: browseMoviesQueryKey,
    queryFn: async (ctx) => {
      const subset = parseMoviesBrowseSubset(ctx.meta?.loadSubsetOptions);
      const response = await fetchBrowseMovies(moviesBrowseSubsetToFetchParams(subset));

      return (response.results ?? []).map((item) =>
        stampMovieBrowseContext(item, subset, response.page, {
          total_results: response.total_results,
          total_pages: response.total_pages,
        }),
      );
    },
    getKey: (item) => (item.id || item.title)!,
    queryClient: globalQc,
    syncMode: "on-demand",
    defaultIndexType: BasicIndex,
    staleTime: 1000 * 60 * 60,
  }),
);

// Detail hero cache: never fetches. Populated via writeUpsert when movieDetailCollection loads.
export const movieBasicCollection = createCollection(
  queryCollectionOptions({
    queryKey: (opts) => {
      const movieId = parseMovieDetailId(opts);
      return movieId != null ? [...movieBasicQueryKey, movieId] : movieBasicQueryKey;
    },
    queryFn: async () => [],
    getKey: (item: MovieDetailsQueryResponse) => item.id!,
    queryClient: globalQc,
    syncMode: "on-demand",
    defaultIndexType: BasicIndex,
    staleTime: 1000 * 60 * 60,
  }),
);

// Full detail: fetches GET /api/tmdb/movies/:id and seeds movieBasicCollection on success.
export const movieDetailCollection = createCollection(
  queryCollectionOptions({
    queryKey: (opts) => {
      const movieId = parseMovieDetailId(opts);
      return movieId != null ? [...movieDetailQueryKey, movieId] : movieDetailQueryKey;
    },
    queryFn: async (ctx) => {
      const movieId = parseMovieDetailId(ctx.meta?.loadSubsetOptions);
      if (movieId == null || !Number.isFinite(movieId)) {
        return [];
      }

      const details = await fetchMovieDetails(movieId);
      movieBasicCollection.utils.writeUpsert(toBasicMovieRecord(details));
      return [details];
    },
    getKey: (item: MovieDetailsQueryResponse) => item.id!,
    queryClient: globalQc,
    syncMode: "on-demand",
    defaultIndexType: BasicIndex,
    staleTime: 1000 * 60 * 60,
  }),
);

// Recommendations for a source movie: on-demand fetch, rows stamped with sourceMovieId for joins and detail fallback.
export const movieRecommendationsCollection = createCollection(
  queryCollectionOptions({
    queryKey: (opts) => {
      const sourceMovieId = parseRecommendationSourceId(opts);
      return sourceMovieId != null
        ? [...movieRecommendationsQueryKey, sourceMovieId]
        : movieRecommendationsQueryKey;
    },
    queryFn: async (ctx) => {
      const sourceMovieId = parseRecommendationSourceId(ctx.meta?.loadSubsetOptions);
      if (sourceMovieId == null || !Number.isFinite(sourceMovieId)) {
        return [];
      }

      const response = await fetchMovieRecommendations(sourceMovieId, 1);
      return (response.results ?? []).map((item) =>
        stampMovieRecommendationContext(item, sourceMovieId),
      );
    },
    getKey: (item) => (item.id || item.title)!,
    queryClient: globalQc,
    syncMode: "on-demand",
    defaultIndexType: BasicIndex,
    staleTime: 1000 * 60 * 30,
  }),
);

moviesCollection.createIndex((row) => row.popularity);
moviesCollection.createIndex((row) => row.id);
movieRecommendationsCollection.createIndex((row) => row.sourceMovieId);
movieRecommendationsCollection.createIndex((row) => row.id);
