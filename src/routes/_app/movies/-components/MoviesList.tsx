import { browseMoviesQueryOptions } from '#/data-access-layer/tmdb/query-options'
import { moviesCollection } from '#/data-access-layer/tmdb/query-collection'
import { MovieCard } from '#/features/movies/components/MovieCard'
import { mapTmdbMovie } from '#/utils/tmdb-images'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { and, eq, useLiveQuery } from '@tanstack/react-db'
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
  
  useLiveQuery(
    (q) =>
      q
        .from({ movie: moviesCollection })
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
        .limit(40),
    [browseSearch],
  )

  const {
    data,
    isPending,
    isError,
    error,
    isPlaceholderData,
    isFetching,
    errorUpdatedAt,
  } = useQuery(browseMoviesQueryOptions(browseSearch))

  const hasActiveFilters = Boolean(browseSearch.q?.trim())
  const hasPreviousResults =
    isError && data != null && (data.results?.length ?? 0) > 0

  useEffect(() => {
    if (!hasPreviousResults) return

    toast.error('Something went wrong', {
      description:
        "We couldn't update the movie list. Showing your previous results.",
    })
  }, [hasPreviousResults, errorUpdatedAt])

  if (isPending) {
    return (
      <MoviesListWrapper>
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 py-20">
          <Loader className="size-6 animate-spin text-primary" />
        </div>
      </MoviesListWrapper>
    )
  }

  if (isError && !data) {
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

  if (!data.results || data.results.length === 0) {
    return (
      <MoviesListWrapper
        totalResults={data.total_results}
        totalPages={data.total_pages}
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
      totalResults={data.total_results}
      totalPages={data.total_pages}
      isRefetching={isPlaceholderData}
    >
      <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
        {data.results.map((movie) => (
          <MovieCard key={movie.id} movie={mapTmdbMovie(movie)}  />
        ))}
      </div>
    </MoviesListWrapper>
  )
}
