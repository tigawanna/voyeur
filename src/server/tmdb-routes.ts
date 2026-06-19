import type { MovieDetails200 } from '#/data-access-layer/tmdb/generated/models/MovieDetails'
import type { MoviePopularListQueryResponse } from '#/data-access-layer/tmdb/generated/models/MoviePopularList'
import { Hono } from 'hono'
import { tmdbFetch } from './tmdb-client'

type TmdbBindings = { Bindings: CloudflareBindings }

export const tmdbRoutes = new Hono<TmdbBindings>()
  .get('/health', (c) =>
    c.json({
      ok: true,
      service: 'reelroom',
      tmdbConfigured: Boolean(c.env.TMDB_API_KEY),
    }),
  )
  .get('/movies/popular', async (c) => {
    const page = c.req.query('page') ?? '1'
    const data = await tmdbFetch<MoviePopularListQueryResponse>(c.env.TMDB_API_KEY, '/movie/popular', {
      page,
    })

    return c.json(data)
  })
  .get('/movies/trending', async (c) => {
    const page = c.req.query('page') ?? '1'
    const data = await tmdbFetch<MoviePopularListQueryResponse>(
      c.env.TMDB_API_KEY,
      '/trending/movie/day',
      { page },
    )

    return c.json(data)
  })
  .get('/movies/search', async (c) => {
    const query = c.req.query('query')
    const page = c.req.query('page') ?? '1'

    if (!query?.trim()) {
      return c.json({ message: 'query is required' }, 400)
    }

    const data = await tmdbFetch<MoviePopularListQueryResponse>(c.env.TMDB_API_KEY, '/search/movie', {
      query: query.trim(),
      page,
      include_adult: 'false',
    })

    return c.json(data)
  })
  .get('/movies/:movieId', async (c) => {
    const movieId = c.req.param('movieId')
    const data = await tmdbFetch<MovieDetails200>(c.env.TMDB_API_KEY, `/movie/${movieId}`)
    return c.json(data)
  })
