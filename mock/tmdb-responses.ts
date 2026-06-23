import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), "fixtures");

function loadFixture<T>(filename: string): T {
  return JSON.parse(readFileSync(join(fixturesDir, filename), "utf8")) as T;
}

type MovieFixture = Record<string, unknown>;

const popularPage1 = loadFixture("popular-page-1.json");
const movie646097 = loadFixture<MovieFixture>("movie-646097.json");
const movie11028 = loadFixture<MovieFixture>("movie-11028.json");
const recommendations646097 = loadFixture("recommendations-646097.json");
const recommendations11028 = loadFixture("recommendations-11028.json");

const movieDetailsById: Record<number, unknown> = {
  646097: movie646097,
  11028: movie11028,
  1306368: {
    ...movie646097,
    id: 1306368,
    title: "Grid Extra",
    original_title: "Grid Extra",
    overview: "Another browse title to keep the grid populated.",
  },
  1419406: {
    ...movie646097,
    id: 1419406,
    title: "Browse Third",
    original_title: "Browse Third",
    overview: "Third browse fixture for pagination coverage.",
  },
};

const recommendationsByMovieId: Record<number, unknown> = {
  646097: recommendations646097,
  11028: recommendations11028,
};

function matchMovieId(pathname: string) {
  const match = pathname.match(/\/api\/tmdb\/movies\/(\d+)(?:\/recommendations)?$/);
  return match ? Number(match[1]) : null;
}

export function resolveTmdbMockResponse(url: string, method: string) {
  if (method !== "GET") {
    return { status: 405, body: null };
  }

  const { pathname } = new URL(url);

  if (
    pathname.endsWith("/api/tmdb/movies/popular") ||
    pathname.endsWith("/api/tmdb/movies/trending") ||
    pathname.endsWith("/api/tmdb/movies/now-playing") ||
    pathname.endsWith("/api/tmdb/movies/search")
  ) {
    return { status: 200, body: popularPage1 };
  }

  if (pathname.includes("/recommendations")) {
    const movieId = matchMovieId(pathname);
    return {
      status: 200,
      body:
        movieId != null && recommendationsByMovieId[movieId] != null
          ? recommendationsByMovieId[movieId]
          : { page: 1, total_pages: 0, total_results: 0, results: [] },
    };
  }

  const movieId = matchMovieId(pathname);
  if (movieId != null && movieDetailsById[movieId] != null) {
    return { status: 200, body: movieDetailsById[movieId] };
  }

  if (pathname.startsWith("/api/tmdb/movies/")) {
    return { status: 404, body: null };
  }

  return null;
}
