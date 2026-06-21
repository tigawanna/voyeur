import { parseLoadSubsetOptions } from '@tanstack/db'

// Reads movie id from TanStack DB loadSubsetOptions (where eq(movie.id, id) on detail live queries).
export function parseMovieDetailId(
  loadSubsetOptions: Parameters<typeof parseLoadSubsetOptions>[0],
): number | undefined {
  const { filters } = parseLoadSubsetOptions(loadSubsetOptions)

  for (const filter of filters) {
    if (filter.operator !== 'eq' || filter.value === undefined) continue

    const segments = filter.field.map(String)
    const field = segments[segments.length - 1]
    if (field !== 'id') continue

    const id = Number(filter.value)
    if (Number.isFinite(id)) return id
  }

  return undefined
}
