import contentCollectionsPlugin from "@content-collections/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    contentCollectionsPlugin(),
    tailwindcss(),
    tanstackStart({
      srcDirectory: "src",
      pages: [
        { path: "/" },
        { path: "/about" },
        { path: "/contact" },
        { path: "/blog" },
        { path: "/studio" },
      ],
      prerender: {
        enabled: true,
        autoStaticPathsDiscovery: false,
        crawlLinks: true,
      },
    }),
    viteReact(),
    nitro(),
  ],
});
