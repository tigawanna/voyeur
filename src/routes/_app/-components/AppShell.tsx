import { useViewer } from "#/data-access-layer/auth/viewer";
import {
  applyLibrarySyncPreference,
  syncLibraryEvents,
} from "#/data-access-layer/sync/sync-events";
import { ensureDb } from "#/data-access-layer/tmdb/local-library-db";
import { AppActivityNprogress } from "@/components/navigation/nprogress/AppActivityNprogress";
import { Spinner } from "@/components/ui/spinner";
import { AppConfig } from "#/utils/system";
import { browseSearchDefaults } from "#/types/browse";
import { cn } from "@/lib/utils";
import { withViewTransition } from "#/utils/viewTransition";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link, Outlet, useRouter, useRouterState } from "@tanstack/react-router";
import {
  Bookmark,
  Film,
  LogOut,
  Menu,
  ScrollText,
  Settings,
  Star,
  Workflow,
} from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { title: "Browse", href: "/movies", icon: Film },
  { title: "Favorites", href: "/favorites", icon: Star },
  { title: "Watchlist", href: "/watchlist", icon: Bookmark },
  { title: "Events", href: "/events", icon: Workflow },
  { title: "Logs", href: "/logs", icon: ScrollText },
  { title: "Settings", href: "/settings", icon: Settings },
] as const;

type NavItem = (typeof navItems)[number];

function useAppNavigation() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const router = useRouter();

  function navigateTo(item: NavItem) {
    withViewTransition(() => {
      void router.navigate(
        item.href === "/movies"
          ? { to: item.href, search: browseSearchDefaults }
          : { to: item.href },
      );
    });
  }

  function isActive(href: string) {
    return pathname.startsWith(href);
  }

  return { navigateTo, isActive };
}

interface AppNavButtonProps {
  item: NavItem;
  active: boolean;
  onNavigate: (item: NavItem) => void;
  layout?: "horizontal" | "vertical" | "bottom";
}

function AppNavButton({ item, active, onNavigate, layout = "horizontal" }: AppNavButtonProps) {
  const NavIcon = item.icon;

  return (
    <button
      type="button"
      data-testid={`nav-${item.title.toLowerCase()}`}
      onClick={() => {
        if (active) return;
        onNavigate(item);
      }}
      className={cn(
        "transition",
        layout === "horizontal" &&
          "inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs tracking-wide",
        layout === "vertical" &&
          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left font-mono text-sm tracking-wide",
        layout === "bottom" && "flex min-w-0 flex-1 flex-col items-center gap-1 px-1 py-2",
        active
          ? layout === "bottom"
            ? "text-primary"
            : "bg-primary/15 text-foreground"
          : layout === "bottom"
            ? "text-muted-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <NavIcon size={layout === "bottom" ? 18 : 14} className={cn(layout === "bottom" && "shrink-0")} />
      <span className={cn(layout === "bottom" && "max-w-full truncate text-[10px] leading-none font-medium")}>
        {item.title}
      </span>
    </button>
  );
}

export function AppShell() {
  const [dbReady, setDbReady] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { navigateTo, isActive } = useAppNavigation();
  const { viewer, logoutMutation } = useViewer();
  const Icon = AppConfig.icon;

  useEffect(() => {
    void ensureDb().then(() => {
      setDbReady(true);
    });
  }, []);

  useEffect(() => {
    if (!dbReady || !viewer.user) {
      return;
    }

    void applyLibrarySyncPreference().then((enabled) => {
      if (enabled) {
        void syncLibraryEvents();
      }
    });
  }, [dbReady, viewer.user?.id]);

  if (!dbReady) {
    return (
      <div className="flex h-svh items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  function handleNavigate(item: NavItem) {
    setMobileMenuOpen(false);
    navigateTo(item);
  }

  return (
    <div className="min-h-dvh bg-background">
      <AppActivityNprogress />
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-3 sm:h-16 sm:gap-4 sm:px-4">
          <div className="flex min-w-0 items-center gap-2">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground lg:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent side="left" className="flex w-[min(100vw-2rem,20rem)] flex-col p-0">
                <SheetHeader className="border-b border-border px-4 py-4 text-left">
                  <SheetTitle className="flex items-center gap-2 font-mono text-xs font-bold tracking-[0.24em] uppercase">
                    <Icon className="size-4 text-primary" />
                    {AppConfig.wordmark}
                    <span className="text-primary">.</span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 p-3">
                  {navItems.map((item) => (
                    <AppNavButton
                      key={item.href}
                      item={item}
                      active={isActive(item.href)}
                      layout="vertical"
                      onNavigate={handleNavigate}
                    />
                  ))}
                </nav>
                {viewer.user ? (
                  <div className="mt-auto border-t border-border p-4">
                    <p className="mb-3 truncate text-sm font-medium text-foreground">
                      {viewer.user.name}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                      disabled={logoutMutation.isPending}
                      onClick={() => logoutMutation.mutate()}
                    >
                      <LogOut className="size-4" />
                      Sign out
                    </Button>
                  </div>
                ) : null}
              </SheetContent>
            </Sheet>
            <Link to="/" className="flex min-w-0 items-center gap-2 no-underline">
              <Icon className="size-5 shrink-0 text-primary" />
              <span className="truncate font-mono text-xs font-bold tracking-[0.24em] text-foreground uppercase">
                {AppConfig.wordmark}
                <span className="text-primary">.</span>
              </span>
            </Link>
          </div>
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <AppNavButton
                key={item.href}
                item={item}
                active={isActive(item.href)}
                onNavigate={navigateTo}
              />
            ))}
          </nav>
          {viewer.user ? (
            <div className="flex shrink-0 items-center gap-2">
              <span className="hidden max-w-32 truncate text-xs text-muted-foreground xl:inline">
                {viewer.user.name}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="lg:hidden"
                disabled={logoutMutation.isPending}
                aria-label="Sign out"
                onClick={() => logoutMutation.mutate()}
              >
                <LogOut className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="hidden gap-2 lg:inline-flex"
                disabled={logoutMutation.isPending}
                onClick={() => logoutMutation.mutate()}
              >
                <LogOut className="size-4" />
                Sign out
              </Button>
            </div>
          ) : null}
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-3 py-4 pb-[calc(4.5rem+env(safe-area-inset-bottom))] sm:px-4 sm:py-6 lg:pb-8 lg:py-8">
        <Outlet />
      </main>
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto flex max-w-7xl items-stretch justify-between px-1">
          {navItems.map((item) => (
            <AppNavButton
              key={item.href}
              item={item}
              active={isActive(item.href)}
              layout="bottom"
              onNavigate={navigateTo}
            />
          ))}
        </div>
      </nav>
    </div>
  );
}
