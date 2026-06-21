import { movieDetailCollection } from "#/data-access-layer/tmdb/query-collection";
import {
  formatMovieCurrency,
  formatMovieLanguageCode,
  formatMovieRuntime,
} from "#/utils/format-movie-detail";
import { mapTmdbMovieDetail } from "#/utils/tmdb-images";
import { eq, useLiveQuery } from "@tanstack/react-db";
import { Loader } from "lucide-react";
import type { ReactNode } from "react";
import type { MovieDetail } from "#/types/movie";

interface MovieDetailMetadataProps {
  movieId: number;
}

function MetadataItem({ label, children }: { label: string; children: ReactNode }) {
  if (!children) return null;

  return (
    <div>
      <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-foreground">{children}</dd>
    </div>
  );
}

function MovieDetailMetadataContent({ movie }: { movie: MovieDetail }) {
  const runtime = formatMovieRuntime(movie.runtime);
  const budget = formatMovieCurrency(movie.budget);
  const revenue = formatMovieCurrency(movie.revenue);
  const originalLanguage = formatMovieLanguageCode(movie.originalLanguage);
  const hasNamedGenres = movie.genres.some((genre) => genre.name);
  const showOriginalTitle =
    movie.originalTitle && movie.originalTitle !== movie.title ? movie.originalTitle : null;

  return (
    <>
      {movie.tagline ? (
        <p className="mb-5 text-lg text-muted-foreground italic">{movie.tagline}</p>
      ) : null}

      {hasNamedGenres ? (
        <div className="mb-5 flex flex-wrap gap-2">
          {movie.genres.map((genre) => (
            <span
              key={genre.id}
              className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-foreground"
            >
              {genre.name}
            </span>
          ))}
        </div>
      ) : null}

      <dl className="grid gap-4 sm:grid-cols-2">
        <MetadataItem label="Runtime">{runtime}</MetadataItem>
        <MetadataItem label="Status">{movie.status}</MetadataItem>
        <MetadataItem label="Budget">{budget}</MetadataItem>
        <MetadataItem label="Box office">{revenue}</MetadataItem>
        <MetadataItem label="Collection">{movie.collection?.name}</MetadataItem>
        <MetadataItem label="Original title">{showOriginalTitle}</MetadataItem>
        <MetadataItem label="Original language">{originalLanguage}</MetadataItem>
        <MetadataItem label="Origin">
          {movie.originCountries.length > 0 ? movie.originCountries.join(", ") : null}
        </MetadataItem>
        <MetadataItem label="Production">
          {movie.productionCompanies.length > 0 ? movie.productionCompanies.join(", ") : null}
        </MetadataItem>
        <MetadataItem label="Countries">
          {movie.productionCountries.length > 0 ? movie.productionCountries.join(", ") : null}
        </MetadataItem>
        <MetadataItem label="Languages">
          {movie.spokenLanguages.length > 0 ? movie.spokenLanguages.join(", ") : null}
        </MetadataItem>
        <MetadataItem label="Website">
          {movie.homepage ? (
            <a
              href={movie.homepage}
              target="_blank"
              rel="noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              Official site
            </a>
          ) : null}
        </MetadataItem>
        <MetadataItem label="IMDb">
          {movie.imdbId ? (
            <a
              href={`https://www.imdb.com/title/${movie.imdbId}`}
              target="_blank"
              rel="noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              {movie.imdbId}
            </a>
          ) : null}
        </MetadataItem>
      </dl>
    </>
  );
}

export function MovieDetailMetadata({ movieId }: MovieDetailMetadataProps) {
  // Full TMDB detail for the metadata block (runtime, budget, genres, …).
  // Shares the same query cache as the detail page’s movieDetailCollection live query.
  const {
    data: detailRows,
    isLoading,
    isError,
  } = useLiveQuery(
    (q) => q.from({ movie: movieDetailCollection }).where(({ movie }) => eq(movie.id, movieId)),
    [movieId],
  );

  if (isLoading) {
    return (
      <section
        className="island-shell rounded-2xl border border-border bg-card/60 p-6"
        data-testid="movie-detail-metadata-loading"
      >
        <h2 className="island-kicker mb-4">Details</h2>
        <div className="flex items-center justify-center py-10">
          <Loader className="size-5 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (isError || detailRows.length === 0) {
    return null;
  }

  const movie = mapTmdbMovieDetail(detailRows[0]);

  return (
    <section
      className="island-shell rounded-2xl border border-border bg-card/60 p-6"
      data-testid="movie-detail-metadata"
    >
      <h2 className="island-kicker mb-4">Details</h2>
      <MovieDetailMetadataContent movie={movie} />
    </section>
  );
}
