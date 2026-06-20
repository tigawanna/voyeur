import { SearchBox } from '#/components/filters/SearchBox'
import { SortDirectionButton } from '#/components/filters/SortDirectionButton'
import { Button } from '#/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import {
  flipMovieSortBy,
  getMovieSortLabel,
  getMovieSortOrder,
  MOVIE_SORT_OPTIONS,
  type MovieSortOption,
} from '#/types/movie-sort'
import { useDebouncer } from '@tanstack/react-pacer'
import { ArrowDownAZ, ArrowUpZA, SlidersHorizontal } from 'lucide-react'
import { useEffect, useState } from 'react'

export interface MovieFiltersProps {
  q: string
  sortBy: string
  sortOrder: string
  sortOptions?: MovieSortOption[]
  onSearchChange: (search: { q?: string; sortBy?: string }) => void
}

export function MovieFilters({
  q,
  sortBy,
  sortOrder,
  sortOptions = MOVIE_SORT_OPTIONS,
  onSearchChange,
}: MovieFiltersProps) {
  const [keyword, setKeyword] = useState(q)

  useEffect(() => {
    setKeyword(q)
  }, [q])

  const debouncer = useDebouncer(
    (search: string) => {
      onSearchChange({ q: search })
    },
    { wait: 1300 },
    (state) => ({ isPending: state.isPending }),
  )

  function handleKeywordChange(value: string) {
    setKeyword(value)
    debouncer.maybeExecute(value)
  }

  function handleSortByChange(value: string | null) {
    if (value) onSearchChange({ sortBy: value })
  }

  function handleSortOrderToggle() {
    onSearchChange({ sortBy: flipMovieSortBy(sortBy) })
  }

  const sortDirectionLabel = sortOrder === 'asc' ? 'ascending' : 'descending'
  const currentSortLabel = getMovieSortLabel(sortBy)

  return (
    <div className="flex w-full items-center gap-2">
      <div className="min-w-0 flex-1">
        <SearchBox
          keyword={keyword}
          debouncedValue={q}
          setKeyword={handleKeywordChange}
          isDebouncing={debouncer.state.isPending}
          inputProps={{ placeholder: 'Search movies...' }}
        />
      </div>

      <div className="hidden items-center gap-2 md:flex">
        <Select value={sortBy} onValueChange={handleSortByChange}>
          <SelectTrigger size="sm">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <SortDirectionButton sortOrder={getMovieSortOrder(sortBy)} onToggle={handleSortOrderToggle} />
      </div>

      <div className="md:hidden">
        <Popover>
          <PopoverTrigger>
            <Button variant="outline" size="icon" className="shrink-0">
              <SlidersHorizontal className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-56 space-y-3">
            <p className="text-xs font-medium text-muted-foreground">
              Sort by {currentSortLabel} · {sortDirectionLabel}
            </p>
            <Select value={sortBy} onValueChange={handleSortByChange}>
              <SelectTrigger size="sm" className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={handleSortOrderToggle}
            >
              {sortOrder === 'asc' ? (
                <ArrowDownAZ className="size-4" />
              ) : (
                <ArrowUpZA className="size-4" />
              )}
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
