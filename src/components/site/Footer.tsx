import { Link } from "@tanstack/react-router";
import { NewsletterInline } from "./Newsletter";

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-background">
      <div className="mx-auto max-w-[1440px] px-6 py-24 md:px-12">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="eyebrow">The Letter</p>
            <h2 className="mt-6 font-display text-4xl tracking-tight md:text-5xl">
              A correspondence,<br /> not a newsletter.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              One considered dispatch each month. No tracking, no sponsors, no
              promotional cadence. Unsubscribe with a single click.
            </p>
            <div className="mt-10 max-w-md">
              <NewsletterInline />
            </div>
          </div>

          <div className="md:col-span-3 md:col-start-9">
            <p className="eyebrow">Sections</p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                ["/essays", "Essays"],
                ["/notes", "Notes"],
                ["/about", "About"],
                ["/work", "Work With Me"],
                ["/subscribe", "Subscribe"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link to={href} className="link-underline text-foreground/80 hover:text-foreground">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow">Elsewhere</p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                ["X", "https://x.com"],
                ["Substack", "https://substack.com"],
                ["LinkedIn", "https://linkedin.com"],
                ["RSS", "/rss.xml"],
              ].map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    className="link-underline text-foreground/80 hover:text-foreground"
                    rel="noreferrer"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="hairline mt-24" />
        <div className="mt-8 flex flex-col items-start justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Atlas Beaumont. All rights reserved.</p>
          <p>London — New York — Kyoto</p>
        </div>
      </div>
    </footer>
  );
}
