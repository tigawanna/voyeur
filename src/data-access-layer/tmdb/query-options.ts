import type {
  MoviePopularListQueryParams,
  MoviePopularListQueryResponse,
} from '#/data-access-layer/tmdb/generated/models/MoviePopularList'
import type { SearchMovieQueryResponse } from '#/data-access-layer/tmdb/generated/models/SearchMovie'
import {
  fetchMovieById,
  fetchMovieRecommendations,
  fetchNowPlayingMoviesPage,
  fetchPopularMoviesPage,
  fetchSearchMoviesPage,
  fetchTrendingMoviesPage,
} from '#/data-access-layer/tmdb/tmdb-api'
import type { BrowseSearch, BrowseView } from '#/types/browse'
import { defaultMovieSortBy } from '#/types/movie-sort'
import { keepPreviousData, queryOptions } from '@tanstack/react-query'


export const popularMoviesQueryKey = ['movies', 'popular'] as const
export const browseMoviesQueryKey = ['movies', 'browse'] as const
export const movieDetailQueryKey = ['movie', 'detail'] as const
export const movieBasicQueryKey = ['movie', 'basic'] as const

export const popularMoviesDefaultParams = {
  page: 1,
  language: 'en-US',
  region: 'US',
} as const satisfies MoviePopularListQueryParams

export function popularMoviesQueryOptions(
  params: MoviePopularListQueryParams & {
    sortBy?: string
  } = popularMoviesDefaultParams,
) {
  return queryOptions({
    queryKey: [
      ...popularMoviesQueryKey,
      params.page ?? 1,
      params.region ?? null,
      params.language ?? null,
      params.sortBy ?? defaultMovieSortBy,
    ],
    queryFn: () =>
      fetchPopularMoviesPage({
        page: params.page ?? 1,
        region: params.region,
        language: params.language,
        sortBy: params.sortBy,
      }),
  })
}

function toBrowseListParams(search: BrowseSearch) {
  return {
    page: search.page,
    region: search.region === 'global' ? 'US' : search.region,
    language: search.language,
    sortBy: search.sortBy,
  }
}

export function browseMoviesQueryOptions(search: BrowseSearch) {
  return queryOptions({
    queryKey: [
      ...browseMoviesQueryKey,
      search.view,
      search.q ?? '',
      search.region,
      search.language,
      search.sortBy,
      search.page,
    ],
    queryFn: () =>
      fetchBrowseMovies({
        view: search.view,
        q: search.q,
        ...toBrowseListParams(search),
      }),
    placeholderData: keepPreviousData,
  })
}

export async function fetchBrowseMovies(params: {
  view: BrowseView
  q?: string
  page?: number
  region?: string
  language?: string
  sortBy?: string
}): Promise<MoviePopularListQueryResponse | SearchMovieQueryResponse> {
  const page = params.page ?? 1
  const query = params.q?.trim()
  const listParams = {
    page,
    region: params.region,
    language: params.language,
    sortBy: params.sortBy,
  }

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

export async function fetchMovieDetails(
  movieId: number,
) {
  return fetchMovieById(movieId)
}

export function movieDetailsQueryOptions(movieId: number) {
  return queryOptions({
    queryKey: ['movie', movieId],
    queryFn: () => fetchMovieDetails(movieId),
    staleTime: 0,
  })
}

export function movieRecommendationsQueryOptions(movieId: number, page = 1) {
  return queryOptions({
    queryKey: ['movie-recommendations', movieId, page],
    queryFn: () => fetchMovieRecommendations(movieId, page),
    staleTime: 1000 * 60 * 30,
  })
}

