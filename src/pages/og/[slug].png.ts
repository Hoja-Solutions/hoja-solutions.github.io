import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import sharp from "sharp";
import { portraitSVG } from "../../lib/portrait";

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({ params: { slug: post.id } }));
}

export const GET: APIRoute = async ({ params }) => {
  const posts = await getCollection("blog");
  const post = posts.find((p) => p.id === params.slug);
  if (!post) {
    return new Response("Not found", { status: 404 });
  }

  const svg = portraitSVG(post.body ?? "", 1200, 630);
  const png = await sharp(new TextEncoder().encode(svg)).png().toBuffer();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
