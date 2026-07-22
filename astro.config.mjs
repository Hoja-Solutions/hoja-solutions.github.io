// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

/** @type {import('astro').AstroUserConfig} */
export default defineConfig({
  site: import.meta.env.PUBLIC_SITE,
  base: import.meta.env.PUBLIC_BASE ?? "/",
  vite: {
    plugins: [tailwindcss()],
  },
});