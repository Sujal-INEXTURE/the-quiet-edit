import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getEssays, getEssay, formatDate, type Essay } from "../lib/content";
import { Reveal } from "../components/site/Reveal";

type EssayLoaderData = {
  essay: Essay;
  prev: Essay | null;
  next: Essay | null;
  related: Essay[];
};

export const Route = createFileRoute("/essays/$slug")({
  loader: async ({ params }): Promise<EssayLoaderData> => {
    const [essay, all] = await Promise.all([getEssay(params.slug), getEssays()]);
    if (!essay) throw notFound();
    const idx = all.findIndex((e) => e.slug === essay.slug);
    return {
      essay,
      prev: idx > 0 ? all[idx - 1] : null,
      next: idx < all.length - 1 ? all[idx + 1] : null,
      related: all.filter((e) => e.slug !== essay.slug).slice(0, 3),
    };
  },
  head: ({ loaderData }) => {
    const e = loaderData?.essay;
    return {
      meta: [
        { title: e ? `${e.title} — Atlas Beaumont` : "Essay" },
        { name: "description", content: e?.excerpt ?? "" },
        { property: "og:title", content: e?.title ?? "" },
        { property: "og:description", content: e?.excerpt ?? "" },
        { property: "og:type", content: "article" },
        { property: "og:url", content: e ? `/essays/${e.slug}` : "/essays" },
      ],
      links: e ? [{ rel: "canonical", href: `/essays/${e.slug}` }] : [],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-40 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-6 font-display text-5xl">Essay not found.</h1>
      <Link to="/essays" className="mt-10 inline-block text-[11px] uppercase tracking-[0.22em] text-accent link-underline">
        ← All essays
      </Link>
    </div>
  ),
  component: EssayPage,
});

function EssayPage() {
  const { essay, prev, next, related } = Route.useLoaderData() as EssayLoaderData;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setProgress(total > 0 ? (h.scrollTop / total) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function share(kind: "twitter" | "copy") {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (kind === "copy") navigator.clipboard?.writeText(url);
    if (kind === "twitter")
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(essay.title)}&url=${encodeURIComponent(url)}`,
        "_blank",
      );
  }

  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-[60] h-px bg-hairline">
        <div
          className="h-full bg-accent transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      <article>
        {/* Header on dark */}
        <header className="border-b border-hairline">
          <div className="mx-auto max-w-[1100px] px-6 py-32 text-center md:py-40">
            <Reveal>
              <p className="eyebrow">{essay.category}</p>
              <h1 className="mx-auto mt-10 max-w-4xl font-display text-5xl leading-[1.05] tracking-tight md:text-7xl">
                {essay.title}
              </h1>
              <p className="mx-auto mt-10 max-w-2xl font-serif text-xl leading-relaxed text-muted-foreground">
                {essay.excerpt}
              </p>
              <div className="mt-14 flex items-center justify-center gap-6 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                <span>{formatDate(essay.publishedAt)}</span>
                <span className="h-px w-8 bg-accent" />
                <span>{essay.readingMinutes} min read</span>
              </div>
            </Reveal>
          </div>
        </header>

        {/* Reading panel — ivory */}
        <div className="bg-reading text-reading-foreground">
          <div className="mx-auto grid max-w-[1200px] grid-cols-12 gap-6 px-6 py-32 md:px-12 md:py-40">
            <aside className="col-span-12 md:col-span-2">
              <div className="md:sticky md:top-32">
                <p className="text-[10px] uppercase tracking-[0.3em] text-reading-foreground/50">
                  Share
                </p>
                <div className="mt-4 flex gap-4 text-xs md:flex-col">
                  <button onClick={() => share("twitter")} className="link-underline">X</button>
                  <button onClick={() => share("copy")} className="link-underline">Copy link</button>
                </div>
              </div>
            </aside>
            <div
              className="prose-editorial col-span-12 md:col-span-8"
              dangerouslySetInnerHTML={{ __html: essay.html }}
            />
          </div>
        </div>

        {/* Prev/Next */}
        <nav className="border-b border-hairline">
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 divide-y divide-hairline md:grid-cols-2 md:divide-x md:divide-y-0">
            {prev ? (
              <Link to="/essays/$slug" params={{ slug: prev.slug }} className="group block px-6 py-16 md:px-12 md:py-24">
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">← Previous</p>
                <p className="mt-6 font-display text-3xl tracking-tight transition-colors group-hover:text-accent">{prev.title}</p>
              </Link>
            ) : <div />}
            {next ? (
              <Link to="/essays/$slug" params={{ slug: next.slug }} className="group block px-6 py-16 text-right md:px-12 md:py-24">
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Next →</p>
                <p className="mt-6 font-display text-3xl tracking-tight transition-colors group-hover:text-accent">{next.title}</p>
              </Link>
            ) : <div />}
          </div>
        </nav>

        {/* Related */}
        <section className="border-b border-hairline">
          <div className="mx-auto max-w-[1440px] px-6 py-24 md:px-12 md:py-32">
            <p className="eyebrow">Further reading</p>
            <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-3">
              {related.map((r) => (
                <Link key={r.slug} to="/essays/$slug" params={{ slug: r.slug }} className="group block border-t border-hairline pt-8">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{r.category}</p>
                  <h3 className="mt-4 font-display text-2xl tracking-tight transition-colors group-hover:text-accent">{r.title}</h3>
                  <p className="mt-3 font-serif text-sm leading-relaxed text-muted-foreground">{r.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
