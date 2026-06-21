import type { ComponentProps, ReactNode } from 'react'
import type { Movie } from '#/types/movie'
import { movieHeroImageUrl, posterUrl } from '#/utils/tmdb-images'
import { movieViewTransitionName } from '#/utils/movie-view-transition'
import { cn } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'

interface MovieDetailsProps {
  movie: Movie
  className?: string
  backAction: ReactNode
  libraryActions?: ReactNode
}

export function MovieDetails({ movie, className, backAction, libraryActions }: MovieDetailsProps) {
  const poster = posterUrl(movie.posterPath, 'w500')
  const heroImage = movieHeroImageUrl(movie)
  const year = movie.releaseDate ? movie.releaseDate.slice(0, 4) : 'TBA'

  return (
    <article className={cn('relative isolate', className)}>
      {heroImage ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[min(52vh,28rem)] overflow-hidden"
        >
          <img
            src={heroImage}
            alt=""
            className="h-full w-full scale-110 object-cover opacity-50 blur-xl"
          />
          <div className="absolute inset-0 bg-linear-to-b from-background/10 via-background/55 to-background" />
        </div>
      ) : null}

      <div className="relative">
        <div className="mb-6">{backAction}</div>

        <div className="grid gap-8 md:grid-cols-[minmax(220px,20rem)_minmax(0,1fr)] md:items-start">
          <div className="mx-auto w-full max-w-xs md:mx-0 md:max-w-none">
            <div className="island-shell overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
              {poster ? (
                <img
                  src={poster}
                  alt={movie.title}
                  className="aspect-2/3 w-full object-cover"
                  style={{ viewTransitionName: movieViewTransitionName(movie.id) }}
                />
              ) : (
                <div
                  className="flex aspect-2/3 items-center justify-center bg-muted px-6 text-center text-sm text-muted-foreground"
                  style={{ viewTransitionName: movieViewTransitionName(movie.id) }}
                >
                  No poster
                </div>
              )}
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-4 pt-2">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {movie.title}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {year} · ★ {movie.voteAverage.toFixed(1)}
              </p>
            </div>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
              {movie.overview || 'No overview available.'}
            </p>
            {libraryActions ? <div>{libraryActions}</div> : null}
          </div>
        </div>
      </div>
    </article>
  )
}

export function MovieDetailsBackButton({
  children,
  className,
  ...props
}: ComponentProps<'button'>) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-sm transition hover:bg-muted',
        className,
      )}
      {...props}
    >
      <ArrowLeft className="size-4" />
      {children}
    </button>
  )
}
