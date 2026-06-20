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
