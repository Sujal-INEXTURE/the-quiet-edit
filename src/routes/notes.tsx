import { createFileRoute, Link } from "@tanstack/react-router";
import { getNoteTitle, getNotes, formatDate, type Note } from "../lib/content";
import { Reveal } from "../components/site/Reveal";

export const Route = createFileRoute("/notes")({
  loader: async (): Promise<Note[]> => getNotes(),
  head: () => ({
    meta: [
      { title: "Notes — Atlas Beaumont" },
      {
        name: "description",
        content:
          "Short-form notes from the desk — quotes, fragments, and dispatches between essays.",
      },
      { property: "og:title", content: "Notes — Atlas Beaumont" },
      { property: "og:url", content: "/notes" },
    ],
    links: [{ rel: "canonical", href: "/notes" }],
  }),
  component: Notes,
});

function Notes() {
  const notes = Route.useLoaderData() as Note[];

  return (
    <>
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-[1440px] px-6 py-32 md:px-12 md:py-40">
          <Reveal>
            <p className="eyebrow">Field notes</p>
            <h1 className="mt-8 font-display text-6xl tracking-tight md:text-8xl">Notes.</h1>
            <p className="mt-8 max-w-xl font-serif text-xl leading-relaxed text-muted-foreground">
              Fragments, quotations, and dispatches between essays. Often written by hand first,
              then transcribed before they are lost.
            </p>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1440px] px-6 py-24 md:px-12 md:py-32">
          <div className="grid grid-cols-1 gap-x-12 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
            {notes.map((n, i) => {
              const title = getNoteTitle(n);

              return (
                <Reveal
                  key={n.id}
                  delay={i * 0.04}
                  className="h-full border-t border-hairline pt-8"
                >
                  <article className="flex min-h-56 flex-col">
                    <div className="flex min-h-5 items-start justify-between gap-6 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      <span>{n.kind}</span>
                      <time dateTime={n.publishedAt} className="shrink-0 text-right">
                        {formatDate(n.publishedAt)}
                      </time>
                    </div>

                    {n.kind === "image" && n.image ? (
                      <img
                        src={n.image}
                        alt={title}
                        className="mt-6 aspect-[4/3] w-full object-cover"
                        loading="lazy"
                      />
                    ) : n.kind === "video" && n.url ? (
                      <div className="mt-6 aspect-video w-full bg-surface">
                        <iframe
                          src={n.url}
                          className="h-full w-full"
                          loading="lazy"
                          allowFullScreen
                        />
                      </div>
                    ) : null}

                    <h2 className="mt-6 font-display text-2xl tracking-tight text-foreground">
                      {title}
                    </h2>
                    <p className="mt-3 font-serif text-base leading-relaxed text-muted-foreground">
                      {n.body}
                    </p>

                    <Link
                      to="/notes/$slug"
                      params={{ slug: n.slug }}
                      className="mt-auto pt-8 text-[11px] uppercase tracking-[0.22em] text-accent link-underline"
                    >
                      View note
                    </Link>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
