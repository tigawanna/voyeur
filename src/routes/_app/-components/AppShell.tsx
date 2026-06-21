import { useViewer } from '#/data-access-layer/auth/viewer'
import { AppActivityNprogress } from '@/components/navigation/nprogress/AppActivityNprogress'
import { AppConfig } from '#/utils/system'
import { browseSearchDefaults } from '#/types/browse'
import { cn } from '@/lib/utils'
import { withViewTransition } from '#/utils/viewTransition'
import { Button } from '@/components/ui/button'
import { Link, Outlet, useRouter, useRouterState } from '@tanstack/react-router'
import { Bookmark, Film, LogOut, Star } from 'lucide-react'

const navItems = [
  { title: 'Browse', href: '/movies', icon: Film },
  { title: 'Favorites', href: '/favorites', icon: Star },
  { title: 'Watchlist', href: '/watchlist', icon: Bookmark },
] as const

export function AppShell() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const router = useRouter()
  const { viewer, logoutMutation } = useViewer()
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
                  data-testid={`nav-${item.title.toLowerCase()}`}
                  onClick={() => {
                    if (active) return
                    withViewTransition(() => {
                      void router.navigate(
                        item.href === '/movies'
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
          {viewer.user ? (
            <div className="flex shrink-0 items-center gap-2">
              <span className="hidden max-w-32 truncate text-xs text-muted-foreground sm:inline">
                {viewer.user.name}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-2"
                disabled={logoutMutation.isPending}
                onClick={() => logoutMutation.mutate()}
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </div>
          ) : null}
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
