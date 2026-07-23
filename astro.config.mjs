// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

/** @type {import('astro').AstroUserConfig} */
export default defineConfig({
  site: process.env.PUBLIC_SITE,
  base: process.env.PUBLIC_BASE ?? "/",
  vite: {
    plugins: [tailwindcss()],
  },
});