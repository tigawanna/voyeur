import {
  parseMoviesBrowseSubset,
  moviesBrowseSubsetToFetchParams,
  stampMovieBrowseContext,
} from '#/data-access-layer/tmdb/movies-browse-subset'
import { getTanstackQueryContext } from '#/lib/tanstack/query/query-provider'
import { createCollection } from '@tanstack/db'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { browseMoviesQueryKey, fetchBrowseMovies } from './query-options'


const globalQc = getTanstackQueryContext().queryClient
// Define a collection that loads data using TanStack Query
export const moviesCollection = createCollection(
  queryCollectionOptions({
    queryKey: browseMoviesQueryKey,

    queryFn: async (ctx) => {
      const subset = parseMoviesBrowseSubset(ctx.meta?.loadSubsetOptions)
      console.log({ subset })
      const response = await fetchBrowseMovies(
        moviesBrowseSubsetToFetchParams(subset),
      )

      return (response.results ?? []).map((item) =>
        stampMovieBrowseContext(item, subset, response.page),
      )
    },
    getKey: (item) => (item.id || item.title)!,
    queryClient: globalQc,
    syncMode: 'on-demand',
  }),
)

