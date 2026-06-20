import { z } from 'zod'

export const BROWSE_VIEWS = ['popular', 'trending', 'recent'] as const

export type BrowseView = (typeof BROWSE_VIEWS)[number]

export const browseSearchSchema = z.object({
  view: z.enum(BROWSE_VIEWS).catch('popular'),
  q: z.string().optional().catch(undefined),
})

export type BrowseSearch = z.infer<typeof browseSearchSchema>

export const browseSearchDefaults: BrowseSearch = {
  view: 'popular',
}

export const BROWSE_VIEW_LABELS: Record<BrowseView, string> = {
  popular: 'Popular',
  trending: 'Trending',
  recent: 'Now playing',
}

export function getBrowseHeading(view: BrowseView, q?: string) {
  const trimmed = q?.trim()
  if (trimmed) return `Results for "${trimmed}"`

  switch (view) {
    case 'trending':
      return 'Trending today'
    case 'recent':
      return 'Now in theaters'
    default:
      return 'Popular right now'
  }
}
