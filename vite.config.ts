import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      server: { entry: "server" },
      pages: [
        { path: "/" },
        { path: "/essays" },
        { path: "/essays/the-architecture-of-attention" },
        { path: "/essays/on-quiet-companies" },
        { path: "/essays/a-defence-of-slowness" },
        { path: "/essays/the-second-renaissance" },
        { path: "/essays/the-ritual-of-editing" },
        { path: "/essays/against-permanent-urgency" },
        { path: "/notes" },
        { path: "/notes/curiosity-and-boredom" },
        { path: "/notes/on-rooms" },
        { path: "/notes/late-style" },
        { path: "/notes/bookshop-test" },
        { path: "/notes/translation-test" },
        { path: "/notes/studio-note" },
        { path: "/notes/margin-test" },
        { path: "/notes/sentence-pulse" },
        { path: "/notes/archive-afternoon" },
        { path: "/notes/before-sending" },
        { path: "/about" },
        { path: "/work" },
        { path: "/subscribe" },
        { path: "/rss.xml" },
        { path: "/sitemap.xml" },
      ],
      prerender: {
        enabled: true,
        crawlLinks: true,
        concurrency: 8,
        failOnError: true,
      },
    }),
    viteReact(),
  ],
});
