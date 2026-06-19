import { createCollection } from '@tanstack/db'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import type { QueryClient } from '@tanstack/react-query'
import type { Movie, MovieListResponse } from '#/types/movie'

async function fetchPopularPage(page: number) {
  const response = await fetch(`/api/tmdb/movies/popular?page=${page}`)

  if (!response.ok) {
    throw new Error('Failed to load movies')
  }

  return (await response.json()) as MovieListResponse
}

export function createPopularMoviesCollection(queryClient: QueryClient) {
  return createCollection(
    queryCollectionOptions({
      id: 'popular-movies',
      queryKey: ['movies', 'popular'],
      queryFn: async () => {
        const firstPage = await fetchPopularPage(1)
        return firstPage.results
      },
      queryClient,
      getKey: (item: Movie) => item.id,
    }),
  )
}

export async function appendPopularMoviesPage(
  collection: ReturnType<typeof createPopularMoviesCollection>,
  page: number,
) {
  const data = await fetchPopularPage(page)

  for (const movie of data.results) {
    collection.utils.writeUpsert(movie)
  }

  return data
}
