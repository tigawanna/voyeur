import type { ReactNode } from 'react'
import type { MovieDetail } from '#/types/movie'
import {
  formatMovieCurrency,
  formatMovieLanguageCode,
  formatMovieRuntime,
} from '#/utils/format-movie-detail'

interface MovieDetailMetadataProps {
  movie: MovieDetail
}

function MetadataItem({ label, children }: { label: string; children: ReactNode }) {
  if (!children) return null

  return (
    <div>
      <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-foreground">{children}</dd>
    </div>
  )
}

export function MovieDetailMetadata({ movie }: MovieDetailMetadataProps) {
  const runtime = formatMovieRuntime(movie.runtime)
  const budget = formatMovieCurrency(movie.budget)
  const revenue = formatMovieCurrency(movie.revenue)
  const originalLanguage = formatMovieLanguageCode(movie.originalLanguage)
  const hasNamedGenres = movie.genres.some((genre) => genre.name)
  const showOriginalTitle =
    movie.originalTitle && movie.originalTitle !== movie.title ? movie.originalTitle : null

  const hasDetails =
    movie.tagline ||
    hasNamedGenres ||
    runtime ||
    movie.status ||
    budget ||
    revenue ||
    movie.collection ||
    movie.productionCompanies.length > 0 ||
    movie.productionCountries.length > 0 ||
    movie.spokenLanguages.length > 0 ||
    movie.originCountries.length > 0 ||
    movie.homepage ||
    movie.imdbId ||
    showOriginalTitle ||
    originalLanguage

  if (!hasDetails) return null

  return (
    <section className="island-shell rounded-2xl border border-border bg-card/60 p-6">
      <h2 className="island-kicker mb-4">Details</h2>

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
          {movie.originCountries.length > 0 ? movie.originCountries.join(', ') : null}
        </MetadataItem>
        <MetadataItem label="Production">
          {movie.productionCompanies.length > 0
            ? movie.productionCompanies.join(', ')
            : null}
        </MetadataItem>
        <MetadataItem label="Countries">
          {movie.productionCountries.length > 0
            ? movie.productionCountries.join(', ')
            : null}
        </MetadataItem>
        <MetadataItem label="Languages">
          {movie.spokenLanguages.length > 0 ? movie.spokenLanguages.join(', ') : null}
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
    </section>
  )
}
