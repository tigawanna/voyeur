import type { MovieDetails200 } from '#/data-access-layer/tmdb/generated/models/MovieDetails'
import type { MoviePopularList200 } from '#/data-access-layer/tmdb/generated/models/MoviePopularList'
import type { Movie } from '#/types/movie'

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'

type PopularMovieResult = NonNullable<MoviePopularList200['results']>[number]

export function posterUrl(path: string | null | undefined, size: 'w342' | 'w500' | 'original' = 'w500') {
  if (!path) return null
  return `${TMDB_IMAGE_BASE}/${size}${path}`
}

export function backdropUrl(path: string | null | undefined, size: 'w780' | 'w1280' | 'original' = 'w1280') {
  if (!path) return null
  return `${TMDB_IMAGE_BASE}/${size}${path}`
}

export function mapTmdbMovie(movie: PopularMovieResult | MovieDetails200): Movie {
  const genreIds =
    'genres' in movie && movie.genres
      ? movie.genres.map((genre) => genre.id ?? 0)
      : 'genre_ids' in movie
        ? (movie.genre_ids ?? [])
        : []

  return {
    id: movie.id ?? 0,
    title: movie.title ?? '',
    overview: movie.overview ?? '',
    posterPath: movie.poster_path ?? null,
    backdropPath: movie.backdrop_path ?? null,
    releaseDate: movie.release_date ?? '',
    voteAverage: movie.vote_average ?? 0,
    voteCount: movie.vote_count ?? 0,
    genreIds,
  }
}
