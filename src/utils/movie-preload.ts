import type { MovieDetails200 } from '#/data-access-layer/tmdb/generated/models/MovieDetails'
import { movieDetailsQueryOptions } from '#/data-access-layer/tmdb/query-options'
import type { Movie } from '#/types/movie'
import type { QueryClient } from '@tanstack/react-query'

export function movieViewTransitionName(movieId: number) {
  return `movie-${movieId}`
}

export function toMovieDetailsSeed(movie: Movie): MovieDetails200 {
  return {
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    poster_path: movie.posterPath ?? undefined,
    backdrop_path: movie.backdropPath ?? undefined,
    release_date: movie.releaseDate,
    vote_average: movie.voteAverage,
    vote_count: movie.voteCount,
  }
}

export function preloadMovie(queryClient: QueryClient, movie: Movie) {
  const options = movieDetailsQueryOptions(movie.id)

  queryClient.setQueryData(options.queryKey, toMovieDetailsSeed(movie))
  void queryClient.prefetchQuery(options)
}
