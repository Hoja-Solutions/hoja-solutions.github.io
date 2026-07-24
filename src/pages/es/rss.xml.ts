import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPosts, slugOf } from "../../lib/posts";
import { getUi } from "../../i18n/ui";

export async function GET(context: APIContext) {
  const t = getUi("es");
  const posts = await getPosts("es");
  return rss({
    title: t.blog.rssTitle,
    description: t.blog.rssDescription,
    site: context.site?.toString() ?? "https://hoja-solutions.github.io",
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/es/blog/${slugOf(post)}/`,
      categories: post.data.tags ?? [],
    })),
  });
}
