import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-subtle">
      <div className="text-center">
        <h1 className="mb-2 text-6xl font-bold text-foreground">404</h1>
        <p className="mb-6 text-base text-muted-foreground">We can't find the page you're looking for.</p>
        <Link
          to="/"
          className="inline-block rounded-[var(--radius-md)] bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          Go home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
