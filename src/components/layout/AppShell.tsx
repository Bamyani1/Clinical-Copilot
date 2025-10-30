import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, Stethoscope, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  children: React.ReactNode;
};

const navItems = [
  { to: "/", label: "Overview" },
  { to: "/about", label: "About" },
];

export function AppShell({ children }: Props) {
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== "undefined" ? navigator.onLine : true);
  const location = useLocation();

  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-subtle text-foreground antialiased">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-95 [background:radial-gradient(1400px_800px_at_10%_10%,_hsl(var(--primary)_/_0.48),_transparent_72%),radial-gradient(1100px_680px_at_85%_5%,_hsl(var(--secondary)_/_0.42),_transparent_68%),radial-gradient(900px_520px_at_50%_108%,_hsl(var(--accent)_/_0.28),_transparent_75%),linear-gradient(180deg,_hsl(var(--surface))_0%,_hsl(var(--background))_100%)]" />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-6 focus:left-6 focus:z-50 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-lg transition"
      >
        Skip to content
      </a>

      {!isOnline && (
        <div
          role="status"
          aria-live="polite"
          className="z-40 w-full bg-accent/90 py-2 text-center text-xs font-semibold text-accent-foreground shadow-md shadow-accent/40"
        >
          <WifiOff className="mr-1 inline h-4 w-4" /> You are offline. Some features may be unavailable.
        </div>
      )}

      <header className="relative z-40 px-4 pt-8 sm:px-6">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 rounded-full border border-border/60 bg-surface/70 px-4 py-3 shadow-lg shadow-primary/10 backdrop-blur-2xl sm:px-6">
          <Link to="/" className="flex items-center gap-4 text-sm text-muted-foreground transition hover:text-foreground">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-md shadow-primary/40">
              <Stethoscope className="h-5 w-5" strokeWidth={1.3} />
            </span>
            <div className="leading-tight">
              <p className="text-[11px] uppercase tracking-[0.32em] text-subtle">Clinical Copilot</p>
              <p className="text-lg font-semibold text-foreground">Clinical Copilot Lab</p>
            </div>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full border border-border/60 bg-background/40 text-muted-foreground transition hover:border-primary-muted/60 hover:text-foreground"
                >
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Open navigation menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 rounded-[var(--radius)] border border-border/60 bg-surface/95 p-1 shadow-xl shadow-primary/10 backdrop-blur"
              >
                {navItems.map((item) => (
                  <DropdownMenuItem
                    key={item.to}
                    asChild
                    className="cursor-pointer rounded-[calc(var(--radius)-4px)] px-3 py-2 text-sm font-medium tracking-wide text-muted-foreground/90 transition hover:bg-primary/15 hover:text-foreground"
                  >
                    <Link
                      to={item.to}
                      aria-current={location.pathname === item.to ? "page" : undefined}
                      className="flex items-center justify-between"
                    >
                      <span>{item.label}</span>
                      {location.pathname === item.to && (
                        <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
                      )}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="my-1 bg-border/50" />
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer rounded-[calc(var(--radius)-4px)] px-3 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary transition hover:bg-primary/15 hover:text-primary"
                >
                  <Link to="/consent">
                    Launch Visit
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main id="main" className="relative z-30 mx-auto w-full max-w-6xl px-6 pb-24 pt-6 sm:pt-10">
        {children}
      </main>

      <footer className="relative z-30 px-6 pb-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="text-muted-foreground/70">
            © {new Date().getFullYear()} Clinical Copilot — Experimental sandbox for clinician-led AI.
          </div>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <Link to="/about" className="transition hover:text-foreground">
              About
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-foreground"
            >
              Source
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
