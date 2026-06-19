import { eq, useLiveQuery } from '@tanstack/react-db'
import { appendPopularMoviesPage } from '#/lib/collections/movies-collection'
import { favoritesCollection, watchlistCollection } from '#/lib/collections/local-collections'
import { usePopularMoviesCollection } from '#/lib/collections/movies-collection-context'
import type { TimelineMovie } from '#/types/movie'
import { useCallback, useEffect, useState } from 'react'

async function fetchPopularMeta() {
  const response = await fetch('/api/tmdb/movies/popular?page=1')
  if (!response.ok) return null
  return (await response.json()) as { totalPages: number }
}

export function useMovieTimeline() {
  const moviesCollection = usePopularMoviesCollection()
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(500)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    void fetchPopularMeta().then((meta) => {
      if (meta) setTotalPages(meta.totalPages)
    })
  }, [])

  const { data, isLoading, isError } = useLiveQuery((query) =>
    query
      .from({ movie: moviesCollection })
      .leftJoin({ favorite: favoritesCollection }, ({ movie, favorite }) =>
        eq(movie.id, favorite.movieId),
      )
      .leftJoin({ watchlist: watchlistCollection }, ({ movie, watchlist }) =>
        eq(movie.id, watchlist.movieId),
      )
      .select(({ movie, favorite, watchlist }) => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        posterPath: movie.posterPath,
        backdropPath: movie.backdropPath,
        releaseDate: movie.releaseDate,
        voteAverage: movie.voteAverage,
        voteCount: movie.voteCount,
        genreIds: movie.genreIds,
        isFavorite: favorite !== undefined,
        isWatchlisted: watchlist !== undefined,
      })),
  )

  const loadMore = useCallback(async () => {
    if (loadingMore || page >= totalPages) return

    setLoadingMore(true)
    try {
      const nextPage = page + 1
      const response = await appendPopularMoviesPage(moviesCollection, nextPage)
      setPage(nextPage)
      setTotalPages(response.totalPages)
    } finally {
      setLoadingMore(false)
    }
  }, [loadingMore, moviesCollection, page, totalPages])

  return {
    movies: (data ?? []) as TimelineMovie[],
    isLoading,
    isError,
    loadMore,
    loadingMore,
    hasMore: page < totalPages,
  }
}
