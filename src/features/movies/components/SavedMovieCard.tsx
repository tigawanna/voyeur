import { fromSavedMovieRefToBasicRecord } from '#/data-access-layer/tmdb/movie-basic-record'
import { useMovieDetailIntent } from '#/features/movies/hooks/useMovieDetailIntent'
import type { SavedMovieRef } from '#/types/movie'
import { movieViewTransitionName } from '#/utils/movie-view-transition'
import { posterUrl } from '#/utils/tmdb-images'
import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import { Bookmark, Star } from 'lucide-react'
import { useCallback } from 'react'

interface SavedMovieCardProps {
  movie: SavedMovieRef
  kind: 'favorite' | 'watchlist'
  className?: string
}

export function SavedMovieCard({ movie, kind, className }: SavedMovieCardProps) {
  const image = posterUrl(movie.posterPath, 'w342')
  const Icon = kind === 'favorite' ? Star : Bookmark
  const { seedOnIntent, goToDetail } = useMovieDetailIntent(
    movie.movieId,
    useCallback(() => fromSavedMovieRefToBasicRecord(movie), [movie]),
  )

  return (
    <article
      className={cn(
        'group overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm',
        className,
      )}
    >
      <Link
        to="/movies/movie/$movieId"
        params={{ movieId: String(movie.movieId) }}
        className="block no-underline"
        onMouseEnter={seedOnIntent}
        onTouchStart={seedOnIntent}
        onClick={(event) => {
          event.preventDefault()
          goToDetail()
        }}
      >
        <div className="relative aspect-2/3 overflow-hidden bg-muted">
          {image ? (
            <img
              src={image}
              alt={movie.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
              loading="lazy"
              style={{ viewTransitionName: movieViewTransitionName(movie.movieId) }}
            />
          ) : (
            <div
              className="flex h-full items-center justify-center px-3 text-center text-xs text-muted-foreground"
              style={{ viewTransitionName: movieViewTransitionName(movie.movieId) }}
            >
              No poster
            </div>
          )}
          <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[10px] font-semibold tracking-wide text-white uppercase backdrop-blur-sm">
            <Icon className="size-3" />
            {kind === 'favorite' ? 'Starred' : 'Queued'}
          </div>
        </div>
        <div className="space-y-1 p-2.5">
          <h3 className="line-clamp-2 text-sm leading-snug font-semibold text-foreground">
            {movie.title}
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Saved {new Date(movie.addedAt).toLocaleDateString()}
          </p>
        </div>
      </Link>
    </article>
  )
}
