// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

/** @type {import('astro').AstroUserConfig} */
export default defineConfig({
  // In CI, an unset repo variable expands to "" rather than undefined, so `||`
  // (not `??`) falls back correctly and avoids Astro's "Invalid URL" on site: "".
  site: process.env.PUBLIC_SITE || undefined,
  base: process.env.PUBLIC_BASE || "/",
  vite: {
    plugins: [tailwindcss()],
  },
});