import { queryOptions } from '@tanstack/react-query'
import type { MoviePopularListQueryParams } from '#/data-access-layer/tmdb/generated/models/MoviePopularList'
import { fetchMovieById, fetchPopularMoviesPage } from '#/data-access-layer/tmdb/tmdb-api'
import type { Movie, MovieListResponse } from '#/types/movie'

export const popularMoviesQueryKey = ['movies', 'popular'] as const

export async function fetchPopularMovies(
  params: MoviePopularListQueryParams = { page: 1 },
): Promise<MovieListResponse> {
  return fetchPopularMoviesPage(params.page ?? 1)
}

export function popularMoviesQueryOptions(params: MoviePopularListQueryParams = { page: 1 }) {
  return queryOptions({
    queryKey: [...popularMoviesQueryKey, params.page ?? 1],
    queryFn: () => fetchPopularMovies(params),
  })
}

export async function fetchMovieDetails(movieId: number): Promise<Movie> {
  return fetchMovieById(movieId)
}

export function movieDetailsQueryOptions(movieId: number) {
  return queryOptions({
    queryKey: ['movie', movieId],
    queryFn: () => fetchMovieDetails(movieId),
  })
}
