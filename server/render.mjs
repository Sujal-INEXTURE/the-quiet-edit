import server from "../dist/server/server.js";
import { serve } from "srvx/node";
import { serveStatic } from "srvx/static";

const port = process.env.PORT ?? 3000;
const hostname = process.env.HOST ?? "0.0.0.0";

serve({
  port,
  hostname,
  middleware: [serveStatic({ dir: "dist/client" })],
  fetch: (request) => server.fetch(request),
});
