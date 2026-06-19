import { mapTmdbMovie } from '#/utils/tmdb-images'
import type { MovieListResponse } from '#/types/movie'
import type { TmdbMovieDetail, TmdbPagedResponse, TmdbMovieResult } from '#/types/tmdb'
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
    const data = await tmdbFetch<TmdbPagedResponse<TmdbMovieResult>>(c.env.TMDB_API_KEY, '/movie/popular', {
      page,
    })

    const payload: MovieListResponse = {
      page: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results,
      results: data.results.map(mapTmdbMovie),
    }

    return c.json(payload)
  })
  .get('/movies/trending', async (c) => {
    const page = c.req.query('page') ?? '1'
    const data = await tmdbFetch<TmdbPagedResponse<TmdbMovieResult>>(
      c.env.TMDB_API_KEY,
      '/trending/movie/day',
      { page },
    )

    const payload: MovieListResponse = {
      page: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results,
      results: data.results.map(mapTmdbMovie),
    }

    return c.json(payload)
  })
  .get('/movies/search', async (c) => {
    const query = c.req.query('query')
    const page = c.req.query('page') ?? '1'

    if (!query?.trim()) {
      return c.json({ message: 'query is required' }, 400)
    }

    const data = await tmdbFetch<TmdbPagedResponse<TmdbMovieResult>>(c.env.TMDB_API_KEY, '/search/movie', {
      query: query.trim(),
      page,
      include_adult: 'false',
    })

    const payload: MovieListResponse = {
      page: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results,
      results: data.results.map(mapTmdbMovie),
    }

    return c.json(payload)
  })
  .get('/movies/:movieId', async (c) => {
    const movieId = c.req.param('movieId')
    const data = await tmdbFetch<TmdbMovieDetail>(c.env.TMDB_API_KEY, `/movie/${movieId}`)
    return c.json(mapTmdbMovie(data))
  })
