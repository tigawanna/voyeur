import { Bookmark, BookmarkCheck, Star } from 'lucide-react'
import { Button } from '#/components/common/Button'
import { useMovieLibraryActions } from '#/features/movies/hooks/useMovieLibraryActions'
import type { Movie } from '#/types/movie'
import { withViewTransition } from '#/utils/viewTransition'

interface MovieLibraryActionsProps {
  movie: Movie
  isFavorite: boolean
  isWatchlisted: boolean
  compact?: boolean
}

export function MovieLibraryActions({
  movie,
  isFavorite,
  isWatchlisted,
  compact = false,
}: MovieLibraryActionsProps) {
  const { toggleFavorite, toggleWatchlist } = useMovieLibraryActions(movie)

  return (
    <div className={compact ? 'flex gap-2' : 'flex flex-wrap gap-3'}>
      <Button
        variant={isFavorite ? 'primary' : 'secondary'}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        onClick={() => {
          withViewTransition(() => {
            void toggleFavorite(isFavorite)
          })
        }}
      >
        <Star className={isFavorite ? 'fill-current' : ''} size={16} />
        {compact ? null : isFavorite ? 'Favorited' : 'Favorite'}
      </Button>
      <Button
        variant={isWatchlisted ? 'primary' : 'secondary'}
        aria-label={isWatchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
        onClick={() => {
          withViewTransition(() => {
            void toggleWatchlist(isWatchlisted)
          })
        }}
      >
        {isWatchlisted ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
        {compact ? null : isWatchlisted ? 'On watchlist' : 'Watchlist'}
      </Button>
    </div>
  )
}
