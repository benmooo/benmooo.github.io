import matter from "gray-matter";
import fs from "fs";
import path from "path";
import Link from "next/link";
import { BlogPost } from "@/types/blog";
import { ThemeToggle } from "@/components/theme-toggle";
import { BlogList } from "@/components/blog-list";

async function getBlogPosts(): Promise<BlogPost[]> {
  const postsDir = path.join(process.cwd(), "src/app/posts");

  if (!fs.existsSync(postsDir)) {
    return [];
  }

  const filenames = fs.readdirSync(postsDir);

  const posts = filenames
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => {
      const slug = filename.replace(".mdx", "");
      const filePath = path.join(postsDir, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data: frontmatter } = matter(fileContent);

      return {
        slug,
        frontmatter: frontmatter as BlogPost["frontmatter"],
      };
    })
    .filter((post) => !post.frontmatter.draft)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime(),
    );

  return posts;
}

export default async function BlogIndex() {
  const posts = await getBlogPosts();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              ← 返回
            </Link>
            <ThemeToggle />
          </div>
          <h1 className="text-4xl font-serif text-gray-800 dark:text-gray-200 mb-4">
            Write to Think
          </h1>
          <div className="w-16 h-px bg-gray-300 dark:bg-gray-600"></div>
        </header>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              暂无博客文章
            </p>
          </div>
        ) : (
          <BlogList posts={posts} />
        )}
      </div>
    </div>
  );
}

export const metadata = {
  title: "Blog | 格物致知",
  description: "分享技术见解和学习心得",
};
