import matter from "gray-matter";
import fs from "fs";
import path from "path";
import Link from "next/link";
import { BlogPost } from "@/types/blog";

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
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors mb-8"
          >
            ← 返回
          </Link>
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
          <div className="space-y-12">
            <div className="space-y-8">
              {posts.map((post) => (
                <article key={post.slug} className="group">
                  <div className="flex items-center gap-2 mb-2">
                    <time className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(post.frontmatter.date)
                        .toLocaleDateString("zh-CN", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })
                        .replace(/\//g, ".")}
                    </time>
                    {post.frontmatter.tags &&
                      post.frontmatter.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                          {tag}
                        </span>
                      ))}
                  </div>
                  <h3 className="text-lg font-light text-gray-800 dark:text-gray-200 mb-2 group-hover:text-pink-600 dark:group-hover:text-pink-400 group-hover:underline transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.frontmatter.title}
                    </Link>
                  </h3>
                  {post.frontmatter.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {post.frontmatter.description}
                    </p>
                  )}
                </article>
              ))}
            </div>
            {/* Archive Link */}
            <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
              {/* <Link
                href="/archive"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                查看所有文章 →
              </Link> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const metadata = {
  title: "Blog | 格物致知",
  description: "分享技术见解和学习心得",
};
