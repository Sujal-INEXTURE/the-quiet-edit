import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function NewsletterInline() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    // TODO: wire to Ghost members API once GHOST_URL + admin key set.
    setDone(true);
  }

  return (
    <AnimatePresence mode="wait">
      {done ? (
        <motion.p
          key="done"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-accent pb-4 text-sm text-foreground"
        >
          Thank you. A confirmation has been sent to{" "}
          <span className="text-accent">{email}</span>.
        </motion.p>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={onSubmit}
          className="flex items-center border-b border-hairline focus-within:border-accent transition-colors"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@address.com"
            className="flex-1 bg-transparent py-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
          />
          <button
            type="submit"
            className="ml-4 text-[11px] uppercase tracking-[0.22em] text-accent hover:text-foreground transition-colors"
          >
            Enter →
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
