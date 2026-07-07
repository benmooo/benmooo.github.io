import { createServerFn } from "@tanstack/react-start";

export const fetchArchiveGroups = createServerFn({ method: "GET" }).handler(
  async () => {
    const { loadArchiveGroups } = await import("./posts.server");

    return loadArchiveGroups();
  },
);

export const fetchPost = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data }) => {
    const { loadPost } = await import("./posts.server");

    return loadPost(data);
  });
