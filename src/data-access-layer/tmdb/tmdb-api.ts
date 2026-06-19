import type { MovieDetailsQueryResponse } from '#/data-access-layer/tmdb/generated/models/MovieDetails'
import type { MoviePopularListQueryResponse } from '#/data-access-layer/tmdb/generated/models/MoviePopularList'

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

export function fetchMovieById(movieId: number) {
  return tmdbProxyFetch<MovieDetailsQueryResponse>(`/api/tmdb/movies/${movieId}`)
}
