import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { formatDate, getNote, getNoteTitle, getNotes, type Note } from "../lib/content";
import { Reveal } from "../components/site/Reveal";

type NoteLoaderData = {
  note: Note;
  prev: Note | null;
  next: Note | null;
};

export const Route = createFileRoute("/notes/$slug")({
  loader: async ({ params }): Promise<NoteLoaderData> => {
    const [note, notes] = await Promise.all([getNote(params.slug), getNotes()]);
    if (!note) throw notFound();

    const index = notes.findIndex((n) => n.slug === note.slug);
    return {
      note,
      prev: index > 0 ? notes[index - 1] : null,
      next: index >= 0 && index < notes.length - 1 ? notes[index + 1] : null,
    };
  },
  head: ({ loaderData }) => {
    const note = loaderData?.note;
    const title = note ? getNoteTitle(note) : "Note";

    return {
      meta: [
        { title: `${title} — Notes — Atlas Beaumont` },
        { name: "description", content: note?.body ?? "" },
        { property: "og:title", content: title },
        { property: "og:description", content: note?.body ?? "" },
        { property: "og:url", content: note ? `/notes/${note.slug}` : "/notes" },
      ],
      links: note ? [{ rel: "canonical", href: `/notes/${note.slug}` }] : [],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-40 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-6 font-display text-5xl">Note not found.</h1>
      <Link
        to="/notes"
        className="mt-10 inline-block text-[11px] uppercase tracking-[0.22em] text-accent link-underline"
      >
        All notes
      </Link>
    </div>
  ),
  component: NotePage,
});

function NotePage() {
  const { note, prev, next } = Route.useLoaderData() as NoteLoaderData;
  const title = getNoteTitle(note);

  return (
    <>
      <article>
        <header className="border-b border-hairline">
          <div className="mx-auto max-w-[960px] px-6 py-32 md:px-12 md:py-40">
            <Reveal>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                <span>{note.kind}</span>
                <span className="h-px w-8 bg-accent" />
                <time dateTime={note.publishedAt}>{formatDate(note.publishedAt)}</time>
              </div>
              <h1 className="mt-10 font-display text-5xl leading-tight tracking-tight md:text-7xl">
                {title}
              </h1>
              <p className="mt-10 max-w-2xl font-serif text-xl leading-relaxed text-muted-foreground md:text-2xl">
                {note.body}
              </p>
            </Reveal>
          </div>
        </header>

        <section className="bg-reading text-reading-foreground">
          <div className="mx-auto max-w-[860px] px-6 py-24 md:px-12 md:py-32">
            <Reveal>
              {note.kind === "quote" ? (
                <blockquote className="border-l border-accent pl-8 font-display text-4xl italic leading-tight md:text-5xl">
                  “{note.body}”
                </blockquote>
              ) : (
                <div className="prose-editorial">
                  <p>{note.body}</p>
                  <p>
                    This note is part of the working archive: a short dispatch kept close to the
                    desk before it becomes an essay, a letter, or nothing at all.
                  </p>
                </div>
              )}
            </Reveal>
          </div>
        </section>
      </article>

      <nav className="border-b border-hairline">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 px-6 py-16 md:grid-cols-2 md:px-12">
          {prev ? (
            <Link
              to="/notes/$slug"
              params={{ slug: prev.slug }}
              className="group block border-t border-hairline pt-8"
            >
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Previous note
              </p>
              <p className="mt-4 font-display text-2xl tracking-tight transition-colors group-hover:text-accent">
                {getNoteTitle(prev)}
              </p>
            </Link>
          ) : null}
          {next ? (
            <Link
              to="/notes/$slug"
              params={{ slug: next.slug }}
              className="group block border-t border-hairline pt-8 md:text-right"
            >
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Next note
              </p>
              <p className="mt-4 font-display text-2xl tracking-tight transition-colors group-hover:text-accent">
                {getNoteTitle(next)}
              </p>
            </Link>
          ) : null}
        </div>
      </nav>
    </>
  );
}
