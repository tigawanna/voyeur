import { movieBasicCollection } from '#/data-access-layer/tmdb/query-collection'
import type { MovieDetailsQueryResponse } from '#/data-access-layer/tmdb/generated/models/MovieDetails'
import { withViewTransition } from '#/utils/viewTransition'
import { useNavigate } from '@tanstack/react-router'
import { useCallback, useRef } from 'react'

export function useMovieDetailIntent(
  movieId: number,
  toBasicRecord: () => MovieDetailsQueryResponse,
) {
  const navigate = useNavigate()
  const seededRef = useRef(false)

  const seedOnIntent = useCallback(() => {
    if (seededRef.current) return
    seededRef.current = true
    const record = toBasicRecord()
    console.log('[movie-detail] seed writeUpsert', {
      movieId,
      recordId: record.id,
      title: record.title,
      poster_path: record.poster_path,
    })
    movieBasicCollection.utils.writeUpsert(record)
  }, [movieId, toBasicRecord])

  const goToDetail = useCallback(() => {
    seedOnIntent()
    withViewTransition(() => {
      void navigate({
        to: '/movies/movie/$movieId',
        params: { movieId: String(movieId) },
      })
    })
  }, [movieId, navigate, seedOnIntent])

  return { seedOnIntent, goToDetail }
}
