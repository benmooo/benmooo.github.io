import { allPosts } from "content-collections";

export type Post = (typeof allPosts)[number];

export type PostSummary = Pick<
  Post,
  "slug" | "title" | "date" | "tags" | "year" | "isEssay"
>;

export type PostsByYear = {
  year: number;
  posts: PostSummary[];
};

const compareByDateDesc = (left: Post, right: Post) =>
  right.date.localeCompare(left.date);

export const listPosts = () => [...allPosts].sort(compareByDateDesc);

export const listPublishedPosts = () =>
  listPosts().filter((post) => !post.draft);

export const getPostBySlug = (slug: string) =>
  listPublishedPosts().find((post) => post.slug === slug);

const toPostSummary = (post: Post): PostSummary => ({
  slug: post.slug,
  title: post.title,
  date: post.date,
  tags: post.tags,
  year: post.year,
  isEssay: post.isEssay,
});

export const listPublishedPostSummaries = () =>
  listPublishedPosts().map(toPostSummary);

export const listPostsByYear = (): PostsByYear[] => {
  const groups = listPublishedPostSummaries().reduce<Map<number, PostSummary[]>>(
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

export const listPostSummariesByYear = listPostsByYear;
