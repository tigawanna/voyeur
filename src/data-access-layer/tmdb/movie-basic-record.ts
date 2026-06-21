import type { MovieDetailsQueryResponse } from "#/data-access-layer/tmdb/generated/models/MovieDetails";
import type { MovieCardMovie, SavedMovieRef } from "#/types/movie";

export function fromSavedMovieRefToBasicRecord(movie: SavedMovieRef): MovieDetailsQueryResponse {
  return {
    id: movie.movieId,
    title: movie.title,
    poster_path: movie.posterPath,
    overview: "",
    backdrop_path: undefined,
    release_date: undefined,
    vote_average: 0,
    vote_count: 0,
    genres: [],
  };
}

export function fromCardMovieToBasicRecord(movie: MovieCardMovie): MovieDetailsQueryResponse {
  return {
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    poster_path: movie.poster_path,
    backdrop_path: movie.backdrop_path,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
    vote_count: movie.vote_count,
    genres: movie.genre_ids?.map((id) => ({ id })),
  };
}

// Strips a full TMDB detail response down to hero fields for movieBasicCollection.writeUpsert.
// Called automatically from movieDetailCollection queryFn — not from UI navigation.
export function toBasicMovieRecord(details: MovieDetailsQueryResponse): MovieDetailsQueryResponse {
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
  };
}
