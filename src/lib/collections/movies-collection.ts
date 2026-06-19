import { createCollection } from '@tanstack/db'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import type { QueryClient } from '@tanstack/react-query'
import { fetchPopularMovies, popularMoviesQueryKey } from '#/data-access-layer/tmdb/query-functions'
import type { Movie } from '#/types/movie'

export function createPopularMoviesCollection(queryClient: QueryClient) {
  return createCollection(
    queryCollectionOptions({
      id: 'popular-movies',
      queryKey: popularMoviesQueryKey,
      queryFn: async () => {
        const firstPage = await fetchPopularMovies({ page: 1 })
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
  const data = await fetchPopularMovies({ page })

  for (const movie of data.results) {
    collection.utils.writeUpsert(movie)
  }

  return data
}
