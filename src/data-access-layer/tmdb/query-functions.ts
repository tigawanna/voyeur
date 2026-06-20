import { queryOptions } from '@tanstack/react-query'
import type {
  MoviePopularListQueryParams,
  MoviePopularListQueryResponse,
} from '#/data-access-layer/tmdb/generated/models/MoviePopularList'
import type { MovieDetailsQueryResponse } from '#/data-access-layer/tmdb/generated/models/MovieDetails'
import type { SearchMovieQueryResponse } from '#/data-access-layer/tmdb/generated/models/SearchMovie'
import {
  fetchMovieById,
  fetchNowPlayingMoviesPage,
  fetchPopularMoviesPage,
  fetchSearchMoviesPage,
  fetchTrendingMoviesPage,
} from '#/data-access-layer/tmdb/tmdb-api'
import type { BrowseView } from '#/types/browse'

export const popularMoviesQueryKey = ['movies', 'popular'] as const
export const browseMoviesQueryKey = ['movies', 'browse'] as const

export async function fetchPopularMovies(
  params: MoviePopularListQueryParams = { page: 1 },
): Promise<MoviePopularListQueryResponse> {
  return fetchPopularMoviesPage({ page: params.page ?? 1, region: params.region })
}

export function popularMoviesQueryOptions(params: MoviePopularListQueryParams = { page: 1 }) {
  return queryOptions({
    queryKey: [...popularMoviesQueryKey, params.page ?? 1, params.region ?? null],
    queryFn: () => fetchPopularMovies(params),
  })
}

export async function fetchBrowseMovies(params: {
  view: BrowseView
  q?: string
  page?: number
  region?: string
  language?: string
}): Promise<MoviePopularListQueryResponse | SearchMovieQueryResponse> {
  const page = params.page ?? 1
  const query = params.q?.trim()
  const listParams = { page, region: params.region, language: params.language }

  if (query) {
    return fetchSearchMoviesPage(query, listParams)
  }

  switch (params.view) {
    case 'trending':
      return fetchTrendingMoviesPage(listParams)
    case 'recent':
      return fetchNowPlayingMoviesPage(listParams)
    default:
      return fetchPopularMoviesPage(listParams)
  }
}

export async function fetchMovieDetails(movieId: number): Promise<MovieDetailsQueryResponse> {
  return fetchMovieById(movieId)
}

export function movieDetailsQueryOptions(movieId: number) {
  return queryOptions({
    queryKey: ['movie', movieId],
    queryFn: () => fetchMovieDetails(movieId),
  })
}
