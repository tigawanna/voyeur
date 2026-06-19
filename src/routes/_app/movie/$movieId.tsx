import { movieDetailsQueryOptions } from '#/data-access-layer/tmdb/query-functions'
import { backdropUrl, posterUrl } from '#/utils/tmdb-images'
import { LoadingState } from '@/components/common/LoadingState'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/movie/$movieId')({
  component: MovieDetailPage,
})

function MovieDetailPage() {
  const { movieId } = Route.useParams()
  const numericId = Number(movieId)

  const { data: movie, isLoading, isError } = useQuery({
    ...movieDetailsQueryOptions(numericId),
    enabled: Number.isFinite(numericId),
  })

  // const { data: favorites } = useLiveQuery((query) =>
  //   query.from({ favorite: favoritesCollection }).select(({ favorite }) => favorite.movieId),
  // )

  // const { data: watchlist } = useLiveQuery((query) =>
  //   query.from({ watchlist: watchlistCollection }).select(({ watchlist }) => watchlist.movieId),
  // )

  if (isLoading) return <LoadingState label="Loading movie" />
  if (isError || !movie) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Movie not found</EmptyTitle>
          <EmptyDescription>This title could not be loaded from TMDB.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  const hero = backdropUrl(movie.backdropPath) ?? posterUrl(movie.posterPath)


  return (
    <article style={{ viewTransitionName: `movie-${movie.id}` }}>
      <div className="island-shell overflow-hidden rounded-4xl border border-border">
        <div className="relative min-h-72 overflow-hidden bg-muted">
          {hero ? (
            <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
          ) : null}
          <div className="absolute inset-0 bg-linear-to-t from-[rgba(10,8,12,0.95)] via-[rgba(10,8,12,0.45)] to-transparent" />
          <div className="relative grid gap-8 p-8 lg:grid-cols-[180px_1fr] lg:items-end">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30 shadow-2xl">
              {posterUrl(movie.posterPath) ? (
                <img
                  src={posterUrl(movie.posterPath)!}
                  alt={movie.title}
                  className="aspect-2/3 w-full object-cover"
                />
              ) : null}
            </div>
            <div>
              <p className="island-kicker mb-3 text-white/70">Now showing</p>
              <h1 className="display-title mb-4 text-4xl font-bold text-white sm:text-6xl">{movie.title}</h1>
              <p className="mb-6 max-w-3xl text-sm text-white/75 sm:text-base">{movie.overview}</p>
              <div className="mb-6 flex flex-wrap gap-4 text-sm text-white/70">
                <span>{movie.releaseDate || 'Release TBA'}</span>
                <span>★ {movie.voteAverage.toFixed(1)}</span>
                <span>{movie.voteCount.toLocaleString()} votes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
