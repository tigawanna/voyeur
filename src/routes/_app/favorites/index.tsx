import { SavedMovieCard } from '#/features/movies/components/SavedMovieCard'
import { useFavoriteMovies } from '#/features/movies/hooks/useFavoriteMovies'
import { LoadingState } from '@/components/common/LoadingState'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/favorites/')({
  component: FavoritesPage,
})

function FavoritesPage() {
  const { favorites, isLoading } = useFavoriteMovies()

  return (
    <section>
      <div className="mb-8">
        <p className="island-kicker mb-2">Your stars</p>
        <h1 className="display-title text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
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
      <div className="grid gap-4">
        {favorites.map((movie) => (
          <SavedMovieCard key={movie.movieId} movie={movie} kind="favorite" />
        ))}
      </div>
    </section>
  )
}
