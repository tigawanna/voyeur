import { ArrowDownAZ, ArrowUpZA } from "lucide-react"

export function SortDirectionButton({
  sortOrder,
  onToggle,
}: {
  sortOrder: string
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-transparent text-muted-foreground shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
      aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
    >
      {sortOrder === 'asc' ? (
        <ArrowDownAZ className="size-4" />
      ) : (
        <ArrowUpZA className="size-4" />
      )}
    </button>
  )
}
