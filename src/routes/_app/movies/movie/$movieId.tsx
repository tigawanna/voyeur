import {
  favoritesCollection,
  movieBasicCollection,
  movieDetailCollection,
  movieRecommendationsCollection,
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
import { eq, useLiveQuery } from '@tanstack/react-db'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { AlertCircle, Loader } from 'lucide-react'
import { useEffect } from 'react'

export const Route = createFileRoute('/_app/movies/movie/$movieId')({
  component: MovieDetailsPage,
  ssr: false,
})

function MovieDetailsPage() {
  const { movieId } = Route.useParams()
  const router = useRouter()
  const id = Number(movieId)

  // Cached summary (poster, title, overview) written by movieDetailCollection after a prior fetch.
  // Used on return visits when browse data is not loaded.
  const { data: basicRows } = useLiveQuery(
    (q) =>
      q
        .from({ movie: movieBasicCollection })
        .where(({ movie }) => eq(movie.id, id)),
    [id],
  )

  // Browse list row for this id when the user navigated from the movies grid.
  // Gives instant hero content without waiting for the detail API.
  const { data: browseRows } = useLiveQuery(
    (q) =>
      q
        .from({ movie: moviesCollection })
        .where(({ movie }) => eq(movie.id, id)),
    [id],
  )

  // Recommendation row for this id when the user navigated from the recommendations grid.
  const { data: recommendationRows } = useLiveQuery(
    (q) =>
      q
        .from({ movie: movieRecommendationsCollection })
        .where(({ movie }) => eq(movie.id, id)),
    [id],
  )

  // Full detail fetch; triggers the TMDB API and seeds movieBasicCollection on success.
  // Also used as the last fallback for summaryRow on hard refresh / direct URL.
  const {
    data: detailRows,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useLiveQuery(
    (q) =>
      q
        .from({ movie: movieDetailCollection })
        .where(({ movie }) => eq(movie.id, id)),
    [id],
  )

  // Local favorites collection — drives the favorite toggle state.
  const { data: favoriteRows } = useLiveQuery(
    (q) =>
      q
        .from({ favorite: favoritesCollection })
        .where(({ favorite }) => eq(favorite.movieId, id)),
    [id],
  )

  // Local watchlist collection — drives the watchlist toggle state.
  const { data: watchlistRows } = useLiveQuery(
    (q) =>
      q
        .from({ watchlist: watchlistCollection })
        .where(({ watchlist }) => eq(watchlist.movieId, id)),
    [id],
  )

  // First available source wins: cached basic → browse → recommendations → freshly fetched detail.
  const summaryRow =
    basicRows.at(0) ??
    browseRows.at(0) ??
    recommendationRows.at(0) ??
    detailRows.at(0)
  // Full-page spinner only when nothing to show yet and the detail fetch is in flight.
  const showPageLoader = summaryRow == null && isDetailLoading

  useEffect(() => {
    console.log('[movie-detail] page state', {
      id,
      basicRowsCount: basicRows.length,
      basicRowId: basicRows.at(0)?.id,
      browseRowsCount: browseRows.length,
      browseRowId: browseRows.at(0)?.id,
      recommendationRowsCount: recommendationRows.length,
      recommendationRowId: recommendationRows.at(0)?.id,
      detailRowsCount: detailRows.length,
      detailRowId: detailRows.at(0)?.id,
      isDetailLoading,
      summaryRowSource: basicRows.at(0)
        ? 'basic'
        : browseRows.at(0)
          ? 'browse'
          : recommendationRows.at(0)
            ? 'recommendation'
            : detailRows.at(0)
              ? 'detail'
              : null,
      summaryRowId: summaryRow?.id,
      showPageLoader,
    })
  }, [
    id,
    basicRows,
    browseRows,
    recommendationRows,
    detailRows,
    isDetailLoading,
    summaryRow,
    showPageLoader,
  ])

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

  if (showPageLoader) {
    console.log('[movie-detail] showing full-page spinner', { id })
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader className="size-6 animate-spin text-primary" />
      </div>
    )
  }

  if (summaryRow == null) {
    return (
      <Empty className="my-12 rounded-2xl border border-border bg-card">
        <EmptyHeader>
          {isDetailError ? (
            <EmptyMedia variant="icon">
              <AlertCircle />
            </EmptyMedia>
          ) : null}
          <EmptyTitle>Could not load movie</EmptyTitle>
          <EmptyDescription>
            {isDetailError ? 'We could not load this film.' : 'This film could not be found.'}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  const movie = mapTmdbMovie(summaryRow)
  const isFavorite = favoriteRows.length > 0
  const isWatchlisted = watchlistRows.length > 0

  return (
    <>
      <MovieDetails
        movie={movie}
        movieId={id}
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
      <MovieRecommendations movieId={id} />
    </>
  )
}
