import type { MoviePopularList200 } from '#/data-access-layer/tmdb/generated/models/MoviePopularList'
import type { BrowseLanguageCode, BrowseRegionCode, BrowseView } from '#/types/browse'

type PopularMovieResult = NonNullable<MoviePopularList200['results']>[number]

export interface Movie {
  id: number
  title: string
  overview: string
  posterPath: string | null
  backdropPath: string | null
  releaseDate: string
  voteAverage: number
  voteCount: number
  genreIds: number[]
}

export interface MovieListResponse {
  page: number
  totalPages: number
  totalResults: number
  results: Movie[]
}

export interface SavedMovieRef {
  movieId: number
  title: string
  posterPath: string | null
  addedAt: string
}

export interface TimelineMovie extends Movie {}

export type BrowseMovieWithLibrary = PopularMovieResult & {
  page: number
  view: BrowseView
  q: string
  region: BrowseRegionCode
  language: BrowseLanguageCode
  sortBy: string
  totalResults: number
  totalPages: number
  isFavorite: boolean
  isWatchlisted: boolean
}
