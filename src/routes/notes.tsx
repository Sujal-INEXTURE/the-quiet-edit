import { createFileRoute } from "@tanstack/react-router";
import { getNotes, formatDate, type Note } from "../lib/content";
import { Reveal } from "../components/site/Reveal";

export const Route = createFileRoute("/notes")({
  loader: async (): Promise<Note[]> => getNotes(),
  head: () => ({
    meta: [
      { title: "Notes — Atlas Beaumont" },
      { name: "description", content: "Short-form notes from the desk — quotes, fragments, and dispatches between essays." },
      { property: "og:title", content: "Notes — Atlas Beaumont" },
      { property: "og:url", content: "/notes" },
    ],
    links: [{ rel: "canonical", href: "/notes" }],
  }),
  component: Notes,
});

function Notes() {
  const notes = Route.useLoaderData();

  return (
    <>
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-[1440px] px-6 py-32 md:px-12 md:py-40">
          <Reveal>
            <p className="eyebrow">Field notes</p>
            <h1 className="mt-8 font-display text-6xl tracking-tight md:text-8xl">
              Notes.
            </h1>
            <p className="mt-8 max-w-xl font-serif text-xl leading-relaxed text-muted-foreground">
              Fragments, quotations, and dispatches between essays. Often written
              by hand first, then transcribed before they are lost.
            </p>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1440px] px-6 py-24 md:px-12 md:py-32">
          <div className="columns-1 gap-12 md:columns-2 lg:columns-3 [column-fill:_balance]">
            {notes.map((n, i) => (
              <Reveal key={n.id} delay={i * 0.04} className="mb-12 break-inside-avoid border-t border-hairline pt-8">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  <span>{n.kind}</span>
                  <span>{formatDate(n.publishedAt)}</span>
                </div>

                {n.kind === "quote" ? (
                  <blockquote className="mt-6 font-display text-2xl italic leading-snug text-foreground">
                    “{n.body}”
                  </blockquote>
                ) : n.kind === "image" && n.image ? (
                  <>
                    <img src={n.image} alt={n.title ?? ""} className="mt-6 w-full" loading="lazy" />
                    {n.title && <p className="mt-4 font-serif text-base text-muted-foreground">{n.title}</p>}
                  </>
                ) : n.kind === "video" && n.url ? (
                  <div className="mt-6 aspect-video w-full bg-surface">
                    <iframe src={n.url} className="h-full w-full" loading="lazy" allowFullScreen />
                  </div>
                ) : n.kind === "link" ? (
                  <>
                    {n.title && <p className="mt-6 font-display text-2xl tracking-tight text-foreground">{n.title}</p>}
                    <p className="mt-3 font-serif text-base leading-relaxed text-muted-foreground">{n.body}</p>
                    {n.url && (
                      <a href={n.url} className="mt-5 inline-block text-[11px] uppercase tracking-[0.22em] text-accent link-underline" rel="noreferrer">
                        Visit ↗
                      </a>
                    )}
                  </>
                ) : (
                  <>
                    {n.title && <p className="mt-6 font-display text-2xl tracking-tight text-foreground">{n.title}</p>}
                    <p className="mt-3 font-serif text-base leading-relaxed text-muted-foreground">{n.body}</p>
                  </>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
