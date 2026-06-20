import type { MovieDetailsQueryResponse } from '#/data-access-layer/tmdb/generated/models/MovieDetails'
import type { MovieNowPlayingListQueryResponse } from '#/data-access-layer/tmdb/generated/models/MovieNowPlayingList'
import type { MoviePopularListQueryResponse } from '#/data-access-layer/tmdb/generated/models/MoviePopularList'
import type { SearchMovieQueryResponse } from '#/data-access-layer/tmdb/generated/models/SearchMovie'

export type TmdbListParams = {
  page?: number
  region?: string
  language?: string
}

function toListQueryParams({ page = 1, region, language }: TmdbListParams = {}) {
  const params: Record<string, string | number> = { page }

  if (region && region !== 'global') {
    params.region = region
  }

  if (language) {
    params.language = language
  }

  return params
}

async function tmdbProxyFetch<T>(
  path: string,
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  const searchParams = new URLSearchParams()

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        searchParams.set(key, String(value))
      }
    }
  }

  const query = searchParams.toString()
  const url = query ? `${path}?${query}` : path
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`TMDB proxy request failed: ${response.status}`)
  }

  return response.json() as T
}

export function fetchPopularMoviesPage(params: TmdbListParams = {}) {
  return tmdbProxyFetch<MoviePopularListQueryResponse>(
    '/api/tmdb/movies/popular',
    toListQueryParams(params),
  )
}

export function fetchTrendingMoviesPage(params: TmdbListParams = {}) {
  return tmdbProxyFetch<MoviePopularListQueryResponse>(
    '/api/tmdb/movies/trending',
    toListQueryParams(params),
  )
}

export function fetchNowPlayingMoviesPage(params: TmdbListParams = {}) {
  return tmdbProxyFetch<MovieNowPlayingListQueryResponse>(
    '/api/tmdb/movies/now-playing',
    toListQueryParams(params),
  )
}

export function fetchSearchMoviesPage(query: string, params: TmdbListParams = {}) {
  return tmdbProxyFetch<SearchMovieQueryResponse>('/api/tmdb/movies/search', {
    query,
    ...toListQueryParams(params),
  })
}

export function fetchMovieById(movieId: number, language?: string) {
  return tmdbProxyFetch<MovieDetailsQueryResponse>(`/api/tmdb/movies/${movieId}`, {
    ...(language ? { language } : {}),
  })
}
