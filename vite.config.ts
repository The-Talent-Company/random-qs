import path from "path";
import devServer, { defaultOptions } from "@hono/vite-dev-server";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "build",
  },
  server: {
    port: 5173,
    hmr: {
      protocol: "ws",
      host: "localhost",
    },
  },
  plugins: [
    react(),
    devServer({
      entry: "server.js",
      injectClientScript: false,
      exclude: [/^\/(src)\/.+/, ...defaultOptions.exclude],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
