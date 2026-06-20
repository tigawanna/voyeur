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
  return fetchPopularMoviesPage(params.page ?? 1)
}

export function popularMoviesQueryOptions(params: MoviePopularListQueryParams = { page: 1 }) {
  return queryOptions({
    queryKey: [...popularMoviesQueryKey, params.page ?? 1],
    queryFn: () => fetchPopularMovies(params),
  })
}

export async function fetchBrowseMovies(params: {
  view: BrowseView
  q?: string
  page?: number
}): Promise<MoviePopularListQueryResponse | SearchMovieQueryResponse> {
  const page = params.page ?? 1
  const query = params.q?.trim()

  if (query) {
    return fetchSearchMoviesPage(query, page)
  }

  switch (params.view) {
    case 'trending':
      return fetchTrendingMoviesPage(page)
    case 'recent':
      return fetchNowPlayingMoviesPage(page)
    default:
      return fetchPopularMoviesPage(page)
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
