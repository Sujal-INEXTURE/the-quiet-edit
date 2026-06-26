import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "../components/site/Reveal";

export const Route = createFileRoute("/subscribe")({
  head: () => ({
    meta: [
      { title: "Subscribe — Atlas Beaumont" },
      { name: "description", content: "One considered letter on the first Sunday of each month. No tracking, no sponsors." },
      { property: "og:title", content: "Subscribe — Atlas Beaumont" },
      { property: "og:url", content: "/subscribe" },
    ],
    links: [{ rel: "canonical", href: "/subscribe" }],
  }),
  component: Subscribe,
});

const benefits = [
  "One letter on the first Sunday of each month.",
  "Essays delivered before the public archive.",
  "Reading lists from the working desk.",
  "An open reply — every letter answered.",
  "No advertising, ever. No tracking pixels.",
];

function Subscribe() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (email) setDone(true);
  }

  return (
    <section className="min-h-[88vh] border-b border-hairline">
      <div className="mx-auto flex max-w-[900px] flex-col items-center px-6 py-32 text-center md:py-40">
        <Reveal>
          <p className="eyebrow">The correspondence</p>
          <h1 className="mt-10 font-display text-6xl leading-[1.02] tracking-tight md:text-8xl">
            A letter,<br />
            on the <span className="italic text-accent">first Sunday</span>.
          </h1>
          <p className="mx-auto mt-10 max-w-xl font-serif text-xl leading-relaxed text-muted-foreground">
            One considered dispatch each month — essays, a reading list, and a
            single thought worth sitting with. Free, and always will be.
          </p>
        </Reveal>

        <div className="mt-20 w-full max-w-lg">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="ok"
                initial={{ opacity: 0, filter: "blur(8px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="border border-accent/40 p-10 text-left"
              >
                <span className="block h-px w-12 bg-accent" />
                <p className="mt-6 font-display text-3xl tracking-tight">A letter awaits.</p>
                <p className="mt-4 font-serif text-base text-muted-foreground">
                  Please confirm your address from the email we have sent to{" "}
                  <span className="text-accent">{email}</span>.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="f"
                onSubmit={onSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center border-b border-hairline focus-within:border-accent transition-colors"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@address.com"
                  className="flex-1 bg-transparent py-5 text-center font-serif text-xl text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
                />
                <button
                  type="submit"
                  className="ml-4 text-[11px] uppercase tracking-[0.22em] text-accent hover:text-foreground transition-colors"
                >
                  Subscribe →
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <Reveal delay={0.2} className="mt-24 w-full max-w-2xl">
          <p className="eyebrow text-center">What you receive</p>
          <ul className="mt-10 divide-y divide-hairline text-left">
            {benefits.map((b, i) => (
              <li key={b} className="flex items-baseline gap-6 py-5">
                <span className="font-display text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-serif text-lg leading-relaxed text-foreground">{b}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
