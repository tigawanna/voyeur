import { createFileRoute } from '@tanstack/react-router'
import { AppConfig } from '#/utils/system'
import { withViewTransition } from '#/utils/viewTransition'

export const Route = createFileRoute('/')({ component: LandingPage })

function LandingPage() {
  const navigate = Route.useNavigate()
  const Icon = AppConfig.icon

  return (
    <div className="min-h-dvh bg-[var(--bg-base)]">
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Icon className="size-5 text-[var(--accent)]" />
            <span className="font-mono text-xs font-bold tracking-[0.24em] text-[var(--ink)] uppercase">
              {AppConfig.wordmark}
              <span className="text-[var(--accent)]">.</span>
            </span>
          </div>
        </div>
      </header>

      <main className="page-wrap px-4 pb-16 pt-14">
        <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-12 sm:px-10 sm:py-16">
          <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.28),transparent_66%)]" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(120,72,32,0.18),transparent_66%)]" />
          <p className="island-kicker mb-3">TMDB take-home, upgraded</p>
          <h1 className="display-title mb-5 max-w-4xl text-4xl leading-[1.02] font-bold tracking-tight text-[var(--ink)] sm:text-6xl">
            Browse films with a live TanStack DB timeline.
          </h1>
          <p className="mb-8 max-w-2xl text-base text-[var(--ink-soft)] sm:text-lg">
            Popular movies stream in through a Cloudflare Worker proxy, while favorites and watchlist
            stay in local TanStack DB collections joined live to every card.
          </p>
          <button
            type="button"
            onClick={() => {
              withViewTransition(() => {
                void navigate({ to: '/browse' })
              })
            }}
            className="rounded-full border border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.16)] px-5 py-2.5 text-sm font-semibold text-[var(--ink)] transition hover:-translate-y-0.5 hover:bg-[rgba(212,175,55,0.28)]"
          >
            Enter the room →
          </button>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            ['Worker-backed TMDB', 'API keys stay on the server, not in the bundle.'],
            ['TanStack DB joins', 'Timeline rows react instantly when you star or queue a film.'],
            ['Cloudflare ready', 'Wrangler, D1, and Drizzle wired for when you deploy.'],
          ].map(([title, desc], index) => (
            <article
              key={title}
              className="island-shell feature-card rise-in rounded-2xl p-5"
              style={{ animationDelay: `${index * 90 + 80}ms` }}
            >
              <h2 className="mb-2 text-base font-semibold text-[var(--ink)]">{title}</h2>
              <p className="m-0 text-sm text-[var(--ink-soft)]">{desc}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}
