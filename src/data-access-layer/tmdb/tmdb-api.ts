import type { MovieDetailsQueryResponse } from '#/data-access-layer/tmdb/generated/models/MovieDetails'
import type { MovieNowPlayingListQueryResponse } from '#/data-access-layer/tmdb/generated/models/MovieNowPlayingList'
import type { MoviePopularListQueryResponse } from '#/data-access-layer/tmdb/generated/models/MoviePopularList'
import type { SearchMovieQueryResponse } from '#/data-access-layer/tmdb/generated/models/SearchMovie'

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

export function fetchPopularMoviesPage(page = 1) {
  return tmdbProxyFetch<MoviePopularListQueryResponse>('/api/tmdb/movies/popular', { page })
}

export function fetchTrendingMoviesPage(page = 1) {
  return tmdbProxyFetch<MoviePopularListQueryResponse>('/api/tmdb/movies/trending', { page })
}

export function fetchNowPlayingMoviesPage(page = 1) {
  return tmdbProxyFetch<MovieNowPlayingListQueryResponse>('/api/tmdb/movies/now-playing', { page })
}

export function fetchSearchMoviesPage(query: string, page = 1) {
  return tmdbProxyFetch<SearchMovieQueryResponse>('/api/tmdb/movies/search', { query, page })
}

export function fetchMovieById(movieId: number) {
  return tmdbProxyFetch<MovieDetailsQueryResponse>(`/api/tmdb/movies/${movieId}`)
}
