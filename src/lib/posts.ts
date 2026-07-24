import { getCollection, type CollectionEntry } from "astro:content";
import type { Lang } from "../i18n/ui";

export type Post = CollectionEntry<"blog">;

// Posts live under blog/en/ and blog/es/, so the collection id carries the
// language prefix (e.g. "en/state-of-local-models").
export function langOf(post: Post): Lang {
  return post.id.startsWith("es/") ? "es" : "en";
}

// The routing slug and asset path, without the language prefix.
export function slugOf(post: Post): string {
  return post.id.replace(/^(en|es)\//, "");
}

// Published posts for one language, newest first. Drafts are hidden in
// production builds and shown during `astro dev` so you can preview them.
export async function getPosts(lang: Lang = "en"): Promise<Post[]> {
  const posts = await getCollection("blog", ({ id, data }) => {
    if ((id.startsWith("es/") ? "es" : "en") !== lang) return false;
    return import.meta.env.PROD ? data.draft !== true : true;
  });
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function readingTime(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function tagSlug(tag: string): string {
  return tag
    .normalize("NFD") // strip accents so "Ingeniería" slugs to "ingenieria"
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function allTags(posts: Post[]): string[] {
  return [...new Set(posts.flatMap((p) => p.data.tags ?? []))].sort();
}
