import { MovieCard } from '#/features/movies/components/MovieCard'
import { browseMoviesQueryOptions } from '#/data-access-layer/tmdb/query-options'
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
import { getRouteApi } from '@tanstack/react-router'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { AlertCircle, Loader, SearchX } from 'lucide-react'
import { MoviesListWrapper, useClearBrowseFilters } from './movies-list-wrapper'

const browseRouteApi = getRouteApi('/_app/browse/')

export function MoviesList() {
  const browseSearch = browseRouteApi.useSearch()
  const clearFilters = useClearBrowseFilters()

  const { data, isPending, isError, error, isPlaceholderData, isFetching } = useQuery(
    {...browseMoviesQueryOptions(browseSearch),placeholderData: keepPreviousData},
  )

  const hasActiveFilters = Boolean(browseSearch.q?.trim())

  if (isPending) {
    return (
      <MoviesListWrapper>
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 py-20">
          <Loader className="size-6 animate-spin text-primary" />
        </div>
      </MoviesListWrapper>
    )
  }

  if (isError) {
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
      <MoviesListWrapper totalResults={data.total_results} isRefetching={isPlaceholderData}>
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
    <MoviesListWrapper totalResults={data.total_results} isRefetching={isPlaceholderData}>
      <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
        {data.results.map((movie) => (
          <MovieCard key={movie.id} movie={mapTmdbMovie(movie)} />
        ))}
      </div>
    </MoviesListWrapper>
  )
}
