import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';

interface BlogPost {
  slug: string;
  frontmatter: {
    title: string;
    date: string;
    description?: string;
    category?: string;
  };
}

async function getBlogPosts(): Promise<BlogPost[]> {
  const postsDir = path.join(process.cwd(), 'src/app/posts');
  
  if (!fs.existsSync(postsDir)) {
    return [];
  }
  
  const filenames = fs.readdirSync(postsDir);
  
  const posts = filenames
    .filter(filename => filename.endsWith('.mdx'))
    .map((filename) => {
      const slug = filename.replace('.mdx', '');
      const filePath = path.join(postsDir, filename);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data: frontmatter } = matter(fileContent);
      
      return {
        slug,
        frontmatter: frontmatter as BlogPost['frontmatter'],
      };
    })
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
  
  return posts;
}

export default async function BlogIndex() {
  const posts = await getBlogPosts();
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">博客文章</h1>
        <p className="text-lg text-gray-600">
          分享技术见解和学习心得
        </p>
      </header>
      
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">暂无博客文章</p>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="border-b border-gray-200 pb-8 last:border-b-0">
              <Link href={`/blog/${post.slug}`} className="group">
                <h2 className="text-2xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                  {post.frontmatter.title}
                </h2>
              </Link>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <time dateTime={post.frontmatter.date}>
                  {new Date(post.frontmatter.date).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                {post.frontmatter.category && (
                  <span className="bg-gray-100 px-2 py-1 rounded-md text-xs">
                    {post.frontmatter.category}
                  </span>
                )}
              </div>
              
              {post.frontmatter.description && (
                <p className="text-gray-700 mb-4">
                  {post.frontmatter.description}
                </p>
              )}
              
              <Link 
                href={`/blog/${post.slug}`}
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                阅读更多
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export const metadata = {
  title: '博客 - 技术分享与学习心得',
  description: '分享前端开发、React、Next.js 等技术见解和学习心得',
};