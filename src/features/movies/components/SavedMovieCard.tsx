import { fromSavedMovieRefToBasicRecord } from '#/data-access-layer/tmdb/movie-basic-record'
import { movieBasicCollection } from '#/data-access-layer/tmdb/query-collection'
import type { SavedMovieRef } from '#/types/movie'
import { movieViewTransitionName } from '#/utils/movie-view-transition'
import { posterUrl } from '#/utils/tmdb-images'
import { withViewTransition } from '#/utils/viewTransition'
import { cn } from '@/lib/utils'
import { Link, useNavigate } from '@tanstack/react-router'
import { Bookmark, Star } from 'lucide-react'
import { useCallback, useRef } from 'react'

interface SavedMovieCardProps {
  movie: SavedMovieRef
  kind: 'favorite' | 'watchlist'
  className?: string
}

export function SavedMovieCard({ movie, kind, className }: SavedMovieCardProps) {
  const navigate = useNavigate()
  const seededBasicRef = useRef(false)
  const image = posterUrl(movie.posterPath, 'w342')
  const Icon = kind === 'favorite' ? Star : Bookmark

  const seedBasicOnIntent = useCallback(() => {
    if (seededBasicRef.current) return
    seededBasicRef.current = true
    movieBasicCollection.utils.writeUpsert(fromSavedMovieRefToBasicRecord(movie))
  }, [movie])

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
        onMouseEnter={seedBasicOnIntent}
        onTouchStart={seedBasicOnIntent}
        onClick={(event) => {
          event.preventDefault()
          seedBasicOnIntent()
          withViewTransition(() => {
            void navigate({
              to: '/movies/movie/$movieId',
              params: { movieId: String(movie.movieId) },
            })
          })
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
