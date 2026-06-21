import { AppConfig } from "#/utils/system";
import { Link } from "@tanstack/react-router";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const Icon = AppConfig.icon;

  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-3">
            <Icon className="size-6 text-primary" />
            <span className="font-mono text-sm font-semibold tracking-wide">{AppConfig.name}</span>
          </div>
          <nav aria-label="footer-navigation">
            <ul className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="no-underline transition hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  search={{ returnTo: "/movies" }}
                  className="no-underline transition hover:text-foreground"
                >
                  Sign in
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <p className="mx-auto mt-6 max-w-6xl text-center text-xs text-muted-foreground">
          © {currentYear} {AppConfig.name}
        </p>
      </div>
    </footer>
  );
}
