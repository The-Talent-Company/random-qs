import { readFile } from "node:fs/promises";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { logger } from "hono/logger";

const is_prod = process.env.NODE_ENV === "production";

let html = await readFile(is_prod ? "build/index.html" : "index.html", "utf8");

if (!is_prod) {
  // Inject Vite client code to the HTML
  html = html.replace(
    "<head>",
    `
    <script type="module">
import RefreshRuntime from "/@react-refresh"
RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type
window.__vite_plugin_react_preamble_installed__ = true
</script>
    <script type="module" src="/@vite/client"></script>
    `,
  );
}

const app = new Hono();

app.use("/assets/*", serveStatic({ root: is_prod ? "./build/" : "./" }));
app.use("*", logger());

app.post("/api/alexis", async (c) => {
  const body = await c.req.json();

  const url = new URL("https://api.alexishr.com/v1/employee");
  url.searchParams.append("select", "id,firstName,lastName");
  url.searchParams.append("filters[active][$eq]", "true");

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${body.apikey}`,
    },
  });
  if (!response.ok) {
    c.status(400);
    return c.json({
      message: "Could not fetch data from AlexisHR. Please check your API key.",
    });
  }
  const alexisdata = await response.json();
  c.status(200);
  return c.json([...alexisdata.data]);
});

app.get("/*", (c) => c.html(html));

/**
 * Start the production server
 */

if (is_prod) {
  const server = serve(
    {
      ...app,
      port: Number(process.env.PORT) || 3000,
    },
    async (info) => {
      console.log(`🚀 Server started on port ${info.port}`);
    },
  );
  process.on("SIGINT", () => {
    console.log("\nSIGINT received, shutting down");
    server.close();
  });
}

export default app;
