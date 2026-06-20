import { Globe2, Languages, Search } from 'lucide-react'
import {
  BROWSE_LANGUAGES,
  BROWSE_REGIONS,
  BROWSE_VIEWS,
  BROWSE_VIEW_LABELS,
  type BrowseLanguageCode,
  type BrowseRegionCode,
} from '#/types/browse'
import { useBrowseSearchInput } from '#/features/movies/hooks/useBrowseSearchInput'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export function BrowseToolbar() {
  const {
    inputValue,
    onSearchChange,
    onViewChange,
    onRegionChange,
    onLanguageChange,
    view,
    region,
    language,
    q,
    isSearchPending,
  } = useBrowseSearchInput()
  const isSearchActive = Boolean(q?.trim())

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative max-w-xl flex-1">
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

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Globe2 className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <Select value={region} onValueChange={(value) => onRegionChange(value as BrowseRegionCode)}>
              <SelectTrigger className="h-10 w-44 bg-background" aria-label="Cinema region">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {BROWSE_REGIONS.map((item) => (
                  <SelectItem key={item.code} value={item.code}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Languages className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <Select value={language} onValueChange={(value) => onLanguageChange(value as BrowseLanguageCode)}>
              <SelectTrigger className="h-10 w-48 bg-background" aria-label="Language">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {BROWSE_LANGUAGES.map((item) => (
                  <SelectItem key={item.code} value={item.code}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
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
