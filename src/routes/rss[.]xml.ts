import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getEssays } from "../lib/content";

export const Route = createFileRoute("/rss.xml")({
  server: {
    handlers: {
      GET: async () => {
        const essays = await getEssays();
        const items = essays.map((e) => `
          <item>
            <title><![CDATA[${e.title}]]></title>
            <link>/essays/${e.slug}</link>
            <guid isPermaLink="false">${e.slug}</guid>
            <pubDate>${new Date(e.publishedAt).toUTCString()}</pubDate>
            <description><![CDATA[${e.excerpt}]]></description>
          </item>`).join("");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Atlas Beaumont</title>
    <link>/</link>
    <description>Essays, notes, and correspondence.</description>
    ${items}
  </channel>
</rss>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/rss+xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
