import { movieDetailCollection } from '#/data-access-layer/tmdb/query-collection'
import type { MovieDetailsQueryResponse } from '#/data-access-layer/tmdb/generated/models/MovieDetails'
import type { BrowseMovieWithLibrary, Movie } from '#/types/movie'

function browseRowToDetailRecord(
  movie: BrowseMovieWithLibrary,
): MovieDetailsQueryResponse {
  return {
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    poster_path: movie.poster_path ?? undefined,
    backdrop_path: movie.backdrop_path ?? undefined,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
    vote_count: movie.vote_count,
    genres: movie.genre_ids?.map((genreId) => ({ id: genreId })),
  }
}

function movieToDetailRecord(movie: Movie): MovieDetailsQueryResponse {
  return {
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    poster_path: movie.posterPath ?? undefined,
    backdrop_path: movie.backdropPath ?? undefined,
    release_date: movie.releaseDate,
    vote_average: movie.voteAverage,
    vote_count: movie.voteCount,
    genres: movie.genreIds.map((genreId) => ({ id: genreId })),
  }
}

export function seedMovieDetailFromBrowse(movie: BrowseMovieWithLibrary) {
  movieDetailCollection.utils.writeUpsert(browseRowToDetailRecord(movie))
}

export function seedMovieDetailFromMovie(movie: Movie) {
  movieDetailCollection.utils.writeUpsert(movieToDetailRecord(movie))
}
