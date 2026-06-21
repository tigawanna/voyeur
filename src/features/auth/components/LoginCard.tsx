import { authClient } from "#/lib/better-auth/client";
import { getAppUrl } from "#/lib/client-env";
import { AppConfig } from "#/utils/system";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface GoogleSignInButtonProps {
  returnTo: string;
}

export function GoogleSignInButton({ returnTo }: GoogleSignInButtonProps) {
  const mutation = useMutation({
    mutationFn: async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${getAppUrl()}${returnTo}`,
      });
    },
    onError: (error: unknown) => {
      toast.error("Google sign-in failed", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    },
  });

  return (
    <Button
      type="button"
      className="w-full"
      disabled={mutation.isPending}
      onClick={() => mutation.mutate()}
    >
      {mutation.isPending ? "Redirecting…" : "Continue with Google"}
    </Button>
  );
}

export function LoginCard({ returnTo }: GoogleSignInButtonProps) {
  const Icon = AppConfig.icon;

  return (
    <div className="island-shell rise-in relative w-full max-w-md overflow-hidden rounded-4xl px-8 py-10 sm:px-10">
      <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.28),transparent_68%)]" />
      <div className="relative flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Icon className="size-8 text-primary" />
          <div className="text-left">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Sign in to open {AppConfig.name}</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Use your Google account to browse movies, save favorites, and build your watchlist.
        </p>
        <GoogleSignInButton returnTo={returnTo} />
      </div>
    </div>
  );
}
