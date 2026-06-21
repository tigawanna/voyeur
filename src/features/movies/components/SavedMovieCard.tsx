import { Link } from '@tanstack/react-router'
import { Bookmark, Star } from 'lucide-react'
import type { SavedMovieRef } from '#/types/movie'
import { posterUrl } from '#/utils/tmdb-images'
import { CachedImage } from '@/components/common/CachedImage'
import { cn } from '@/lib/utils'

interface SavedMovieCardProps {
  movie: SavedMovieRef
  kind: 'favorite' | 'watchlist'
}

export function SavedMovieCard({ movie, kind }: SavedMovieCardProps) {
  const image = posterUrl(movie.posterPath, 'w342')
  const Icon = kind === 'favorite' ? Star : Bookmark

  return (
    <div className={cn('overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm')}>
      <Link
        to="/movies/movie/$movieId"
        params={{ movieId: String(movie.movieId) }}
        className="flex gap-4 p-4 no-underline"
      >
        <div className="h-28 w-20 shrink-0 overflow-hidden rounded-xl bg-base-300">
          {image ? (
            <CachedImage
              src={image}
              alt={movie.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2 text-primary">
            <Icon size={16} />
            <span className="text-xs font-semibold tracking-wide uppercase">
              {kind === 'favorite' ? 'Favorite' : 'Watchlist'}
            </span>
          </div>
          <h3 className="line-clamp-2 text-lg font-semibold">{movie.title}</h3>
          <p className="mt-2 text-xs text-muted-foreground">
            Saved {new Date(movie.addedAt).toLocaleDateString()}
          </p>
        </div>
      </Link>
    </div>
  )
}
