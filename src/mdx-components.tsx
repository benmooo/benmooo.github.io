import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    wrapper: ({ children }) => <div className="prose max-w-2xl mx-auto">
      <div>{children}</div>
    </div>,
  };
}
