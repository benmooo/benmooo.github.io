import { createFileRoute } from "@tanstack/react-router";

import { WriterStudio } from "~/features/writer/writer-studio";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "写作空间 | 格物致知" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: WriterStudio,
});
