import { Link, Outlet, useRouter, useRouterState } from '@tanstack/react-router'
import { Bookmark, Film, Star } from 'lucide-react'
import { AppConfig } from '#/utils/system'
import { cn } from '#/utils/cn'
import { withViewTransition } from '#/utils/viewTransition'

const navItems = [
  { title: 'Browse', href: '/browse', icon: Film },
  { title: 'Favorites', href: '/favorites', icon: Star },
  { title: 'Watchlist', href: '/watchlist', icon: Bookmark },
] as const

export function AppShell() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const router = useRouter()
  const Icon = AppConfig.icon

  return (
    <div className="min-h-dvh bg-[var(--bg-base)]">
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--header-bg)] backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <Icon className="size-5 text-[var(--accent)]" />
            <span className="font-mono text-xs font-bold tracking-[0.24em] text-[var(--ink)] uppercase">
              {AppConfig.wordmark}
              <span className="text-[var(--accent)]">.</span>
            </span>
          </Link>
          <nav className="flex items-center gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href)
              const NavIcon = item.icon
              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => {
                    if (active) return
                    withViewTransition(() => {
                      void router.navigate({ to: item.href })
                    })
                  }}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs tracking-wide transition',
                    active
                      ? 'bg-[rgba(212,175,55,0.16)] text-[var(--ink)]'
                      : 'text-[var(--ink-soft)] hover:bg-[var(--surface)] hover:text-[var(--ink)]',
                  )}
                >
                  <NavIcon size={14} />
                  {item.title}
                </button>
              )
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
