import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getEssays } from "../lib/content";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const essays = await getEssays();
        const entries = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/essays", changefreq: "weekly", priority: "0.9" },
          { path: "/notes", changefreq: "weekly", priority: "0.8" },
          { path: "/about", changefreq: "monthly", priority: "0.6" },
          { path: "/work", changefreq: "monthly", priority: "0.6" },
          { path: "/subscribe", changefreq: "monthly", priority: "0.7" },
          ...essays.map((e) => ({
            path: `/essays/${e.slug}`,
            lastmod: e.publishedAt,
            changefreq: "monthly",
            priority: "0.7",
          })),
        ];
        const urls = entries.map((e: any) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ].filter(Boolean).join("\n"),
        );
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
