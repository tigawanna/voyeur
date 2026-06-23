import { db } from "#/data-access-layer/tmdb/local-library-db";
import { movieRecommendationsCollection } from "#/data-access-layer/tmdb/query-collection";
import { MovieCard } from "#/features/movies/components/MovieCard";
import type { RecommendationMovieWithLibrary } from "#/types/movie";
import { eq, isUndefined, not, useLiveQuery } from "@tanstack/react-db";
import { Loader } from "lucide-react";

interface MovieRecommendationsProps {
  movieId: number;
}

export function MovieRecommendations({ movieId }: MovieRecommendationsProps) {
  const { data: recommendations, isLoading } = useLiveQuery(
    (q) =>
      q
        .from({ movie: movieRecommendationsCollection })
        .leftJoin({ favorite: db.collections.favorites }, ({ movie, favorite }) =>
          eq(movie.id, favorite.movieId),
        )
        .leftJoin({ watchlist: db.collections.watchlist }, ({ movie, watchlist }) =>
          eq(movie.id, watchlist.movieId),
        )
        .where(({ movie }) => eq(movie.sourceMovieId, movieId))
        .select(({ movie, favorite, watchlist }) => ({
          ...movie,
          isFavorite: not(isUndefined(favorite)),
          isWatchlisted: not(isUndefined(watchlist)),
        })),
    [movieId],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="size-5 animate-spin text-primary" />
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 border-t border-border pt-10" data-testid="movie-recommendations">
      <div className="mb-6">
        <p className="island-kicker mb-2">Because you opened this</p>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          You might also like
        </h2>
      </div>
      <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
        {recommendations.map((movie) => (
          <MovieCard key={movie.id} movie={movie as RecommendationMovieWithLibrary} />
        ))}
      </div>
    </section>
  );
}
