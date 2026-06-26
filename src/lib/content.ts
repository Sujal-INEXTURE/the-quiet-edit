// Content adapter. Reads from Ghost when GHOST_URL + GHOST_CONTENT_API_KEY
// are configured; otherwise serves curated sample content so the site
// renders end-to-end. Swap the adapter freely — components depend only on
// the shapes below.

export interface Essay {
  slug: string;
  title: string;
  excerpt: string;
  html: string;
  category: string;
  publishedAt: string;
  readingMinutes: number;
  featureImage?: string;
}

export interface Note {
  id: string;
  kind: "text" | "image" | "video" | "quote" | "link";
  title?: string;
  body: string;
  url?: string;
  image?: string;
  publishedAt: string;
}

const SAMPLE_ESSAYS: Essay[] = [
  {
    slug: "the-architecture-of-attention",
    title: "The Architecture of Attention",
    excerpt:
      "On building rooms in the mind — and why the most valuable software of the next decade will be the software you do not notice.",
    category: "Essays",
    publishedAt: "2026-06-04",
    readingMinutes: 9,
    html: `<p>The most expensive resource in modern life is not money. It is the quiet, undivided attention of an unhurried mind.</p>
<p>For two decades, we built tools that competed for that resource. The next decade belongs to the inverse — tools that protect it, that return it, that earn the right to be invisible.</p>
<h2>Rooms, not feeds</h2>
<p>A feed is a corridor. A room has a door. The difference is small in software and immense in the life of the person using it.</p>
<blockquote>The best interface is one you walk through without remembering you walked through it.</blockquote>
<p>This is the work: to make rooms.</p>`,
  },
  {
    slug: "on-quiet-companies",
    title: "On Quiet Companies",
    excerpt:
      "The loudest businesses of the last cycle will not survive the next. A meditation on restraint as competitive advantage.",
    category: "Essays",
    publishedAt: "2026-05-21",
    readingMinutes: 7,
    html: `<p>There is a kind of company that does not announce itself.</p>
<p>It does not have a manifesto. It does not have a podcast tour. It compounds slowly, in the dark, until one day you notice the lights are on in every window of the street.</p>`,
  },
  {
    slug: "a-defence-of-slowness",
    title: "A Defence of Slowness",
    excerpt:
      "Why the most ambitious work of our generation will be measured in decades, not quarters.",
    category: "Notes from the Field",
    publishedAt: "2026-04-18",
    readingMinutes: 12,
    html: `<p>Speed is a tax we agreed to pay without reading the contract.</p>
<p>The work that matters — the building of an institution, the writing of a book, the raising of a person — does not move at the speed of the timeline.</p>`,
  },
  {
    slug: "the-second-renaissance",
    title: "Notes Toward a Second Renaissance",
    excerpt: "Fragments on art, capital, and the recovery of taste.",
    category: "Essays",
    publishedAt: "2026-03-02",
    readingMinutes: 6,
    html: `<p>We are entering a period in which taste — long thought to be decorative — will become structural.</p>`,
  },
];

const SAMPLE_NOTES: Note[] = [
  {
    id: "n1",
    kind: "quote",
    body: "The cure for boredom is curiosity. There is no cure for curiosity.",
    publishedAt: "2026-06-18",
  },
  {
    id: "n2",
    kind: "text",
    title: "On rooms",
    body: "Spent the morning rereading Bachelard. A house is not a machine for living; it is a geometry of memory.",
    publishedAt: "2026-06-12",
  },
  {
    id: "n3",
    kind: "link",
    title: "A long read worth your Sunday",
    body: "Edward Said on late style — the artist's last freedom is the freedom to be difficult.",
    url: "https://example.com/late-style",
    publishedAt: "2026-06-05",
  },
  {
    id: "n4",
    kind: "quote",
    body: "Write the book you would steal from a bookshop.",
    publishedAt: "2026-05-28",
  },
  {
    id: "n5",
    kind: "text",
    body: "A useful test: would this sentence survive a translation into French and back?",
    publishedAt: "2026-05-20",
  },
  {
    id: "n6",
    kind: "text",
    title: "Studio note",
    body: "Three things on the desk this week — a Pelikan M800, a copy of Marcus Aurelius, and a single white orchid. The orchid is the most demanding of the three.",
    publishedAt: "2026-05-09",
  },
];

// Ghost integration — wire up when keys are provided.
async function fetchFromGhost(): Promise<{ essays: Essay[]; notes: Note[] } | null> {
  const url = (typeof process !== "undefined" && process.env?.GHOST_URL) || "";
  const key = (typeof process !== "undefined" && process.env?.GHOST_CONTENT_API_KEY) || "";
  if (!url || !key) return null;
  try {
    // Lazy import keeps the client tree-shakable on the browser.
    const GhostContentAPI = (await import("@tryghost/content-api")).default as any;
    const api = new GhostContentAPI({ url, key, version: "v5.0" });
    const posts = await api.posts.browse({ limit: 50, include: ["tags"] });
    const essays: Essay[] = posts
      .filter((p: any) => !p.tags?.some((t: any) => t.slug === "note"))
      .map((p: any) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt ?? p.custom_excerpt ?? "",
        html: p.html ?? "",
        category: p.primary_tag?.name ?? "Essays",
        publishedAt: p.published_at,
        readingMinutes: p.reading_time ?? 5,
        featureImage: p.feature_image,
      }));
    const notes: Note[] = posts
      .filter((p: any) => p.tags?.some((t: any) => t.slug === "note"))
      .map((p: any) => ({
        id: p.id,
        kind: "text" as const,
        title: p.title,
        body: p.excerpt ?? "",
        publishedAt: p.published_at,
      }));
    return { essays, notes };
  } catch {
    return null;
  }
}

export async function getEssays(): Promise<Essay[]> {
  const ghost = await fetchFromGhost();
  return ghost?.essays.length ? ghost.essays : SAMPLE_ESSAYS;
}

export async function getEssay(slug: string): Promise<Essay | undefined> {
  const essays = await getEssays();
  return essays.find((e) => e.slug === slug);
}

export async function getNotes(): Promise<Note[]> {
  const ghost = await fetchFromGhost();
  return ghost?.notes.length ? ghost.notes : SAMPLE_NOTES;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
