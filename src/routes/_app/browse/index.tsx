import { createFileRoute } from '@tanstack/react-router'
import { BrowseToolbar } from '#/features/movies/components/BrowseToolbar'
import { MovieTimeline } from '#/features/movies/components/MovieTimeline'
import { browseSearchSchema, getBrowseHeading } from '#/types/browse'

export const Route = createFileRoute('/_app/browse/')({
  validateSearch: browseSearchSchema,
  component: BrowsePage,
})

function BrowsePage() {
  const { view, q } = Route.useSearch()

  return (
    <section>
      <div className="mb-8 space-y-6">
        <div>
          <p className="island-kicker mb-2">Live timeline</p>
          <h1 className="display-title text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {getBrowseHeading(view, q)}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Streaming from TMDB through a Worker proxy, joined live with your local favorites and
            watchlist collections.
          </p>
        </div>
        <BrowseToolbar />
      </div>
      <MovieTimeline />
    </section>
  )
}
