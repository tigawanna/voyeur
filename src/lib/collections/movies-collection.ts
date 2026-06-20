import { fetchPopularMoviesPage } from '#/data-access-layer/tmdb/tmdb-api'
import { popularMoviesDefaultParams, popularMoviesQueryKey } from '#/data-access-layer/tmdb/query-options'
import type { Movie } from '#/types/movie'
import { mapTmdbMovie } from '#/utils/tmdb-images'
import { createCollection } from '@tanstack/db'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import type { QueryClient } from '@tanstack/react-query'

export function createPopularMoviesCollection(queryClient: QueryClient) {
  return createCollection(
    queryCollectionOptions({
      id: 'popular-movies',
      queryKey: popularMoviesQueryKey,
      queryFn: async () => {
        const firstPage = await fetchPopularMoviesPage(popularMoviesDefaultParams)
        return (firstPage.results ?? []).map(mapTmdbMovie)
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
  const data = await fetchPopularMoviesPage({ ...popularMoviesDefaultParams, page })

  for (const movie of data.results ?? []) {
    collection.utils.writeUpsert(mapTmdbMovie(movie))
  }

  return data
}
