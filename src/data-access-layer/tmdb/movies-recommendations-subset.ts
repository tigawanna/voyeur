import { parseLoadSubsetOptions } from "@tanstack/db";

export function parseRecommendationSourceId(
  loadSubsetOptions: Parameters<typeof parseLoadSubsetOptions>[0],
): number | undefined {
  const { filters } = parseLoadSubsetOptions(loadSubsetOptions);

  for (const filter of filters) {
    if (filter.operator !== "eq" || filter.value === undefined) continue;

    const segments = filter.field.map(String);
    const field = segments[segments.length - 1];
    if (field !== "sourceMovieId") continue;

    const id = Number(filter.value);
    if (Number.isFinite(id)) return id;
  }

  return undefined;
}

export function stampMovieRecommendationContext<T extends object>(item: T, sourceMovieId: number) {
  return {
    ...item,
    sourceMovieId,
  };
}
