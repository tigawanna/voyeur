# TanStack DB collections — movie data

This file explains how movie-related collections fit together, how `useLiveQuery` uses them, and how detail-page loading works. Start here if the detail page or browse sync feels confusing.

## Collections overview

All collections are created in `query-collection.ts`.

| Collection                       | Backed by                   | Fetches from API?                                 | Persisted?                   |
| -------------------------------- | --------------------------- | ------------------------------------------------- | ---------------------------- |
| `moviesCollection`               | TanStack Query + TMDB proxy | Yes — browse pages (popular, trending, search, …) | No (in-memory / query cache) |
| `movieBasicCollection`           | TanStack Query              | **No** — `queryFn` returns `[]`                   | No                           |
| `movieDetailCollection`          | TanStack Query + TMDB proxy | Yes — `GET /api/tmdb/movies/:id`                  | No                           |
| `movieRecommendationsCollection` | TanStack Query + TMDB proxy | Yes — `GET /api/tmdb/movies/:id/recommendations`  | No                           |
| `favoritesCollection`            | Browser SQLite (OPFS)       | No                                                | Yes                          |
| `watchlistCollection`            | Browser SQLite (OPFS)       | No                                                | Yes                          |

### `moviesCollection` (browse)

- **Purpose:** Grid / list of movies for the current browse filters (page, view, region, language, sort, search query).
- **Sync mode:** `on-demand` — TanStack DB pushes the live query’s `where` / `orderBy` / `limit` into `queryFn` as `loadSubsetOptions`.
- **Parsing:** `parseMoviesBrowseSubset()` in `movies-browse-subset.ts` turns those options into TMDB fetch params.
- **Stamping:** Each row is stamped with browse context (`page`, `view`, `q`, …) so multiple browse pages can coexist in one collection without overwriting each other.
- **Indexes:** `popularity`, `id`.

### `movieBasicCollection` (detail hero cache)

- **Purpose:** Holds a **small summary** of one movie (poster, title, overview, rating) for fast detail-page hero rendering on return visits.
- **Does not call the API.** `queryFn` always returns `[]`.
- **Population:** Only via `writeUpsert` inside `movieDetailCollection`’s `queryFn` after a successful detail fetch (`toBasicMovieRecord()` in `movie-basic-record.ts`).
- **Query key:** Per movie id — `['movie', 'basic', id]`.

There is **no manual seeding** on navigation (no `onClick` writes). The collection is filled automatically when the detail API responds.

### `movieDetailCollection` (full detail)

- **Purpose:** Full TMDB movie payload (runtime, budget, genres, production companies, …).
- **Sync mode:** `on-demand` — live query `where eq(movie.id, id)` drives the fetch.
- **Parsing:** `parseMovieDetailId()` in `movie-detail-subset.ts` reads the movie id from `loadSubsetOptions`.
- **Side effect:** On success, writes a trimmed record into `movieBasicCollection` (see above).
- **Query key:** Per movie id — `['movie', 'detail', id]`.

### `movieRecommendationsCollection` (related movies)

- **Purpose:** TMDB recommendations for a **source** movie (the detail page you are viewing).
- **Sync mode:** `on-demand` — live query `where eq(movie.sourceMovieId, sourceId)` drives the fetch.
- **Parsing:** `parseRecommendationSourceId()` in `movies-recommendations-subset.ts`.
- **Stamping:** Each row includes `sourceMovieId` so multiple recommendation lists can coexist.
- **Indexes:** `sourceMovieId`, `id`.
- **Detail fallback:** If you open a recommended movie, `recommendationRows` on the detail page can supply instant hero data (same pattern as browse).

### `favoritesCollection` / `watchlistCollection` (local library)

- **Purpose:** Per-device saved movies (`SavedMovieRef`: `movieId`, `title`, `posterPath`, `addedAt`).
- **Persistence:** Browser SQLite via OPFS — survives refresh.
- **Mutations:** `insert` / `delete` from `MovieLibraryActions` — no TMDB round-trip.

---

## Detail page data flow

File: `src/routes/_app/movies/movie/$movieId.tsx`

The hero (poster, title, overview) and the metadata block (runtime, budget, …) load on **different timelines**.

```
summaryRow = basicRows ?? browseRows ?? recommendationRows ?? detailRows
```

| Source                           | When it has data                                                                               |
| -------------------------------- | ---------------------------------------------------------------------------------------------- |
| `movieBasicCollection`           | After a **previous** detail fetch wrote the summary                                            |
| `moviesCollection`               | User **came from the browse grid** and that movie is still in the browse cache                 |
| `movieRecommendationsCollection` | User **came from a recommendations grid** and that movie is still in the recommendations cache |
| `movieDetailCollection`          | After the **current** detail API fetch completes                                               |

**Full-page spinner:** Shown only when `summaryRow` is missing **and** the detail fetch is still loading.

**From browse:** `browseRows` is set immediately → hero renders with no wait.

**Hard refresh / direct URL:** `browseRows` and `basicRows` are usually empty → spinner until `detailRows` arrives → detail fetch also seeds `movieBasicCollection` for next time.

**Extra metadata** (genres, budget, IMDb, …) lives in `MovieDetailMetadata`, which runs its **own** `useLiveQuery` on `movieDetailCollection` and shows a section-level spinner until that data is ready. The hero does not wait for this block.

---

## Live queries by screen

### Browse — `MoviesList.tsx`

One query joins three collections:

1. `moviesCollection` — rows matching current URL search params (`page`, `view`, `region`, `language`, `sortBy`, `q`).
2. `favoritesCollection` — left join for `isFavorite`.
3. `watchlistCollection` — left join for `isWatchlisted`.

The `where` clause on stamped browse fields is what triggers the correct TMDB page fetch via query-driven sync.

### Detail — `$movieId.tsx`

Five queries:

1. `movieBasicCollection` — cached summary (see above).
2. `moviesCollection` — browse fallback for instant hero.
3. `movieDetailCollection` — triggers API fetch; provides `isDetailLoading` / `isDetailError` for page-level states.
4. `favoritesCollection` — favorite toggle for this `movieId`.
5. `watchlistCollection` — watchlist toggle for this `movieId`.

### Detail metadata — `MovieDetailMetadata.tsx`

One query on `movieDetailCollection` by `movieId`. Duplicates the detail fetch at the TanStack Query layer (same cache key) — safe to have two subscribers.

### Recommendations — `MovieRecommendations.tsx`

One query joins `movieRecommendationsCollection` with favorites and watchlist, filtered by `sourceMovieId`. Renders `MovieCard` in the same grid as browse (`grid-cols-2 … 2xl:grid-cols-5`). Rows stay in the collection for instant hero fallback on the detail page when navigating between recommendations.

### Favorites — `favorites/index.tsx`

Reads all rows from `favoritesCollection` — local only, no TMDB.

### Watchlist — `watchlist/index.tsx`

Reads all rows from `watchlistCollection` — local only, no TMDB.

---

## Basic record seeding (not navigation seeding)

We previously experimented with `writeUpsert` on link click; that was removed.

The only automatic “seed” today:

```ts
// movieDetailCollection queryFn (query-collection.ts)
const details = await fetchMovieDetails(movieId);
movieBasicCollection.utils.writeUpsert(toBasicMovieRecord(details));
return [details];
```

`writeUpsert` bypasses optimistic mutations and does **not** trigger a refetch. It updates the basic collection’s TanStack Query cache so the next `useLiveQuery` on `movieBasicCollection` can read the summary immediately.

---

## Related files

| File                      | Role                                              |
| ------------------------- | ------------------------------------------------- |
| `query-collection.ts`     | Collection definitions                            |
| `movies-browse-subset.ts` | Parse browse `loadSubsetOptions`                  |
| `movie-detail-subset.ts`  | Parse movie id from detail `loadSubsetOptions`    |
| `movie-basic-record.ts`   | Map full detail → basic summary for `writeUpsert` |
| `query-options.ts`        | Query keys and plain `fetch*` helpers             |
