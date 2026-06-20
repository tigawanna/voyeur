import { browseMoviesQueryOptions } from '#/data-access-layer/tmdb/query-options'
import {
  favoritesCollection,
  moviesCollection,
  watchlistCollection,
} from '#/data-access-layer/tmdb/query-collection'
import { MovieCard } from '#/features/movies/components/MovieCard'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { and, eq, isUndefined, not, useLiveQuery } from '@tanstack/react-db'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { AlertCircle, Loader, SearchX } from 'lucide-react'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { MoviesListWrapper, useClearBrowseFilters } from './movies-list-wrapper'

const browseRouteApi = getRouteApi('/_app/movies/')

export function MoviesList() {
  const browseSearch = browseRouteApi.useSearch()
  const clearFilters = useClearBrowseFilters()

  const { data: movies, isLoading: isMoviesLoading } = useLiveQuery(
    (q) =>
      q
        .from({ movie: moviesCollection })
        .leftJoin({ favorite: favoritesCollection }, ({ movie, favorite }) =>
          eq(movie.id, favorite.movieId),
        )
        .leftJoin({ watchlist: watchlistCollection }, ({ movie, watchlist }) =>
          eq(movie.id, watchlist.movieId),
        )
        .where(({ movie }) =>
          and(
            eq(movie.page, browseSearch.page),
            eq(movie.view, browseSearch.view),
            eq(movie.region, browseSearch.region),
            eq(movie.language, browseSearch.language),
            eq(movie.sortBy, browseSearch.sortBy),
            eq(movie.q, browseSearch.q?.trim() ?? ''),
          ),
        )
        .orderBy(({ movie }) => movie.popularity, 'desc')
        .limit(40)
        .select(({ movie, favorite, watchlist }) => ({
          ...movie,
          isFavorite: not(isUndefined(favorite)),
          isWatchlisted: not(isUndefined(watchlist)),
        })),
    [browseSearch],
  )

  const {
    data: browseMeta,
    isError,
    error,
    isPlaceholderData,
    isFetching,
    errorUpdatedAt,
  } = useQuery({
    ...browseMoviesQueryOptions(browseSearch),
    select: (response) => ({
      totalResults: response.total_results ?? 0,
      totalPages: response.total_pages ?? 0,
    }),
  })

  const hasActiveFilters = Boolean(browseSearch.q?.trim())
  const hasPreviousResults = isError && movies.length > 0

  useEffect(() => {
    if (!hasPreviousResults) return

    toast.error('Something went wrong', {
      description:
        "We couldn't update the movie list. Showing your previous results.",
    })
  }, [hasPreviousResults, errorUpdatedAt])

  if (isMoviesLoading && movies.length === 0) {
    return (
      <MoviesListWrapper>
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 py-20">
          <Loader className="size-6 animate-spin text-primary" />
        </div>
      </MoviesListWrapper>
    )
  }

  if (isError && movies.length === 0) {
    return (
      <MoviesListWrapper isRefetching={isFetching}>
        <div className="flex h-full w-full flex-col items-center justify-center">
          <Empty className="my-8 max-h-[40%] max-w-[60%] rounded-2xl bg-base-200">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <AlertCircle />
              </EmptyMedia>
              <EmptyTitle>Could not load movies</EmptyTitle>
              <EmptyDescription>{error.message}</EmptyDescription>
            </EmptyHeader>
            {hasActiveFilters ? (
              <EmptyContent className="flex-row justify-center gap-2">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear filters
                </Button>
              </EmptyContent>
            ) : null}
          </Empty>
        </div>
      </MoviesListWrapper>
    )
  }

  if (movies.length === 0) {
    return (
      <MoviesListWrapper
        totalResults={browseMeta?.totalResults}
        totalPages={browseMeta?.totalPages}
        isRefetching={isPlaceholderData}
      >
        <div className="flex h-full w-full flex-col items-center justify-center">
          <Empty className="my-8 max-h-[40%] max-w-[60%] rounded-2xl bg-base-200">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SearchX />
              </EmptyMedia>
              <EmptyTitle>No movies found</EmptyTitle>
              <EmptyDescription>
                {browseSearch.q?.trim()
                  ? `Nothing matched "${browseSearch.q}". Try broadening your search or adjusting the sort.`
                  : 'No movies match the current filters.'}
              </EmptyDescription>
            </EmptyHeader>
            {hasActiveFilters ? (
              <EmptyContent className="flex-row justify-center gap-2">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear filters
                </Button>
              </EmptyContent>
            ) : null}
          </Empty>
        </div>
      </MoviesListWrapper>
    )
  }

  return (
    <MoviesListWrapper
      totalResults={browseMeta?.totalResults}
      totalPages={browseMeta?.totalPages}
      isRefetching={isPlaceholderData}
    >
      <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </MoviesListWrapper>
  )
}
