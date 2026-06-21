import {
  favoritesCollection,
  watchlistCollection,
} from "#/data-access-layer/tmdb/query-collection";
import { Bookmark, BookmarkCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Movie } from "#/types/movie";
import { withViewTransition } from "#/utils/viewTransition";

interface MovieLibraryActionsProps {
  movie: Movie;
  isFavorite: boolean;
  isWatchlisted: boolean;
  compact?: boolean;
}

function toSavedRef(movie: Movie) {
  return {
    movieId: movie.id,
    title: movie.title,
    posterPath: movie.posterPath,
    addedAt: new Date().toISOString(),
  };
}

export function MovieLibraryActions({
  movie,
  isFavorite,
  isWatchlisted,
  compact = false,
}: MovieLibraryActionsProps) {
  async function toggleFavorite(currentlyFavorite: boolean) {
    if (currentlyFavorite) {
      await favoritesCollection.delete(movie.id);
      return;
    }

    await favoritesCollection.insert(toSavedRef(movie));
  }

  async function toggleWatchlist(currentlyWatchlisted: boolean) {
    if (currentlyWatchlisted) {
      await watchlistCollection.delete(movie.id);
      return;
    }

    await watchlistCollection.insert(toSavedRef(movie));
  }

  return (
    <div className={compact ? "flex gap-2" : "flex flex-wrap gap-3"}>
      <Button
        variant={isFavorite ? "default" : "secondary"}
        size={compact ? "icon" : "default"}
        data-testid="add-favorite-button"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        onClick={() => {
          withViewTransition(() => {
            void toggleFavorite(isFavorite);
          });
        }}
      >
        <Star className={isFavorite ? "fill-current" : ""} size={16} />
        {compact ? null : isFavorite ? "Favorited" : "Favorite"}
      </Button>
      <Button
        variant={isWatchlisted ? "default" : "secondary"}
        size={compact ? "icon" : "default"}
        data-testid="add-watchlist-button"
        aria-label={isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}
        onClick={() => {
          withViewTransition(() => {
            void toggleWatchlist(isWatchlisted);
          });
        }}
      >
        {isWatchlisted ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
        {compact ? null : isWatchlisted ? "On watchlist" : "Watchlist"}
      </Button>
    </div>
  );
}
