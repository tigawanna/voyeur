import { AppConfig } from "#/utils/system";
import { withViewTransition } from "#/utils/viewTransition";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Link, useNavigate, useRouter, type ErrorComponentProps } from "@tanstack/react-router";
import { Check, ChevronDown, Copy, Home, RotateCcw, TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";

function formatErrorReport(error: unknown, info?: { componentStack: string }) {
  const sections: string[] = [];

  function appendError(value: unknown, depth = 0) {
    if (depth > 3) {
      sections.push("[cause truncated]");
      return;
    }

    if (value instanceof Error) {
      sections.push(`Name: ${value.name}`);
      sections.push(`Message: ${value.message}`);
      if (value.stack) {
        sections.push(`\nStack:\n${value.stack}`);
      }

      const known = new Set(["name", "message", "stack", "cause"]);
      const extras = Object.keys(value).filter((key) => !known.has(key));
      if (extras.length > 0) {
        const extra: Record<string, unknown> = {};
        for (const key of extras) {
          extra[key] = value[key as keyof Error];
        }
        sections.push(`\nAdditional properties:\n${JSON.stringify(extra, null, 2)}`);
      }

      if (value.cause !== undefined) {
        sections.push("\nCause:");
        appendError(value.cause, depth + 1);
      }
      return;
    }

    if (typeof value === "object" && value !== null) {
      try {
        sections.push(JSON.stringify(value, null, 2));
      } catch {
        sections.push(String(value));
      }
      return;
    }

    sections.push(String(value));
  }

  appendError(error);

  if (info?.componentStack) {
    sections.push(`\nComponent stack:${info.componentStack}`);
  }

  sections.push(`\nURL: ${window.location.href}`);

  return sections.join("\n");
}

export function ErrorPage({ error, info, reset }: ErrorComponentProps) {
  const router = useRouter();
  const navigate = useNavigate();
  const Icon = AppConfig.icon;
  const [copied, setCopied] = useState(false);
  const errorReport = useMemo(() => formatErrorReport(error, info), [error, info]);

  function handleRetry() {
    withViewTransition(() => {
      reset();
      void router.invalidate();
    });
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(errorReport);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
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
              <TriangleAlert className="size-7 text-primary" />
            </div>

            <p className="island-kicker mb-3">Projection interrupted</p>
            <h1 className="display-title mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Something went wrong
            </h1>
            <p className="mx-auto mb-8 max-w-md text-base text-muted-foreground">
              The screening hit a snag before the credits could roll. Try again, copy the details,
              or head home.
            </p>

            <Collapsible className="group/collapsible mx-auto mb-8 max-w-md text-left">
              <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-card/60 px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-card">
                <span>Technical details</span>
                <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 rounded-xl border border-border bg-muted/30 px-4 py-3">
                <pre className="max-h-48 overflow-auto font-mono text-xs leading-relaxed whitespace-pre-wrap wrap-break-word text-muted-foreground">
                  {errorReport}
                </pre>
              </CollapsibleContent>
            </Collapsible>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => void handleCopy()}
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button type="button" className="gap-2" onClick={handleRetry}>
                <RotateCcw className="size-4" />
                Try again
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
