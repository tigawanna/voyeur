// Maps TanStack DB loadSubsetOptions from MoviesList useLiveQuery into TMDB browse params.
// See COLLECTIONS.md for how query-driven sync connects live queries to moviesCollection.queryFn.
import type { BrowseLanguageCode, BrowseRegionCode, BrowseView } from "#/types/browse";
import { defaultMovieSortBy } from "#/types/movie-sort";
import type { FieldPath, SimpleComparison } from "@tanstack/db";
import { parseLoadSubsetOptions } from "@tanstack/db";

const BROWSE_FILTER_FIELDS = ["page", "view", "q", "region", "language", "sortBy"] as const;

type BrowseFilterField = (typeof BROWSE_FILTER_FIELDS)[number];

export type MoviesBrowseSubset = {
  view: BrowseView;
  q: string;
  region: BrowseRegionCode;
  language: BrowseLanguageCode;
  sortBy: string;
  page: number;
  limit?: number;
};

function toFieldSegments(fieldPath: FieldPath): string[] {
  return fieldPath.map(String);
}

function resolveBrowseFilterField(fieldPath: FieldPath): BrowseFilterField | null {
  const segments = toFieldSegments(fieldPath);
  const normalized = segments[0] === "movie" ? segments.slice(1) : segments;
  if (normalized.length !== 1) return null;

  const field = normalized[0];
  if (!field) return null;

  return BROWSE_FILTER_FIELDS.includes(field as BrowseFilterField)
    ? (field as BrowseFilterField)
    : null;
}

function applyBrowseFilter(subset: Partial<MoviesBrowseSubset>, filter: SimpleComparison) {
  if (filter.operator !== "eq" || filter.value === undefined) return;

  const field = resolveBrowseFilterField(filter.field);
  if (!field) return;

  switch (field) {
    case "page":
      subset.page = Number(filter.value);
      break;
    case "view":
      subset.view = filter.value as BrowseView;
      break;
    case "q":
      subset.q = String(filter.value);
      break;
    case "region":
      subset.region = filter.value as BrowseRegionCode;
      break;
    case "language":
      subset.language = filter.value as BrowseLanguageCode;
      break;
    case "sortBy":
      subset.sortBy = String(filter.value);
      break;
  }
}

function sortFieldPathToSortBy(fieldPath: FieldPath, direction: "asc" | "desc") {
  const segments = toFieldSegments(fieldPath);
  const normalized = segments[0] === "movie" ? segments.slice(1) : segments;
  return `${normalized.join(".")}.${direction}`;
}

export function parseMoviesBrowseSubset(
  loadSubsetOptions: Parameters<typeof parseLoadSubsetOptions>[0],
): MoviesBrowseSubset {
  const { filters, sorts, limit } = parseLoadSubsetOptions(loadSubsetOptions);
  const subset: Partial<MoviesBrowseSubset> = {};

  for (const filter of filters) {
    applyBrowseFilter(subset, filter);
  }

  if (!subset.sortBy && sorts.length > 0) {
    subset.sortBy = sortFieldPathToSortBy(sorts[0].field, sorts[0].direction);
  }

  return {
    view: subset.view ?? "popular",
    q: subset.q ?? "",
    region: subset.region ?? "global",
    language: subset.language ?? "en-US",
    sortBy: subset.sortBy ?? defaultMovieSortBy,
    page: subset.page ?? 1,
    limit,
  };
}

export function moviesBrowseSubsetToFetchParams(subset: MoviesBrowseSubset) {
  const query = subset.q.trim();

  return {
    view: subset.view,
    q: query || undefined,
    page: subset.page,
    region: subset.region === "global" ? "US" : subset.region,
    language: subset.language,
    sortBy: subset.sortBy,
  };
}

export function stampMovieBrowseContext<T extends object>(
  item: T,
  subset: MoviesBrowseSubset,
  page?: number,
  listMeta?: { total_results?: number; total_pages?: number },
) {
  return {
    ...item,
    page: page ?? subset.page,
    view: subset.view,
    q: subset.q,
    region: subset.region,
    language: subset.language,
    sortBy: subset.sortBy,
    totalResults: listMeta?.total_results ?? 0,
    totalPages: listMeta?.total_pages ?? 0,
  };
}
