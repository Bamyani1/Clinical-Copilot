import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowUpRight, Stethoscope, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  children: React.ReactNode;
};

const navItems = [
  { to: "/", label: "Overview" },
  { to: "/about", label: "About" },
  { to: "/guidelines", label: "Guidelines" },
  { to: "/admin", label: "Control Room" },
];

export function AppShell({ children }: Props) {
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== "undefined" ? navigator.onLine : true);

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
    <div className="relative min-h-screen text-foreground antialiased">

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
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 rounded-full border border-border/60 bg-surface/70 px-4 py-3 backdrop-blur-2xl sm:px-6">
          <Link to="/" className="flex items-center gap-4 text-sm text-muted-foreground transition hover:text-foreground">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary text-background shadow-md shadow-primary/40">
              <Stethoscope className="h-5 w-5" strokeWidth={1.3} />
            </span>
            <div className="leading-tight">
              <p className="text-[11px] uppercase tracking-[0.32em] text-subtle">Clinical Copilot</p>
              <p className="text-lg font-semibold text-foreground">Clinical Copilot Lab</p>
            </div>
          </Link>

          <nav className="ml-auto hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "rounded-full px-4 py-2 text-xs font-medium tracking-wide transition",
                    "hover:bg-primary-muted/40 hover:text-foreground",
                    isActive ? "bg-primary-muted/60 text-primary-foreground" : "text-muted-foreground",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/consent">
              <Button className="hidden h-9 rounded-full border border-primary-muted bg-transparent px-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary transition hover:bg-primary/20 md:flex">
                Launch Visit
                <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main id="main" className="relative z-30 mx-auto w-full max-w-6xl px-6 pb-24 pt-14 sm:pt-16">
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
            <Link to="/guidelines" className="transition hover:text-foreground">
              Protocol Library
            </Link>
            <Link to="/admin" className="transition hover:text-foreground">
              System Controls
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
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
