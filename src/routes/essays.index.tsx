import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { getEssays, formatDate } from "../lib/content";
import { Reveal } from "../components/site/Reveal";

export const Route = createFileRoute("/essays/")({
  loader: () => getEssays(),
  head: () => ({
    meta: [
      { title: "Essays — Atlas Beaumont" },
      { name: "description", content: "An archive of essays on attention, craft, and the considered life." },
      { property: "og:title", content: "Essays — Atlas Beaumont" },
      { property: "og:url", content: "/essays" },
    ],
    links: [{ rel: "canonical", href: "/essays" }],
  }),
  component: EssaysIndex,
});

function EssaysIndex() {
  const essays = Route.useLoaderData();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(essays.map((e) => e.category))),
    [essays],
  );

  const filtered = essays.filter((e) => {
    const matchesQ = q
      ? (e.title + e.excerpt).toLowerCase().includes(q.toLowerCase())
      : true;
    const matchesCat = cat ? e.category === cat : true;
    return matchesQ && matchesCat;
  });

  return (
    <>
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-[1440px] px-6 py-32 md:px-12 md:py-40">
          <Reveal>
            <p className="eyebrow">The archive</p>
            <h1 className="mt-8 font-display text-6xl tracking-tight md:text-8xl">
              Essays.
            </h1>
            <p className="mt-8 max-w-xl font-serif text-xl leading-relaxed text-muted-foreground">
              A working archive — written slowly, edited slower. Use the search
              to find a thought; use the categories to wander.
            </p>
          </Reveal>

          <div className="mt-20 flex flex-col gap-8 border-y border-hairline py-8 md:flex-row md:items-center md:justify-between">
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search essays…"
              className="w-full max-w-md bg-transparent text-lg text-foreground placeholder:text-muted-foreground/60 focus:outline-none md:w-96"
            />
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-[11px] uppercase tracking-[0.22em]">
              <button
                onClick={() => setCat(null)}
                className={`link-underline ${!cat ? "text-accent" : "text-muted-foreground hover:text-foreground"}`}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`link-underline ${cat === c ? "text-accent" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1440px] px-6 py-24 md:px-12 md:py-32">
          <div className="divide-y divide-hairline">
            {filtered.map((essay, i) => (
              <Reveal key={essay.slug} delay={i * 0.04}>
                <Link
                  to="/essays/$slug"
                  params={{ slug: essay.slug }}
                  className="group grid grid-cols-12 items-baseline gap-6 py-14 transition-colors"
                >
                  <div className="col-span-12 flex items-center gap-4 text-[11px] uppercase tracking-[0.22em] text-muted-foreground md:col-span-3">
                    <span className="gold-rule" />
                    <span>{formatDate(essay.publishedAt)}</span>
                  </div>
                  <div className="col-span-12 md:col-span-7">
                    <h2 className="font-display text-4xl tracking-tight text-foreground transition-colors group-hover:text-accent md:text-5xl">
                      {essay.title}
                    </h2>
                    <p className="mt-4 max-w-xl font-serif text-base leading-relaxed text-muted-foreground">
                      {essay.excerpt}
                    </p>
                  </div>
                  <div className="col-span-12 text-right text-[11px] uppercase tracking-[0.22em] text-accent md:col-span-2">
                    {essay.readingMinutes} min →
                  </div>
                </Link>
              </Reveal>
            ))}
            {filtered.length === 0 && (
              <p className="py-20 text-center font-serif text-xl text-muted-foreground">
                Nothing yet under this thread.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
