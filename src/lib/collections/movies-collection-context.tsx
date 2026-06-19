import { createContext, use, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createPopularMoviesCollection } from '#/lib/collections/movies-collection'
import type { Collection } from '@tanstack/db'
import type { Movie } from '#/types/movie'

type PopularMoviesCollection = ReturnType<typeof createPopularMoviesCollection>

const MoviesCollectionContext = createContext<PopularMoviesCollection | null>(null)

export function MoviesCollectionProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const collection = useMemo(() => createPopularMoviesCollection(queryClient), [queryClient])

  return (
    <MoviesCollectionContext value={collection}>{children}</MoviesCollectionContext>
  )
}

export function usePopularMoviesCollection() {
  const collection = use(MoviesCollectionContext)
  if (!collection) {
    throw new Error('usePopularMoviesCollection must be used within MoviesCollectionProvider')
  }
  return collection
}

export type { PopularMoviesCollection, Collection, Movie }
