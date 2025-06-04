export interface Frontmatter {
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  image?: string;
  keywords?: string[]; // for SEO
  draft?: boolean;
}

export interface BlogPost {
  slug: string;
  frontmatter: Frontmatter;
}
