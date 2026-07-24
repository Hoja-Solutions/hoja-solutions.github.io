import type { APIRoute } from "astro";
import sharp from "sharp";
import { portraitSVG } from "../../../lib/portrait";
import { getPosts, slugOf, type Post } from "../../../lib/posts";

export async function getStaticPaths() {
  const posts = await getPosts("es");
  return posts.map((post) => ({ params: { slug: slugOf(post) }, props: { post } }));
}

export const GET: APIRoute = async ({ props }) => {
  const post = props.post as Post;
  const svg = portraitSVG(post.body ?? "", 1200, 630);
  const png = await sharp(new TextEncoder().encode(svg)).png().toBuffer();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
