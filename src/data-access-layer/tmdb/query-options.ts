import type { MovieDetailsQueryResponse } from '#/data-access-layer/tmdb/generated/models/MovieDetails'
import type {
  MoviePopularListQueryParams,
  MoviePopularListQueryResponse,
} from '#/data-access-layer/tmdb/generated/models/MoviePopularList'
import type { SearchMovieQueryResponse } from '#/data-access-layer/tmdb/generated/models/SearchMovie'
import {
  fetchMovieById,
  fetchNowPlayingMoviesPage,
  fetchPopularMoviesPage,
  fetchSearchMoviesPage,
  fetchTrendingMoviesPage,
} from '#/data-access-layer/tmdb/tmdb-api'
import { getTanstackQueryContext } from '#/lib/tanstack/query/query-provider'
import type { BrowseSearch, BrowseView } from '#/types/browse'
import { defaultMovieSortBy } from '#/types/movie-sort'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { createCollection } from '@tanstack/react-db'
import { keepPreviousData, queryOptions } from '@tanstack/react-query'


const globalQc= getTanstackQueryContext().queryClient
export const popularMoviesQueryKey = ['movies', 'popular'] as const
export const browseMoviesQueryKey = ['movies', 'browse'] as const


export const popularMoviesDefaultParams = {
  page: 1,
  language: 'en-US',
  region: 'US',
} as const satisfies MoviePopularListQueryParams

export function popularMoviesQueryOptions(
  params: MoviePopularListQueryParams & { sortBy?: string } = popularMoviesDefaultParams,
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

export async function fetchMovieDetails(movieId: number): Promise<MovieDetailsQueryResponse> {
  return fetchMovieById(movieId)
}

export function movieDetailsQueryOptions(movieId: number) {
  return queryOptions({
    queryKey: ['movie', movieId],
    queryFn: () => fetchMovieDetails(movieId),
  })
}



// Define a collection that loads data using TanStack Query
const moviesCollection = createCollection(
  queryCollectionOptions({
    queryKey: browseMoviesQueryKey,
    queryFn: async () => {
      const response = await fetchBrowseMovies({
        view: 'popular',
        q: '',
        page: 1,
        region: 'US',
        language: 'en-US',
        sortBy: 'popularity.desc',
      })
      return response.results??[]
    },
    getKey: (item) => (item.id||item.title)!,
    queryClient: globalQc,
  }),
)
