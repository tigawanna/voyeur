import type { MovieDetails200 } from '#/data-access-layer/tmdb/generated/models/MovieDetails'
import type { MovieNowPlayingListQueryResponse } from '#/data-access-layer/tmdb/generated/models/MovieNowPlayingList'
import type { MoviePopularListQueryResponse } from '#/data-access-layer/tmdb/generated/models/MoviePopularList'
import type { SearchMovieQueryResponse } from '#/data-access-layer/tmdb/generated/models/SearchMovie'
import { Hono } from 'hono'
import { tmdbFetch } from './tmdb-client'

type TmdbBindings = { Bindings: CloudflareBindings }

function listParams(c: { req: { query: (key: string) => string | undefined } }): Record<string, string> {
  const params: Record<string, string> = { page: c.req.query('page') ?? '1' }

  const region = c.req.query('region')?.trim()
  if (region && region !== 'global') {
    params.region = region.toUpperCase()
  }

  const language = c.req.query('language')?.trim()
  if (language) {
    params.language = language
  }

  const sortBy = c.req.query('sort_by')?.trim()
  if (sortBy) {
    params.sort_by = sortBy
  }

  return params
}

export const tmdbRoutes = new Hono<TmdbBindings>()
  .get('/health', (c) =>
    c.json({
      ok: true,
      service: 'voyeur',
      tmdbConfigured: Boolean(c.env.TMDB_API_KEY),
    }),
  )
  .get('/movies/popular', async (c) => {
    const data = await tmdbFetch<MoviePopularListQueryResponse>(
      c.env.TMDB_API_KEY,
      '/discover/movie',
      {
        ...listParams(c),
        sort_by: c.req.query('sort_by')?.trim() ?? 'popularity.desc',
        include_adult: 'false',
        include_video: 'false',
      },
    )

    return c.json(data)
  })
  .get('/movies/trending', async (c) => {
    const data = await tmdbFetch<MoviePopularListQueryResponse>(
      c.env.TMDB_API_KEY,
      '/trending/movie/day',
      listParams(c),
    )

    return c.json(data)
  })
  .get('/movies/now-playing', async (c) => {
    const data = await tmdbFetch<MovieNowPlayingListQueryResponse>(
      c.env.TMDB_API_KEY,
      '/movie/now_playing',
      listParams(c),
    )

    return c.json(data)
  })
  .get('/movies/search', async (c) => {
    const query = c.req.query('query')

    if (!query?.trim()) {
      return c.json({ message: 'query is required' }, 400)
    }

    const data = await tmdbFetch<SearchMovieQueryResponse>(c.env.TMDB_API_KEY, '/search/movie', {
      query: query.trim(),
      include_adult: 'false',
      ...listParams(c),
    })

    return c.json(data)
  })
  .get('/movies/:movieId', async (c) => {
    const movieId = c.req.param('movieId')
    const language = c.req.query('language')?.trim()
    const data = await tmdbFetch<MovieDetails200>(
      c.env.TMDB_API_KEY,
      `/movie/${movieId}`,
      language ? { language } : undefined,
    )
    return c.json(data)
  })
