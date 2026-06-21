import type { MovieDetailsQueryResponse } from '#/data-access-layer/tmdb/generated/models/MovieDetails'

export function toBasicMovieRecord(
  details: MovieDetailsQueryResponse,
): MovieDetailsQueryResponse {
  return {
    id: details.id,
    title: details.title,
    overview: details.overview,
    poster_path: details.poster_path,
    backdrop_path: details.backdrop_path,
    release_date: details.release_date,
    vote_average: details.vote_average,
    vote_count: details.vote_count,
    genres: details.genres,
  }
}
