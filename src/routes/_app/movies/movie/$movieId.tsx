import {
  favoritesCollection,
  movieDetailCollection,
  watchlistCollection,
} from '#/data-access-layer/tmdb/query-collection'
import { MovieLibraryActions } from '#/features/movies/components/MovieLibraryActions'
import {
  MovieDetails,
  MovieDetailsBackButton,
} from '#/features/movies/components/MovieDetails'
import { MovieRecommendations } from '#/features/movies/components/MovieRecommendations'
import { mapTmdbMovieDetail } from '#/utils/tmdb-images'
import { withViewTransition } from '#/utils/viewTransition'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { eq, isUndefined, not, useLiveQuery } from '@tanstack/react-db'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { AlertCircle, Loader } from 'lucide-react'

export const Route = createFileRoute('/_app/movies/movie/$movieId')({
  component: MovieDetailsPage,
  ssr: false,
})

function MovieDetailsPage() {
  const { movieId } = Route.useParams()
  const router = useRouter()
  const id = Number(movieId)

  const {
    data: collectionRows,
    isLoading: isCollectionLoading,
    isError,
  } = useLiveQuery(
    (q) =>
      q
        .from({ movie: movieDetailCollection })
        .leftJoin({ favorite: favoritesCollection }, ({ movie, favorite }) =>
          eq(movie.id, favorite.movieId),
        )
        .leftJoin({ watchlist: watchlistCollection }, ({ movie, watchlist }) =>
          eq(movie.id, watchlist.movieId),
        )
        .where(({ movie }) => eq(movie.id, id))
        .select(({ movie, favorite, watchlist }) => ({
          ...movie,
          isFavorite: not(isUndefined(favorite)),
          isWatchlisted: not(isUndefined(watchlist)),
        })),
    [id],
  )

  const hasCollectionMovie = collectionRows.length > 0

  function goBack() {
    withViewTransition(() => {
      router.history.back()
    })
  }

  if (!Number.isFinite(id)) {
    return (
      <Empty className="my-12 rounded-2xl border border-border bg-card">
        <EmptyHeader>
          <EmptyTitle>Invalid movie</EmptyTitle>
          <EmptyDescription>This link does not point to a valid film.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (isCollectionLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader className="size-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!hasCollectionMovie) {
    return (
      <Empty className="my-12 rounded-2xl border border-border bg-card">
        <EmptyHeader>
          {isError ? (
            <EmptyMedia variant="icon">
              <AlertCircle />
            </EmptyMedia>
          ) : null}
          <EmptyTitle>Could not load movie</EmptyTitle>
          <EmptyDescription>
            {isError ? 'We could not load this film.' : 'This film could not be found.'}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  const movie = mapTmdbMovieDetail(collectionRows[0])

  return (
    <>
      <MovieDetails
        movie={movie}
        backAction={
          <MovieDetailsBackButton onClick={goBack}>Back to browse</MovieDetailsBackButton>
        }
        libraryActions={
          <MovieLibraryActions
            movie={movie}
            isFavorite={collectionRows[0].isFavorite}
            isWatchlisted={collectionRows[0].isWatchlisted}
          />
        }
      />
      <MovieRecommendations movieId={id} />
    </>
  )
}
