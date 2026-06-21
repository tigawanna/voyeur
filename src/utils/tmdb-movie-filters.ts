const INDIAN_ORIGINAL_LANGUAGES = new Set([
  "hi",
  "ta",
  "te",
  "ml",
  "kn",
  "bn",
  "mr",
  "gu",
  "pa",
  "or",
  "as",
  "ur",
  "ks",
  "sd",
  "kok",
  "mai",
  "ne",
  "sa",
  "bho",
]);

type TmdbMovieListItem = {
  original_language?: string;
};

type TmdbMovieListResponse = {
  results?: TmdbMovieListItem[];
};

export function isIndianOriginalLanguage(language: string | undefined) {
  if (!language) return false;
  return INDIAN_ORIGINAL_LANGUAGES.has(language.toLowerCase());
}

export function excludeIndianMovies<T extends TmdbMovieListResponse>(response: T): T {
  if (!response.results?.length) return response;

  return {
    ...response,
    results: response.results.filter((movie) => !isIndianOriginalLanguage(movie.original_language)),
  };
}
