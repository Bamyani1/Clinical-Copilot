import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-2 text-6xl font-bold text-foreground">404</h1>
        <p className="mb-6 text-base text-muted-foreground">We can't find the page you're looking for.</p>
        <a href="/" className="inline-block px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition">
          Go home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
