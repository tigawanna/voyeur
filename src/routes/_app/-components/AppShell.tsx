import { Link, Outlet, useRouter, useRouterState } from '@tanstack/react-router'
import { Bookmark, Film, Star } from 'lucide-react'
import { AppActivityNprogress } from '@/components/navigation/nprogress/AppActivityNprogress'
import { AppConfig } from '#/utils/system'
import { browseSearchDefaults } from '#/types/browse'
import { cn } from '@/lib/utils'
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
    <div className="min-h-dvh bg-background">
      <AppActivityNprogress />
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <Icon className="size-5 text-primary" />
            <span className="font-mono text-xs font-bold tracking-[0.24em] text-foreground uppercase">
              {AppConfig.wordmark}
              <span className="text-primary">.</span>
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
                      void router.navigate(
                        item.href === '/browse'
                          ? { to: item.href, search: browseSearchDefaults }
                          : { to: item.href },
                      )
                    })
                  }}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs tracking-wide transition',
                    active
                      ? 'bg-primary/15 text-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
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
