import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "../components/site/Reveal";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Work With Me — Atlas Beaumont" },
      { name: "description", content: "A small number of advisory and writing engagements each year. Begin the conversation." },
      { property: "og:title", content: "Work With Me — Atlas Beaumont" },
      { property: "og:url", content: "/work" },
    ],
    links: [{ rel: "canonical", href: "/work" }],
  }),
  component: Work,
});

const budgets = ["Under £10k", "£10k — £25k", "£25k — £50k", "£50k +"];

function Work() {
  const [sent, setSent] = useState(false);
  function submit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <section className="min-h-screen border-b border-hairline">
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-6 px-6 py-32 md:px-12 md:py-40">
        <div className="col-span-12 md:col-span-5">
          <Reveal>
            <p className="eyebrow">Engagements</p>
            <h1 className="mt-10 font-display text-6xl leading-[1.02] tracking-tight md:text-7xl">
              A small number<br />
              of <span className="italic text-accent">considered</span><br />
              engagements.
            </h1>
            <p className="mt-12 max-w-md font-serif text-lg leading-relaxed text-muted-foreground">
              Editorial, advisory, and writing collaborations — accepted in
              limited quantity each year. Most begin with a single, unhurried
              conversation.
            </p>
            <div className="mt-16 space-y-6 text-sm text-muted-foreground">
              {[
                ["I.", "Brand and editorial direction"],
                ["II.", "Long-form ghostwriting"],
                ["III.", "Advisory for quiet companies"],
              ].map(([n, t]) => (
                <div key={n} className="flex gap-6 border-t border-hairline pt-4">
                  <span className="font-display text-accent">{n}</span>
                  <span className="text-foreground">{t}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="col-span-12 md:col-span-6 md:col-start-7">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="flex min-h-[60vh] flex-col items-start justify-center border border-accent/40 p-12"
              >
                <span className="h-px w-12 bg-accent" />
                <p className="mt-8 font-display text-5xl leading-tight tracking-tight md:text-6xl">
                  Thank you.
                </p>
                <p className="mt-6 max-w-md font-serif text-lg leading-relaxed text-muted-foreground">
                  Your note has arrived. I read each enquiry personally and
                  reply within seven days, often sooner.
                </p>
                <p className="mt-12 text-[11px] uppercase tracking-[0.22em] text-accent">— A.B.</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={submit}
                className="space-y-10"
              >
                <Field label="Name" id="name" />
                <Field label="Email" id="email" type="email" />
                <Field label="Company / Studio" id="company" required={false} />

                <div>
                  <label className="eyebrow">Budget</label>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {budgets.map((b) => (
                      <label key={b} className="cursor-pointer">
                        <input type="radio" name="budget" value={b} className="peer sr-only" />
                        <span className="block border border-hairline px-5 py-3 text-[12px] tracking-wide text-muted-foreground transition-colors peer-checked:border-accent peer-checked:text-accent hover:text-foreground">
                          {b}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="eyebrow">Message</label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    className="mt-4 w-full resize-none border-b border-hairline bg-transparent py-4 font-serif text-lg leading-relaxed text-foreground placeholder:text-muted-foreground/40 focus:border-accent focus:outline-none"
                    placeholder="Tell me about the work."
                  />
                </div>

                <button
                  type="submit"
                  className="border border-accent px-10 py-5 text-[11px] uppercase tracking-[0.24em] text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  Send enquiry
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Field({
  label, id, type = "text", required = true,
}: { label: string; id: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow">
        {label}{!required && " (optional)"}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        className="mt-3 w-full border-b border-hairline bg-transparent py-4 font-serif text-lg text-foreground focus:border-accent focus:outline-none"
      />
    </div>
  );
}
