import { Link, useRouterState } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const LINKS = [
  { to: "/", label: "Index" },
  { to: "/essays", label: "Essays" },
  { to: "/notes", label: "Notes" },
  { to: "/about", label: "About" },
  { to: "/work", label: "Work With Me" },
] as const;

export function Nav() {
  const { location } = useRouterState();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.style.colorScheme = nextTheme;
    localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "backdrop-blur-md bg-background/80 border-b border-hairline" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 md:px-12 md:py-6">
        <Link to="/" className="group flex items-baseline gap-3">
          <span className="font-display text-xl tracking-tight text-foreground">
            Atlas Beaumont
          </span>
          <span className="hidden text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:inline">
            Est. MMXXVI
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.slice(1).map((l) => {
            const active = location.pathname === l.to || location.pathname.startsWith(l.to + "/");
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`link-underline text-[13px] tracking-wide transition-colors ${
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            to="/subscribe"
            className="border border-accent px-5 py-2 text-[11px] uppercase tracking-[0.22em] text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Subscribe
          </Link>
          <button
            type="button"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center border border-hairline text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <button
            type="button"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center border border-hairline text-muted-foreground"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button aria-label="Menu" onClick={() => setOpen((v) => !v)} className="text-foreground">
            <span className="block h-px w-7 bg-current" />
            <span className="mt-2 block h-px w-7 bg-current" />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-hairline bg-background md:hidden">
          <div className="flex flex-col px-6 py-6">
            {LINKS.slice(1).map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="border-b border-hairline py-4 text-sm text-muted-foreground"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/subscribe"
              className="mt-6 inline-block border border-accent px-5 py-3 text-center text-[11px] uppercase tracking-[0.22em] text-accent"
            >
              Subscribe
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
