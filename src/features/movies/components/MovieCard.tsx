import { MovieLibraryActions } from '#/features/movies/components/MovieLibraryActions'
import type { MovieCardMovie } from '#/types/movie'
import { posterUrl, mapTmdbMovie } from '#/utils/tmdb-images'
import { movieViewTransitionName } from '#/utils/movie-view-transition'
import { withViewTransition } from '#/utils/viewTransition'
import { cn } from '@/lib/utils'
import { Link, useNavigate } from '@tanstack/react-router'

interface MovieCardProps {
  movie: MovieCardMovie
  className?: string
}

export function MovieCard({ movie, className }: MovieCardProps) {
  const navigate = useNavigate()
  const timelineMovie = mapTmdbMovie(movie)
  const image = posterUrl(timelineMovie.posterPath, 'w342')

  return (
    <article
      className={cn(
        'group island-shell rise-in overflow-hidden rounded-2xl border border-border bg-card',
        className,
      )}
    >
      <Link
        to="/movies/movie/$movieId"
        params={{ movieId: String(timelineMovie.id) }}
        className="block no-underline"
        onClick={(event) => {
          event.preventDefault()
          withViewTransition(() => {
            void navigate({
              to: '/movies/movie/$movieId',
              params: { movieId: String(timelineMovie.id) },
            })
          })
        }}
      >
        <div className="relative aspect-2/3 overflow-hidden bg-muted">
          {image ? (
            <img
              src={image}
              alt={timelineMovie.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
              loading="lazy"
              style={{ viewTransitionName: movieViewTransitionName(timelineMovie.id) }}
            />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-sm text-muted-foreground">
              No poster
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-[rgba(10,8,12,0.92)] to-transparent p-4 pt-16">
            <h3 className="line-clamp-2 text-base font-semibold text-white">
              {timelineMovie.title}
            </h3>
            <p className="mt-1 text-xs text-white/70">
              {timelineMovie.releaseDate ? timelineMovie.releaseDate.slice(0, 4) : 'TBA'} · ★{' '}
              {timelineMovie.voteAverage.toFixed(1)}
            </p>
          </div>
        </div>
      </Link>
      <div className="flex flex-col gap-3 p-4">
        <p className="m-0 line-clamp-2 text-sm text-muted-foreground">{timelineMovie.overview}</p>
        <MovieLibraryActions
          movie={timelineMovie}
          isFavorite={movie.isFavorite}
          isWatchlisted={movie.isWatchlisted}
          compact
        />
      </div>
    </article>
  )
}
