import { cloudflare } from "@cloudflare/vite-plugin";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  ssr: {
    optimizeDeps: {
      exclude: ["better-auth"],
    },
  },
  server: {
    host: "::",
    port: 3000,
  },
  plugins: [
    ...(process.env.NODE_ENV !== "production" ? [devtools()] : []),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
});
