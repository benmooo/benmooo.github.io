import { allPosts } from "content-collections";

export type Post = (typeof allPosts)[number];

export type PostsByYear = {
  year: number;
  posts: Post[];
};

const compareByDateDesc = (left: Post, right: Post) =>
  right.date.localeCompare(left.date);

export const listPosts = () => [...allPosts].sort(compareByDateDesc);

export const listPublishedPosts = () =>
  listPosts().filter((post) => !post.draft);

export const getPostBySlug = (slug: string) =>
  listPublishedPosts().find((post) => post.slug === slug);

export const listPostsByYear = (): PostsByYear[] => {
  const groups = listPublishedPosts().reduce<Map<number, Post[]>>(
    (accumulator, post) => {
      const group = accumulator.get(post.year) ?? [];

      return new Map(accumulator).set(post.year, [...group, post]);
    },
    new Map(),
  );

  return [...groups.entries()]
    .sort(([left], [right]) => right - left)
    .map(([year, posts]) => ({
      year,
      posts,
    }));
};
