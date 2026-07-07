import { notFound } from "@tanstack/react-router";

import { getPostBySlug, listPostSummariesByYear } from "~/lib/posts";

export const loadArchiveGroups = async () => listPostSummariesByYear();

export const loadPost = async (slug: string) => {
  const post = getPostBySlug(slug);

  if (!post) {
    throw notFound();
  }

  return post;
};
