import { browseMoviesQueryKey, fetchBrowseMovies } from '#/data-access-layer/tmdb/query-options'
import { favoritesCollection, watchlistCollection } from '#/lib/collections/local-collections'
import type { TimelineMovie } from '#/types/movie'
import { mapTmdbMovie } from '#/utils/tmdb-images'
import { useLiveQuery } from '@tanstack/react-db'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { useMemo } from 'react'

const browseRouteApi = getRouteApi('/_app/browse/')

export function useMovieBrowse() {
  const { view, q, region, language } = browseRouteApi.useSearch()
  const searchQuery = q?.trim() ?? ''

  const moviesQuery = useInfiniteQuery({
    queryKey: [...browseMoviesQueryKey, view, searchQuery, region, language],
    queryFn: ({ pageParam }) =>
      fetchBrowseMovies({
        view,
        q: searchQuery || undefined,
        page: pageParam,
        region,
        language,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const page = lastPage.page ?? 1
      const totalPages = lastPage.total_pages ?? 1
      return page < totalPages ? page + 1 : undefined
    },
  })

  const { data: favorites } = useLiveQuery((query) =>
    query.from({ favorite: favoritesCollection }).select(({ favorite }) => ({
      movieId: favorite.movieId,
    })),
  )

  const { data: watchlist } = useLiveQuery((query) =>
    query.from({ watchlist: watchlistCollection }).select(({ watchlist }) => ({
      movieId: watchlist.movieId,
    })),
  )

  const favoriteIdSet = useMemo(
    () => new Set((favorites ?? []).map((favorite) => favorite.movieId)),
    [favorites],
  )
  const watchlistIdSet = useMemo(
    () => new Set((watchlist ?? []).map((item) => item.movieId)),
    [watchlist],
  )

  const movies = useMemo<TimelineMovie[]>(() => {
    return (moviesQuery.data?.pages ?? []).flatMap((page) =>
      (page.results ?? []).map((movie) => {
        const mapped = mapTmdbMovie(movie)
        return {
          ...mapped,
          isFavorite: favoriteIdSet.has(mapped.id),
          isWatchlisted: watchlistIdSet.has(mapped.id),
        }
      }),
    )
  }, [favoriteIdSet, moviesQuery.data?.pages, watchlistIdSet])

  return {
    movies,
    isLoading: moviesQuery.isLoading,
    isError: moviesQuery.isError,
    isFetching: moviesQuery.isFetching,
    loadMore: () => void moviesQuery.fetchNextPage(),
    loadingMore: moviesQuery.isFetchingNextPage,
    hasMore: moviesQuery.hasNextPage ?? false,
  }
}
