// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

const repoName = process.env.PAGES_REPO;

export default defineConfig({
  site: process.env.PAGES_SITE,
  base: repoName ? `/${repoName}` : "/",
  vite: {
    plugins: [tailwindcss()],
  },
});