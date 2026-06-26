import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Nav } from "../components/site/Nav";
import { Footer } from "../components/site/Footer";

const themeScript = `
(() => {
  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = stored === "light" || stored === "dark" ? stored : prefersDark ? "dark" : "light";
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
})();
`;

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-6 font-display text-6xl tracking-tight">Not found.</h1>
        <p className="mt-6 text-sm text-muted-foreground">
          The page you sought has wandered off. The library remains open.
        </p>
        <a
          href="/"
          className="mt-10 inline-block text-[11px] uppercase tracking-[0.22em] text-accent link-underline"
        >
          Return to the index
        </a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <p className="eyebrow">Unexpected</p>
        <h1 className="mt-6 font-display text-4xl tracking-tight">This page didn't load.</h1>
        <p className="mt-6 text-sm text-muted-foreground">
          Something interrupted the composition. You may try again.
        </p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-10 border border-accent px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Atlas Beaumont — Essays, Notes, and Correspondence" },
      {
        name: "description",
        content:
          "A quiet library of essays and notes on attention, craft, and the architecture of a considered life.",
      },
      { name: "author", content: "Atlas Beaumont" },
      { property: "og:site_name", content: "Atlas Beaumont" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#070707" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap",
      },
      { rel: "alternate", type: "application/rss+xml", title: "Atlas Beaumont", href: "/rss.xml" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function AnimatedOutlet() {
  const { location } = useRouterState();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}

function BrowserProtection() {
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const blockedKeys = new Set(["F12"]);

    function prevent(event: Event) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }

    function onKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();
      const isDevToolsShortcut =
        blockedKeys.has(event.key) ||
        (event.ctrlKey && event.shiftKey && ["i", "j", "c"].includes(key)) ||
        (event.metaKey && event.altKey && ["i", "j", "c"].includes(key)) ||
        (event.ctrlKey && ["u", "s"].includes(key)) ||
        (event.metaKey && ["u", "s"].includes(key));

      if (isDevToolsShortcut) prevent(event);
    }

    function detectDevTools() {
      const threshold = 170;
      const widthGap = window.outerWidth - window.innerWidth;
      const heightGap = window.outerHeight - window.innerHeight;
      const likelyDockedTools =
        window.innerWidth > 768 && (widthGap > threshold || heightGap > threshold);

      setBlocked(likelyDockedTools);
      if (likelyDockedTools) {
        console.clear();
      }
    }

    document.addEventListener("contextmenu", prevent);
    document.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("resize", detectDevTools);
    const interval = window.setInterval(detectDevTools, 1000);
    detectDevTools();

    return () => {
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("resize", detectDevTools);
      window.clearInterval(interval);
    };
  }, []);

  if (!blocked) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background px-6 text-center">
      <div className="max-w-md">
        <p className="eyebrow">Protected View</p>
        <h2 className="mt-6 font-display text-5xl tracking-tight">Developer tools are disabled.</h2>
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          Close developer tools to continue reading this site.
        </p>
      </div>
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserProtection />
      <Nav />
      <main className="pt-20 md:pt-24">
        <AnimatedOutlet />
      </main>
      <Footer />
    </QueryClientProvider>
  );
}
