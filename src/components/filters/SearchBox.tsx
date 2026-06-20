import { Input } from '@/components/ui/input'
import { Loader, Search, X } from 'lucide-react'
import { useRef } from 'react'

interface SearchBoxProps {
  debouncedValue: string
  setKeyword: (value: string) => void
  isDebouncing: boolean
  isRefreshing?: boolean
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  keyword: string
}

export function SearchBox({
  isDebouncing,
  isRefreshing = false,
  setKeyword,
  keyword,
  inputProps,
}: SearchBoxProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const hasValue = keyword.length > 0
  const showSpinner = isDebouncing || isRefreshing

  return (
    <div className="sticky top-0 w-full">
      <div className="group relative w-full">
        <Search className="pointer-events-none absolute inset-y-0 left-3 my-auto size-4 text-muted-foreground transition-colors group-focus-within:text-foreground" />
        <Input
          ref={inputRef}
          placeholder="Search movies..."
          className="w-full rounded-full border-muted-foreground/20 bg-muted/40 pl-9 pr-9 backdrop-blur-sm placeholder:text-muted-foreground/60 focus-visible:bg-background"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value)
          }}
          {...inputProps}
        />
        <div className="absolute inset-y-0 right-2 flex items-center gap-1">
          {showSpinner ? <Loader className="size-3.5 animate-spin text-muted-foreground" /> : null}
          {hasValue ? (
            <button
              type="button"
              onClick={() => {
                setKeyword('')
                inputRef.current?.focus()
              }}
              className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
