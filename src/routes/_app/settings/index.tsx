import {
  favoritesCollection,
  watchlistCollection,
} from "#/data-access-layer/tmdb/query-collection";
import { useViewer } from "#/data-access-layer/auth/viewer";
import { ConfirmDialog } from "#/components/common/ConfirmDialog";
import type { SavedMovieRef } from "#/types/movie";
import { AppConfig } from "#/utils/system";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLiveQuery } from "@tanstack/react-db";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/settings/")({
  head: () => ({
    meta: [{ title: `${AppConfig.name} | Settings` }],
  }),
  component: SettingsPage,
});

async function clearLocalLibraryData(
  favorites: SavedMovieRef[],
  watchlist: SavedMovieRef[],
) {
  await Promise.all([
    ...favorites.map((item) => favoritesCollection.delete(item.movieId)),
    ...watchlist.map((item) => watchlistCollection.delete(item.movieId)),
  ]);
}

function SettingsPage() {
  const { viewer, deleteAccountMutation } = useViewer();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { data: favoritesData } = useLiveQuery(
    (query) =>
      query.from({ favorite: favoritesCollection }).select(({ favorite }) => ({
        movieId: favorite.movieId,
        title: favorite.title,
        posterPath: favorite.posterPath,
        addedAt: favorite.addedAt,
      })),
    [],
  );
  const { data: watchlistData } = useLiveQuery(
    (query) =>
      query.from({ watchlist: watchlistCollection }).select(({ watchlist }) => ({
        movieId: watchlist.movieId,
        title: watchlist.title,
        posterPath: watchlist.posterPath,
        addedAt: watchlist.addedAt,
      })),
    [],
  );
  const favorites = (favoritesData ?? []) as SavedMovieRef[];
  const watchlist = (watchlistData ?? []) as SavedMovieRef[];

  async function handleDeleteAccount() {
    try {
      await clearLocalLibraryData(favorites, watchlist);
    } catch {
      toast.error("Could not clear local library data. Try again.");
      setDeleteDialogOpen(false);
      return;
    }

    deleteAccountMutation.mutate(undefined, {
      onError: (error) => {
        toast.error(
          error instanceof Error
            ? error.message
            : "Could not delete your account. Sign out, sign in again, and retry.",
        );
        setDeleteDialogOpen(false);
      },
    });
  }

  return (
    <section className="mx-auto max-w-2xl">
      <div className="mb-8">
        <p className="island-kicker mb-2">Account</p>
        <h1 className="display-title text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Settings
        </h1>
      </div>

      <div className="island-shell space-y-6 rounded-3xl p-6 sm:p-8">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Profile</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
              <dt className="text-muted-foreground">Name</dt>
              <dd className="font-medium text-foreground">{viewer.user?.name ?? "—"}</dd>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium text-foreground">{viewer.user?.email ?? "—"}</dd>
            </div>
          </dl>
        </div>

        <div className="border-t border-border pt-6">
          <h2 className="text-lg font-semibold text-foreground">Legal</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Review how we handle your data and the rules for using {AppConfig.name}.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/privacy"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Privacy Policy
            </Link>
            <Link to="/terms" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
              Terms of Use
            </Link>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <h2 className="text-lg font-semibold text-destructive">Danger zone</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Permanently delete your {AppConfig.name} account and remove your sign-in data from our
            servers. Your browser-stored favorites and watchlist on this device will also be cleared.
            This cannot be undone.
          </p>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="mt-4"
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete account
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete your account?"
        description="This permanently removes your account from our servers and clears your local favorites and watchlist on this device."
        confirmLabel="Delete account"
        confirmVariant="destructive"
        isConfirming={deleteAccountMutation.isPending}
        onConfirm={() => {
          void handleDeleteAccount();
        }}
      />
    </section>
  );
}
