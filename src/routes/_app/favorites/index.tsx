import { db } from "#/data-access-layer/tmdb/local-library-db";
import { movieBasicCollection } from "#/data-access-layer/tmdb/query-collection";
import { SavedMovieCard } from "#/features/movies/components/SavedMovieCard";
import { LoadingState } from "@/components/common/LoadingState";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";
import type { SavedMovieRef } from "#/types/movie";

export const Route = createFileRoute("/_app/favorites/")({
  component: FavoritesPage,
});

function FavoritesPage() {
  useLiveQuery((q) => q.from({ movie: movieBasicCollection }), []);

  const { data, isLoading } = useLiveQuery(
    (query) =>
      query.from({ favorite: db.collections.favorites }).select(({ favorite }) => ({
        movieId: favorite.movieId,
        title: favorite.title,
        posterPath: favorite.posterPath,
        addedAt: favorite.addedAt,
      })),
    [],
  );

  const favorites = (data ?? []) as SavedMovieRef[];

  return (
    <section>
      <div className="mb-4 sm:mb-8">
        <p className="island-kicker mb-2">Your stars</p>
        <h1 className="display-title text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Favorites
        </h1>
      </div>
      {isLoading ? <LoadingState /> : null}
      {!isLoading && favorites.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No favorites yet</EmptyTitle>
            <EmptyDescription>
              Star a film on the browse timeline and it will land here instantly.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : null}
      <div
        className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7"
        data-testid="favorites-grid"
      >
        {favorites.map((movie) => (
          <SavedMovieCard key={movie.movieId} movie={movie} kind="favorite" />
        ))}
      </div>
    </section>
  );
}
