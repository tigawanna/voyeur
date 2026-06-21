const TMDB_BASE = "https://api.themoviedb.org/3";

export class TmdbError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "TmdbError";
  }
}

export async function tmdbFetch<T>(
  apiKey: string,
  path: string,
  searchParams?: Record<string, string>,
) {
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set("api_key", apiKey);

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      url.searchParams.set(key, value);
    }
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new TmdbError(`TMDB request failed: ${response.statusText}`, response.status);
  }

  return (await response.json()) as T;
}
