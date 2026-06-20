export interface MovieSortOption {
  value: string
  label: string
}

export const MOVIE_SORT_OPTIONS: MovieSortOption[] = [
  { value: 'original_title.asc', label: 'Title (A-Z)' },
  { value: 'original_title.desc', label: 'Title (Z-A)' },
  { value: 'popularity.asc', label: 'Popularity (Low-High)' },
  { value: 'popularity.desc', label: 'Popularity (High-Low)' },
  { value: 'primary_release_date.asc', label: 'Release Date (Old-New)' },
  { value: 'primary_release_date.desc', label: 'Release Date (New-Old)' },
  { value: 'vote_average.asc', label: 'Rating (Low-High)' },
  { value: 'vote_average.desc', label: 'Rating (High-Low)' },
  { value: 'vote_count.asc', label: 'Votes (Low-High)' },
  { value: 'vote_count.desc', label: 'Votes (High-Low)' },
]

export const MOVIE_SORT_BY_VALUES = MOVIE_SORT_OPTIONS.map((option) => option.value) as [
  string,
  ...string[],
]

export const defaultMovieSortBy = 'popularity.desc'

export function getMovieSortOrder(sortBy: string): 'asc' | 'desc' {
  return sortBy.endsWith('.asc') ? 'asc' : 'desc'
}

export function flipMovieSortBy(sortBy: string): string {
  const order = getMovieSortOrder(sortBy)
  const field = sortBy.replace(/\.(asc|desc)$/, '')
  return `${field}.${order === 'asc' ? 'desc' : 'asc'}`
}

export function getMovieSortLabel(sortBy: string) {
  return MOVIE_SORT_OPTIONS.find((option) => option.value === sortBy)?.label ?? 'Popularity'
}
