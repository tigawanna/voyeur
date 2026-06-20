import { Footer } from '#/components/navigation/Footer'
import { viewerMiddleware } from '#/data-access-layer/auth/viewer'
import { browseSearchDefaults } from '#/types/browse'
import { AppConfig } from '#/utils/system'
import { withViewTransition } from '#/utils/viewTransition'
import { Button } from '@/components/ui/button'
import { createFileRoute, useRouteContext } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: LandingPage,
  server: {
    middleware: [viewerMiddleware],
  },
})

function LandingPage() {
  const navigate = Route.useNavigate()
  const { viewer } = useRouteContext({ from: '__root__' })
  const Icon = AppConfig.icon
  const isSignedIn = Boolean(viewer?.user)

  function handleContinue() {
    withViewTransition(() => {
      if (isSignedIn) {
        void navigate({ to: '/movies', search: browseSearchDefaults })
        return
      }
      void navigate({ to: '/login', search: { returnTo: '/movies' } })
    })
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Icon className="size-5 text-primary" />
            <span className="font-mono text-xs font-bold tracking-[0.24em] text-foreground uppercase">
              {AppConfig.wordmark}
              <span className="text-primary">.</span>
            </span>
          </div>
          {isSignedIn ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                withViewTransition(() => {
                  void navigate({ to: '/movies', search: browseSearchDefaults })
                })
              }}
            >
              Open movies
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                withViewTransition(() => {
                  void navigate({ to: '/login', search: { returnTo: '/movies' } })
                })
              }}
            >
              Sign in
            </Button>
          )}
        </div>
      </header>

      <main className="page-wrap flex flex-1 flex-col justify-center px-4 py-16">
        <section className="island-shell rise-in relative mx-auto w-full max-w-3xl overflow-hidden rounded-4xl px-8 py-14 text-center sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.28),transparent_66%)]" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(120,72,32,0.18),transparent_66%)]" />

          <div className="relative">
            <p className="island-kicker mb-4">Your private screening room</p>
            <h1 className="display-title mb-6 text-4xl leading-[1.05] font-bold tracking-tight text-foreground sm:text-5xl">
              Find something worth watching tonight.
            </h1>
            <p className="mx-auto mb-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {AppConfig.name} is a calm place to browse what&apos;s popular, save the films you
              love, and line up what to watch next — without the noise.
            </p>
            <p className="mx-auto mb-10 max-w-lg text-sm text-muted-foreground">
              Sign in once with Google, then pick up right where you left off on any device.
            </p>
            <Button type="button" size="lg" onClick={handleContinue}>
              {isSignedIn ? 'Continue to movies →' : 'Sign in to continue →'}
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
