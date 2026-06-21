import { Footer } from "#/components/navigation/Footer";
import { AppConfig } from "#/utils/system";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

type LegalDocumentPageProps = {
  title: string;
  children: ReactNode;
};

export function LegalDocumentPage({ title, children }: LegalDocumentPageProps) {
  const Icon = AppConfig.icon;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
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

      <main className="page-wrap mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:py-16">
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <h1>{title}</h1>
          {children}
        </article>
      </main>

      <Footer />
    </div>
  );
}
