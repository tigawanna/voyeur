import { LoginCard } from "#/features/auth/components/LoginCard";
import { AppConfig } from "#/utils/system";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

const loginSearchSchema = z.object({
  returnTo: z.string().default("/movies"),
});

export const Route = createFileRoute("/login")({
  validateSearch: loginSearchSchema,
  beforeLoad: ({ context, search }) => {
    const returnTo = search.returnTo === "/login" ? "/movies" : search.returnTo;
    if (context.viewer?.user) {
      throw redirect({ to: returnTo });
    }
  },
  head: () => ({
    meta: [{ title: `${AppConfig.name} | Sign in` }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { returnTo } = Route.useSearch();
  const Icon = AppConfig.icon;

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-4">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <Icon className="size-5 text-primary" />
            <span className="font-mono text-xs font-bold tracking-[0.24em] text-foreground uppercase">
              {AppConfig.wordmark}
              <span className="text-primary">.</span>
            </span>
          </Link>
        </div>
      </header>
      <main className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 py-12">
        <LoginCard returnTo={returnTo} />
      </main>
    </div>
  );
}
