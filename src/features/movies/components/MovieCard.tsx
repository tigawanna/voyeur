import { Link } from '@tanstack/react-router'
import { MovieLibraryActions } from '#/features/movies/components/MovieLibraryActions'
import type { TimelineMovie } from '#/types/movie'
import { posterUrl } from '#/utils/tmdb-images'
import { cn } from '@/lib/utils'

interface MovieCardProps {
  movie: TimelineMovie
  className?: string
}

export function MovieCard({ movie, className }: MovieCardProps) {
  const image = posterUrl(movie.posterPath, 'w342')

  return (
    <article
      className={cn(
        'group island-shell rise-in overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)]',
        className,
      )}
      style={{ viewTransitionName: `movie-${movie.id}` }}
    >
      <Link
        to="/movie/$movieId"
        params={{ movieId: String(movie.id) }}
        className="block no-underline"
      >
        <div className="relative aspect-[2/3] overflow-hidden bg-[var(--surface-strong)]">
          {image ? (
            <img
              src={image}
              alt={movie.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-sm text-[var(--ink-soft)]">
              No poster
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(10,8,12,0.92)] to-transparent p-4 pt-16">
            <h3 className="line-clamp-2 text-base font-semibold text-white">{movie.title}</h3>
            <p className="mt-1 text-xs text-white/70">
              {movie.releaseDate ? movie.releaseDate.slice(0, 4) : 'TBA'} · ★{' '}
              {movie.voteAverage.toFixed(1)}
            </p>
          </div>
        </div>
      </Link>
      <div className="flex items-center justify-between gap-3 p-4">
        <p className="m-0 line-clamp-2 flex-1 text-sm text-[var(--ink-soft)]">{movie.overview}</p>
        <MovieLibraryActions
          movie={movie}
          isFavorite={movie.isFavorite}
          isWatchlisted={movie.isWatchlisted}
          compact
        />
      </div>
    </article>
  )
}
