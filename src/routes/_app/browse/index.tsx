import { createFileRoute } from '@tanstack/react-router'
import { MovieTimeline } from '#/features/movies/components/MovieTimeline'

export const Route = createFileRoute('/_app/browse/')({
  component: BrowsePage,
})

function BrowsePage() {
  return (
    <section>
      <div className="mb-8">
        <p className="island-kicker mb-2">Live timeline</p>
        <h1 className="display-title text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Popular right now
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Streaming from TMDB through a Worker proxy, joined live with your local favorites and
          watchlist collections.
        </p>
      </div>
      <MovieTimeline />
    </section>
  )
}
