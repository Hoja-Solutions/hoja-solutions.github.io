import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPosts } from "../lib/posts";

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: "Hoja — Blog",
    description:
      "Engineering write-ups from Hoja: open-source tools, model choices, and the decisions behind our projects.",
    site: context.site?.toString() ?? "https://hoja-solutions.github.io",
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
      categories: post.data.tags ?? [],
    })),
  });
}
