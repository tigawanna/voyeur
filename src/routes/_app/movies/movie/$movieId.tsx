import {
  movieDetailsQueryOptions,
  movieRecommendationsQueryOptions,
} from '#/data-access-layer/tmdb/query-options'
import {
  favoritesCollection,
  moviesCollection,
  watchlistCollection,
} from '#/data-access-layer/tmdb/query-collection'
import { MovieLibraryActions } from '#/features/movies/components/MovieLibraryActions'
import {
  MovieDetails,
  MovieDetailsBackButton,
} from '#/features/movies/components/MovieDetails'
import { MovieRecommendations } from '#/features/movies/components/MovieRecommendations'
import { mapTmdbMovie } from '#/utils/tmdb-images'
import { withViewTransition } from '#/utils/viewTransition'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { eq, isUndefined, not, useLiveQuery } from '@tanstack/react-db'
import { useQuery } from '@tanstack/react-query'
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

  const { data: collectionRows, isLoading: isCollectionLoading } = useLiveQuery(
    (q) =>
      q
        .from({ movie: moviesCollection })
        .leftJoin({ favorite: favoritesCollection }, ({ movie, favorite }) =>
          eq(movie.id, favorite.movieId),
        )
        .leftJoin({ watchlist: watchlistCollection }, ({ movie, watchlist }) =>
          eq(movie.id, watchlist.movieId),
        )
        .where(({ movie }) => eq(movie.id, id))
        .orderBy(({ movie }) => movie.id, 'asc')
        .limit(1)
        .select(({ movie, favorite, watchlist }) => ({
          ...movie,
          isFavorite: not(isUndefined(favorite)),
          isWatchlisted: not(isUndefined(watchlist)),
        })),
    [id],
  )

  const collectionMovie = collectionRows[0]

  const {
    data: fetchedDetails,
    isPending: isDetailsPending,
    isError,
    error,
  } = useQuery({
    ...movieDetailsQueryOptions(id),
    enabled: Number.isFinite(id) && !isCollectionLoading && !collectionMovie,
  })

  const { data: recommendationsResponse, isPending: isRecommendationsLoading } = useQuery({
    ...movieRecommendationsQueryOptions(id),
    enabled: Number.isFinite(id),
    select: (response) => (response.results ?? []).map(mapTmdbMovie),
  })

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

  const isPending = isCollectionLoading || (!collectionMovie && isDetailsPending)

  if (isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader className="size-6 animate-spin text-primary" />
      </div>
    )
  }

  if (isError && !collectionMovie) {
    return (
      <Empty className="my-12 rounded-2xl border border-border bg-card">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertCircle />
          </EmptyMedia>
          <EmptyTitle>Could not load movie</EmptyTitle>
          <EmptyDescription>{error.message}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  const movie = mapTmdbMovie(collectionMovie ?? fetchedDetails!)
  const isFavorite = collectionMovie?.isFavorite ?? false
  const isWatchlisted = collectionMovie?.isWatchlisted ?? false

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
            isFavorite={isFavorite}
            isWatchlisted={isWatchlisted}
          />
        }
      />
      <MovieRecommendations
        recommendations={recommendationsResponse ?? []}
        isLoading={isRecommendationsLoading}
      />
    </>
  )
}
