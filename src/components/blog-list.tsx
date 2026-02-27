"use client";

import { useState } from "react";
import Link from "next/link";
import { BlogPost } from "@/types/blog";

interface BlogListProps {
  posts: BlogPost[];
}

export function BlogList({ posts }: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Extract unique tags from all posts and sort alphabetically
  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.frontmatter.tags || []))
  ).sort();

  // Filter posts based on search query and selected tags
  const filteredPosts = posts.filter((post) => {
    // Search matching
    const searchTerm = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      post.frontmatter.title.toLowerCase().includes(searchTerm) ||
      post.frontmatter.description?.toLowerCase().includes(searchTerm) ||
      post.frontmatter.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm)
      );

    // Tag matching (AND logic)
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => post.frontmatter.tags?.includes(tag));

    return matchesSearch && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
  };

  const hasActiveFilters = searchQuery !== "" || selectedTags.length > 0;

  return (
    <div className="space-y-8">
      {/* Search Input */}
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索文章..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 transition-colors"
        />
      </div>

      {/* Tag Filters */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                selectedTags.includes(tag)
                  ? "bg-pink-600 dark:bg-pink-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Filter Status and Clear Button */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            找到 {filteredPosts.length} 篇文章
          </span>
          <button
            onClick={clearFilters}
            className="text-pink-600 dark:text-pink-400 hover:underline"
          >
            清除筛选
          </button>
        </div>
      )}

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {hasActiveFilters ? "没有找到匹配的文章" : "暂无博客文章"}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredPosts.map((post) => (
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
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded"
                    >
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
      )}
    </div>
  );
}
