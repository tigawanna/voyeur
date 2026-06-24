import type { MovieDetailsQueryResponse } from "#/data-access-layer/tmdb/generated/models/MovieDetails";
import type { TmdbPagedResponse, TmdbMovieResult } from "#/types/tmdb";
import type { MovieNowPlayingListQueryResponse } from "#/data-access-layer/tmdb/generated/models/MovieNowPlayingList";
import type { MoviePopularListQueryResponse } from "#/data-access-layer/tmdb/generated/models/MoviePopularList";
import type { SearchMovieQueryResponse } from "#/data-access-layer/tmdb/generated/models/SearchMovie";
import { excludeIndianMovies } from "#/utils/tmdb-movie-filters";

export type TmdbListParams = {
  page?: number;
  region?: string;
  language?: string;
  sortBy?: string;
};

function toListQueryParams({ page = 1, region, language, sortBy }: TmdbListParams = {}) {
  const params: Record<string, string | number> = { page };

  if (region && region !== "global") {
    params.region = region;
  }

  if (language) {
    params.language = language;
  }

  if (sortBy) {
    params.sort_by = sortBy;
  }

  return params;
}

async function tmdbProxyFetch<T>(
  path: string,
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  const searchParams = new URLSearchParams();

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        searchParams.set(key, String(value));
      }
    }
  }

  const query = searchParams.toString();
  const url = query ? `${path}?${query}` : path;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`TMDB proxy request failed: ${response.status}`);
  }

  return response.json() as T;
}

async function tmdbMovieListFetch<T extends MoviePopularListQueryResponse>(
  path: string,
  params?: Record<string, string | number | undefined>,
) {
  const data = await tmdbProxyFetch<T>(path, params);
  return excludeIndianMovies(data);
}

export function fetchPopularMoviesPage(params: TmdbListParams = {}) {
  return tmdbMovieListFetch<MoviePopularListQueryResponse>(
    "/api/tmdb/movies/popular",
    toListQueryParams(params),
  );
}

export function fetchTrendingMoviesPage(params: TmdbListParams = {}) {
  return tmdbMovieListFetch<MoviePopularListQueryResponse>(
    "/api/tmdb/movies/trending",
    toListQueryParams(params),
  );
}

export function fetchNowPlayingMoviesPage(params: TmdbListParams = {}) {
  return tmdbMovieListFetch<MovieNowPlayingListQueryResponse>(
    "/api/tmdb/movies/now-playing",
    toListQueryParams(params),
  );
}

export function fetchSearchMoviesPage(query: string, params: TmdbListParams = {}) {
  return tmdbMovieListFetch<SearchMovieQueryResponse>("/api/tmdb/movies/search", {
    query,
    ...toListQueryParams(params),
  });
}

export function fetchMovieById(movieId: number, language?: string) {
  return tmdbProxyFetch<MovieDetailsQueryResponse>(
    `/api/tmdb/movies/${movieId}`,
    language ? { language } : {},
  );
}

export function fetchMovieRecommendations(movieId: number, page = 1, language?: string) {
  return tmdbProxyFetch<TmdbPagedResponse<TmdbMovieResult>>(
    `/api/tmdb/movies/${movieId}/recommendations`,
    {
      page,
      ...(language ? { language } : {}),
    },
  );
}
