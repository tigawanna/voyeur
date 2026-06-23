import { db } from "#/data-access-layer/tmdb/local-library-db";
import { movieBasicCollection } from "#/data-access-layer/tmdb/query-collection";
import { SavedMovieCard } from "#/features/movies/components/SavedMovieCard";
import { LoadingState } from "@/components/common/LoadingState";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/watchlist/")({
  component: WatchlistPage,
});

function WatchlistPage() {
  useLiveQuery((q) => q.from({ movie: movieBasicCollection }), []);

  const { data, isLoading } = useLiveQuery(
    (query) =>
      query.from({ watchlist: db.collections.watchlist }).select(({ watchlist }) => ({
        movieId: watchlist.movieId,
        title: watchlist.title,
        posterPath: watchlist.posterPath,
        addedAt: watchlist.addedAt,
      })),
    [],
  );

  const watchlist = data

  return (
    <section>
      <div className="mb-8">
        <p className="island-kicker mb-2">Up next</p>
        <h1 className="display-title text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Watchlist
        </h1>
      </div>
      {isLoading ? <LoadingState /> : null}
      {!isLoading && watchlist.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Watchlist is empty</EmptyTitle>
            <EmptyDescription>
              Queue films from the timeline when you want a personal shortlist.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : null}
      <div
        className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7"
        data-testid="watchlist-grid"
      >
        {watchlist.map((movie) => (
          <SavedMovieCard key={movie.movieId} movie={movie} kind="watchlist" />
        ))}
      </div>
    </section>
  );
}
