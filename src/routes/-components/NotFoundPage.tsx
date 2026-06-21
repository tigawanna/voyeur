import { browseSearchDefaults } from "#/types/browse";
import { AppConfig } from "#/utils/system";
import { withViewTransition } from "#/utils/viewTransition";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Film, Home } from "lucide-react";

export function NotFoundPage() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();
  const Icon = AppConfig.icon;

  function goBack() {
    withViewTransition(() => {
      window.history.back();
    });
  }

  function goToBrowse() {
    withViewTransition(() => {
      void navigate({ to: "/movies", search: browseSearchDefaults });
    });
  }

  function goHome() {
    withViewTransition(() => {
      void navigate({ to: "/" });
    });
  }

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <Icon className="size-5 text-primary" />
            <span className="font-mono text-xs font-bold tracking-[0.24em] text-foreground uppercase">
              {AppConfig.wordmark}
              <span className="text-primary">.</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="page-wrap flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 py-16">
        <section className="island-shell rise-in relative w-full max-w-xl overflow-hidden rounded-4xl px-8 py-12 text-center sm:px-12 sm:py-14">
          <div className="pointer-events-none absolute -left-20 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.3),transparent_68%)]" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(120,72,32,0.22),transparent_68%)]" />

          <div className="relative">
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl border border-border bg-card/80 shadow-sm">
              <Film className="size-7 text-primary" />
            </div>

            <p className="island-kicker mb-3">404 · cut to black</p>
            <h1 className="display-title mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Scene not found
            </h1>
            <p className="mx-auto mb-2 max-w-md text-base text-muted-foreground">
              This reel never made it to the final cut. The URL might be wrong, or the route got
              left on the editing room floor.
            </p>
            {pathname ? (
              <p className="mx-auto mb-8 max-w-md font-mono text-xs tracking-wide text-foreground/70">
                {pathname}
              </p>
            ) : (
              <div className="mb-8" />
            )}

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button type="button" variant="outline" onClick={goBack}>
                Go back
              </Button>
              <Button type="button" onClick={goToBrowse}>
                Browse movies →
              </Button>
              <Button type="button" variant="secondary" className="gap-2" onClick={goHome}>
                <Home className="size-4" />
                Home
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
