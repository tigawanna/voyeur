import { createFileRoute } from '@tanstack/react-router'
import { EmptyState } from '#/components/common/EmptyState'
import { Spinner } from '#/components/common/Spinner'
import { SavedMovieCard } from '#/features/movies/components/SavedMovieCard'
import { useFavoriteMovies } from '#/features/movies/hooks/useFavoriteMovies'

export const Route = createFileRoute('/_app/favorites/')({
  component: FavoritesPage,
})

function FavoritesPage() {
  const { favorites, isLoading } = useFavoriteMovies()

  return (
    <section>
      <div className="mb-8">
        <p className="island-kicker mb-2">Your stars</p>
        <h1 className="display-title text-4xl font-bold tracking-tight text-[var(--ink)] sm:text-5xl">
          Favorites
        </h1>
      </div>
      {isLoading ? <Spinner /> : null}
      {!isLoading && favorites.length === 0 ? (
        <EmptyState
          title="No favorites yet"
          description="Star a film on the browse timeline and it will land here instantly."
        />
      ) : null}
      <div className="grid gap-4">
        {favorites.map((movie) => (
          <SavedMovieCard key={movie.movieId} movie={movie} kind="favorite" />
        ))}
      </div>
    </section>
  )
}
