import { movieRecommendationsQueryOptions } from '#/data-access-layer/tmdb/query-options'
import { posterUrl, mapTmdbMovie } from '#/utils/tmdb-images'
import { movieViewTransitionName } from '#/utils/movie-view-transition'
import { withViewTransition } from '#/utils/viewTransition'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { Loader } from 'lucide-react'

interface MovieRecommendationsProps {
  movieId: number
}

export function MovieRecommendations({ movieId }: MovieRecommendationsProps) {
  const navigate = useNavigate()

  const { data: recommendations, isPending } = useQuery({
    ...movieRecommendationsQueryOptions(movieId),
    enabled: Number.isFinite(movieId),
    select: (response) => response.results.map(mapTmdbMovie),
  })

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="size-5 animate-spin text-primary" />
      </div>
    )
  }

  if (!recommendations?.length) {
    return null
  }

  return (
    <section className="mt-12 border-t border-border pt-10">
      <div className="mb-6">
        <p className="island-kicker mb-2">Because you opened this</p>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">You might also like</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {recommendations.map((movie) => {
          const image = posterUrl(movie.posterPath, 'w342')
          const year = movie.releaseDate ? movie.releaseDate.slice(0, 4) : 'TBA'

          return (
            <article
              key={movie.id}
              className="island-shell overflow-hidden rounded-2xl border border-border bg-card"
            >
              <Link
                to="/movies/movie/$movieId"
                params={{ movieId: String(movie.id) }}
                className="block no-underline"
                onClick={(event) => {
                  event.preventDefault()
                  withViewTransition(() => {
                    void navigate({
                      to: '/movies/movie/$movieId',
                      params: { movieId: String(movie.id) },
                    })
                  })
                }}
              >
                <div className="relative aspect-2/3 overflow-hidden bg-muted">
                  {image ? (
                    <img
                      src={image}
                      alt={movie.title}
                      className="h-full w-full object-cover transition duration-300 hover:scale-[1.03]"
                      loading="lazy"
                      style={{ viewTransitionName: movieViewTransitionName(movie.id) }}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-4 text-center text-sm text-muted-foreground">
                      No poster
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-2 text-base font-semibold text-foreground">
                    {movie.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {year} · ★ {movie.voteAverage.toFixed(1)}
                  </p>
                </div>
              </Link>
            </article>
          )
        })}
      </div>
    </section>
  )
}
