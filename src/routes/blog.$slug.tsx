import { createFileRoute } from "@tanstack/react-router";

import { PostArticle } from "~/components/post-article";
import { fetchPost } from "~/lib/posts-api";
import { seo } from "~/lib/seo";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => fetchPost({ data: params.slug }),
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {};
    }

    return {
      meta: seo({
        title: `${loaderData.title} | 格物致知`,
        description: loaderData.description ?? loaderData.excerpt,
        image: loaderData.image,
        keywords: loaderData.keywords.join(", "),
      }),
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const post = Route.useLoaderData();

  return <PostArticle post={post} />;
}
