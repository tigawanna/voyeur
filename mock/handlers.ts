import { http, HttpResponse } from 'msw'
import { resolveTmdbMockResponse } from './tmdb-responses'

export const tmdbHandlers = [
  http.get('*/api/tmdb/*', ({ request }) => {
    const resolved = resolveTmdbMockResponse(request.url, request.method)
    if (resolved == null) {
      return HttpResponse.error()
    }
    if (resolved.body == null) {
      return new HttpResponse(null, { status: resolved.status })
    }
    return HttpResponse.json(resolved.body, { status: resolved.status })
  }),
]

export const mockHandlers = [...tmdbHandlers]
