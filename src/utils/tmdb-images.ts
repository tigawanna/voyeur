import type { Movie } from '#/types/movie'
import type { TmdbMovieDetail, TmdbMovieResult } from '#/types/tmdb'

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'

export function posterUrl(path: string | null, size: 'w342' | 'w500' | 'original' = 'w500') {
  if (!path) return null
  return `${TMDB_IMAGE_BASE}/${size}${path}`
}

export function backdropUrl(path: string | null, size: 'w780' | 'w1280' | 'original' = 'w1280') {
  if (!path) return null
  return `${TMDB_IMAGE_BASE}/${size}${path}`
}

export function mapTmdbMovie(movie: TmdbMovieResult | TmdbMovieDetail): Movie {
  const genreIds =
    'genres' in movie && movie.genres
      ? movie.genres.map((genre) => genre.id)
      : movie.genre_ids

  return {
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    posterPath: movie.poster_path,
    backdropPath: movie.backdrop_path,
    releaseDate: movie.release_date,
    voteAverage: movie.vote_average,
    voteCount: movie.vote_count,
    genreIds,
  }
}
