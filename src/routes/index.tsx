import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { getEssays, formatDate, type Essay } from "../lib/content";
import { Reveal } from "../components/site/Reveal";

export const Route = createFileRoute("/")({
  loader: async (): Promise<Essay[]> => getEssays(),
  head: () => ({
    meta: [
      { title: "Atlas Beaumont — Essays, Notes, and Correspondence" },
      { name: "description", content: "A quiet library of essays and notes on attention, craft, and the architecture of a considered life." },
      { property: "og:title", content: "Atlas Beaumont" },
      { property: "og:description", content: "Essays, notes, and correspondence on attention, craft, and the considered life." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const essays = Route.useLoaderData();
  const featured = essays.slice(0, 3);
  const notes = essays.slice(0, 4).map((e) => ({
    slug: e.slug,
    publishedAt: e.publishedAt,
    excerpt: e.excerpt,
  }));

  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[88vh] items-end overflow-hidden border-b border-hairline">
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-12 gap-6 px-6 pb-24 pt-32 md:px-12 md:pb-32 md:pt-40">
          <div className="col-span-12 md:col-span-10 md:col-start-2">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="eyebrow"
            >
              Volume IV — Summer Issue
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="mt-10 font-display text-[clamp(3rem,9vw,8.5rem)] leading-[0.95] tracking-[-0.03em] text-foreground"
            >
              A library for the<br />
              <span className="italic text-accent">considered</span> life.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
              className="mt-12 max-w-xl font-serif text-xl leading-relaxed text-muted-foreground md:text-2xl"
            >
              Essays on attention, craft, and the quiet companies of the next
              century — written from a desk in London, dispatched once a month.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="mt-16 flex flex-wrap items-center gap-6"
            >
              <Link
                to="/subscribe"
                className="border border-accent px-8 py-4 text-[11px] uppercase tracking-[0.24em] text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Subscribe
              </Link>
              <Link
                to="/essays"
                className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-foreground/80 hover:text-foreground"
              >
                <span className="link-underline">Read the essays</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-muted-foreground"
        >
          Scroll
        </motion.div>
      </section>

      {/* FEATURED ESSAYS */}
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-[1440px] px-6 py-32 md:px-12 md:py-48">
          <Reveal className="grid grid-cols-12 gap-6">
            <div className="col-span-12 flex items-end justify-between border-b border-hairline pb-8 md:col-span-12">
              <div>
                <p className="eyebrow">№ 01 — Featured</p>
                <h2 className="mt-6 font-display text-5xl tracking-tight md:text-7xl">
                  Recent essays.
                </h2>
              </div>
              <Link to="/essays" className="hidden text-[11px] uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground md:inline link-underline">
                All essays →
              </Link>
            </div>
          </Reveal>

          <div className="mt-20 grid grid-cols-12 gap-x-6 gap-y-20">
            {featured.map((essay, i) => (
              <Reveal
                key={essay.slug}
                delay={i * 0.08}
                className={
                  i === 0
                    ? "col-span-12 md:col-span-8"
                    : i === 1
                    ? "col-span-12 md:col-span-4"
                    : "col-span-12 md:col-span-6 md:col-start-4"
                }
              >
                <Link to="/essays/$slug" params={{ slug: essay.slug }} className="group block">
                  <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    <span className="gold-rule" />
                    <span>{essay.category}</span>
                    <span>·</span>
                    <span>{formatDate(essay.publishedAt)}</span>
                  </div>
                  <h3 className={`mt-6 font-display tracking-tight text-foreground transition-colors group-hover:text-accent ${i === 0 ? "text-5xl md:text-6xl" : "text-3xl md:text-4xl"}`}>
                    {essay.title}
                  </h3>
                  <p className="mt-6 max-w-xl font-serif text-lg leading-relaxed text-muted-foreground">
                    {essay.excerpt}
                  </p>
                  <p className="mt-8 text-[11px] uppercase tracking-[0.22em] text-accent">
                    Read · {essay.readingMinutes} min
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST NOTES */}
      <section className="border-b border-hairline bg-surface/40">
        <div className="mx-auto max-w-[1440px] px-6 py-32 md:px-12 md:py-48">
          <Reveal>
            <p className="eyebrow">№ 02 — From the desk</p>
            <h2 className="mt-6 font-display text-5xl tracking-tight md:text-7xl">
              Latest notes.
            </h2>
          </Reveal>

          <div className="mt-20 grid grid-cols-1 gap-px bg-hairline md:grid-cols-2">
            {notes.map((n, i) => (
              <Reveal key={n.slug} delay={i * 0.05} className="bg-background p-10 md:p-14">
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  {formatDate(n.publishedAt)}
                </p>
                <p className="mt-6 font-serif text-2xl leading-snug text-foreground">
                  {n.excerpt}
                </p>
                <Link
                  to="/essays/$slug"
                  params={{ slug: n.slug }}
                  className="mt-8 inline-block text-[11px] uppercase tracking-[0.22em] text-accent link-underline"
                >
                  Continue →
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-[1440px] px-6 py-32 text-center md:px-12 md:py-48">
          <Reveal>
            <p className="eyebrow">№ 03 — The correspondence</p>
            <h2 className="mx-auto mt-8 max-w-3xl font-display text-5xl tracking-tight md:text-7xl">
              One letter, on the<br />
              <span className="italic text-accent">first Sunday</span> of each month.
            </h2>
            <p className="mx-auto mt-8 max-w-xl font-serif text-lg leading-relaxed text-muted-foreground">
              No promotional cadence. No tracking pixels. A single, considered
              dispatch — and the freedom to leave at any moment.
            </p>
            <Link
              to="/subscribe"
              className="mt-12 inline-block border border-accent px-10 py-5 text-[11px] uppercase tracking-[0.24em] text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Begin the correspondence
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
