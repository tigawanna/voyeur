import { Search } from 'lucide-react'
import { BROWSE_VIEWS, BROWSE_VIEW_LABELS } from '#/types/browse'
import { useBrowseSearchInput } from '#/features/movies/hooks/useBrowseSearchInput'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export function BrowseToolbar() {
  const { inputValue, onSearchChange, onViewChange, view, q, isSearchPending } = useBrowseSearchInput()
  const isSearchActive = Boolean(q?.trim())

  return (
    <div className="space-y-4">
      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={inputValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search movies by title"
          aria-label="Search movies"
          className={cn('h-10 pl-9', isSearchPending && 'pr-24')}
        />
        {isSearchPending ? (
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
            Searching…
          </span>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {BROWSE_VIEWS.map((browseView) => (
          <Button
            key={browseView}
            type="button"
            size="sm"
            variant={!isSearchActive && view === browseView ? 'default' : 'secondary'}
            onClick={() => onViewChange(browseView)}
          >
            {BROWSE_VIEW_LABELS[browseView]}
          </Button>
        ))}
      </div>
    </div>
  )
}
