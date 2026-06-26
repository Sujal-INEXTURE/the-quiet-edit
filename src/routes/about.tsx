import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "../components/site/Reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Atlas Beaumont" },
      { name: "description", content: "A short biography. Writer, investor, and student of the considered life." },
      { property: "og:title", content: "About — Atlas Beaumont" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

const timeline: [string, string][] = [
  ["2026", "Founded the correspondence. Began publishing essays monthly."],
  ["2022", "Closed third fund. Stopped attending conferences."],
  ["2018", "Moved studio from New York to London. Started keeping a daily journal."],
  ["2014", "First book published in eleven languages."],
  ["2009", "Left the bank. Took a year to read and to walk."],
];

export default function _() { return null }

function About() {
  return (
    <>
      <section className="border-b border-hairline">
        <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-6 px-6 py-32 md:px-12 md:py-40">
          <div className="col-span-12 md:col-span-7">
            <Reveal>
              <p className="eyebrow">A short biography</p>
              <h1 className="mt-10 font-display text-6xl leading-[1.02] tracking-tight md:text-8xl">
                I write to think,<br />
                <span className="italic text-accent">and publish</span><br />
                to be corrected.
              </h1>
              <p className="mt-12 max-w-xl font-serif text-xl leading-relaxed text-muted-foreground">
                Atlas Beaumont is a writer and investor based in London. His work
                has appeared in The Paris Review, Monocle, and Financial Times
                Weekend. He is the author of two books on attention and capital.
              </p>
            </Reveal>
          </div>

          <div className="col-span-12 md:col-span-4 md:col-start-9">
            <Reveal delay={0.2}>
              <div className="aspect-[3/4] w-full bg-surface relative overflow-hidden">
                <div className="absolute inset-0 grid place-items-center text-muted-foreground/50">
                  <span className="text-[10px] uppercase tracking-[0.3em]">Portrait</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 border-t border-accent/40 p-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  London · MMXXVI
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="border-b border-hairline bg-reading text-reading-foreground">
        <div className="mx-auto max-w-[1100px] px-6 py-32 md:px-12 md:py-48">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.22em] text-reading-foreground/50">Mission</p>
            <p className="mt-12 font-display text-3xl leading-[1.3] tracking-tight md:text-5xl">
              To build a small, honest library — one essay at a time — for the
              reader who would rather think for an hour than be entertained for
              ten.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-[1100px] px-6 py-32 md:px-12 md:py-40">
          <Reveal>
            <p className="eyebrow">A working chronology</p>
            <h2 className="mt-8 font-display text-5xl tracking-tight md:text-6xl">Selected years.</h2>
          </Reveal>
          <div className="mt-20 divide-y divide-hairline">
            {timeline.map(([y, t], i) => (
              <Reveal key={y} delay={i * 0.05}>
                <div className="grid grid-cols-12 gap-6 py-10">
                  <p className="col-span-3 font-display text-3xl text-accent md:col-span-2">{y}</p>
                  <p className="col-span-9 font-serif text-lg leading-relaxed text-foreground md:col-span-10">
                    {t}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
