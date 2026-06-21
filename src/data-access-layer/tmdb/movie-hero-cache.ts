import { movieBasicCollection } from "#/data-access-layer/tmdb/query-collection";
import type { MovieDetailsQueryResponse } from "#/data-access-layer/tmdb/generated/models/MovieDetails";

const heroSummaryByMovieId = new Map<number, MovieDetailsQueryResponse>();

export function cacheMovieHeroSummary(record: MovieDetailsQueryResponse) {
  const movieId = record.id;
  if (movieId == null || !Number.isFinite(movieId)) return;
  heroSummaryByMovieId.set(movieId, record);
}

export function getCachedMovieHeroSummary(movieId: number) {
  return heroSummaryByMovieId.get(movieId);
}

export function seedMovieBasicRecord(record: MovieDetailsQueryResponse) {
  cacheMovieHeroSummary(record);
  try {
    movieBasicCollection.utils.writeUpsert(record);
  } catch {
    // movieBasicCollection sync is not ready until a live query subscribes to it
  }
}
