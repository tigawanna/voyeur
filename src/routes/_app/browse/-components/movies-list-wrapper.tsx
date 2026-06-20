import { BrowseListPagination } from '@/components/pagination/BrowseListPagination'
import { browseSearchDefaults, getBrowseHeading } from '#/types/browse'
import type { BrowseSearch } from '#/types/browse'
import { getMovieSortOrder, MOVIE_SORT_OPTIONS } from '#/types/movie-sort'
import { cn } from '@/lib/utils'
import { getRouteApi } from '@tanstack/react-router'
import { Loader } from 'lucide-react'
import { MovieFilters } from './MovieListFilters'
import { MoviesBrowseHeader } from './MoviesBrowseHeader'

const browseRouteApi = getRouteApi('/_app/browse/')

interface MoviesListWrapperProps {
  children: React.ReactNode
  totalResults?: number
  totalPages?: number
  isRefetching?: boolean
}

export function MoviesListWrapper({
  children,
  totalResults,
  totalPages,
  isRefetching,
}: MoviesListWrapperProps) {
  const browseSearch = browseRouteApi.useSearch()
  const navigate = browseRouteApi.useNavigate()

  function handleSearchChange(updates: Partial<Pick<BrowseSearch, 'q' | 'sortBy'>>) {
    void navigate({
      search: {
        ...browseSearch,
        ...updates,
        page: 1,
      },
    })
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-4">
      <div className="flex w-full shrink-0 flex-col gap-2">
        <div className="hidden md:block">
          <MoviesBrowseHeader
            heading={getBrowseHeading(browseSearch.view, browseSearch.q)}
            totalResults={totalResults}
          />
        </div>
        <MovieFilters
          q={browseSearch.q ?? ''}
          sortBy={browseSearch.sortBy}
          sortOrder={getMovieSortOrder(browseSearch.sortBy)}
          sortOptions={MOVIE_SORT_OPTIONS}
          isRefreshing={isRefetching}
          onSearchChange={handleSearchChange}
        />
      </div>
      <div className="relative min-h-0 flex-1 overflow-y-auto">
        <div className={cn(isRefetching && 'pointer-events-none')}>{children}</div>
        {isRefetching ? (
          <div
            aria-busy="true"
            aria-live="polite"
            className="absolute inset-0 z-10 flex items-center justify-center bg-background/10"
          >
            <Loader className="size-6 animate-spin text-primary" />
          </div>
        ) : null}
      </div>
      {totalPages != null ? <BrowseListPagination totalPages={totalPages} /> : null}
    </div>
  )
}

export function useClearBrowseFilters() {
  const navigate = browseRouteApi.useNavigate()

  return () => {
    void navigate({
      search: {
        ...browseSearchDefaults,
        q: undefined,
      },
    })
  }
}
