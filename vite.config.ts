import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command }) => ({
  plugins: [
    // ordem importa — tanstackStart antes do react
    tanstackStart(),
    react(),
    tailwindcss(),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    // cloudflare só no build; no dev não é necessário
    ...(command === "build"
      ? [import("@cloudflare/vite-plugin").then((m) => m.cloudflare())]
      : []),
  ],
  server: {
    port: 8080,
    host: "0.0.0.0",
    strictPort: true,
  },
  resolve: {
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
}));
