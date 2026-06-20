import { movieDetailsQueryOptions } from '#/data-access-layer/tmdb/query-options'
import {
  MovieDetails,
  MovieDetailsBackButton,
} from '#/features/movies/components/MovieDetails'
import { mapTmdbMovie } from '#/utils/tmdb-images'
import { withViewTransition } from '#/utils/viewTransition'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { AlertCircle, Loader } from 'lucide-react'

export const Route = createFileRoute('/_app/movies/movie/$movieId')({
  loader: async ({ context, params }) => {
    const movieId = Number(params.movieId)
    if (Number.isNaN(movieId)) return

    return context.queryClient.fetchQuery(movieDetailsQueryOptions(movieId))
  },
  component: MovieDetailsPage,
})

function MovieDetailsPage() {
  const { movieId } = Route.useParams()
  const router = useRouter()
  const id = Number(movieId)

  const { data, isPending, isError, error } = useQuery(movieDetailsQueryOptions(id))

  function goBack() {
    withViewTransition(() => {
      router.history.back()
    })
  }

  if (isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader className="size-6 animate-spin text-primary" />
      </div>
    )
  }

  if (isError && !data) {
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

  const movie = mapTmdbMovie(data)

  return (
    <MovieDetails
      movie={movie}
      backAction={
        <MovieDetailsBackButton onClick={goBack}>Back to browse</MovieDetailsBackButton>
      }
    />
  )
}
