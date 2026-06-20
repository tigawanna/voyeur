interface MoviesBrowseHeaderProps {
  heading: string
  totalResults?: number
}

export function MoviesBrowseHeader({ heading, totalResults }: MoviesBrowseHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4">
      <h1 className="text-xl font-extrabold tracking-tight md:text-2xl">{heading}</h1>
      {totalResults != null ? (
        <div className="flex shrink-0 items-center gap-2 rounded-lg border border-border/30 bg-muted/30 px-3 py-1.5">
          <span className="text-lg font-bold tabular-nums text-primary">
            {totalResults.toLocaleString()}
          </span>
          <span className="text-[10px] font-semibold uppercase leading-tight tracking-widest text-muted-foreground">
            movies
          </span>
        </div>
      ) : null}
    </header>
  )
}
