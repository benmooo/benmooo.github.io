import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { siteConfig } from "~/lib/site-config";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/blog", label: "Write to Think" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--ink)]">
      <header className="border-b border-[var(--border)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <Link
            to="/"
            className="font-serif text-lg tracking-[0.08em] text-[var(--ink)]"
          >
            {siteConfig.title}
          </Link>
          <nav className="flex items-center gap-2 text-sm text-[var(--muted)]">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{
                  className: "text-[var(--ink)]",
                }}
                activeOptions={
                  item.to === "/" ? { exact: true } : undefined
                }
                className="rounded-full px-3 py-1.5 transition hover:bg-[var(--surface-hover)] hover:text-[var(--ink)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-[var(--muted)] md:flex-row md:items-center md:justify-between">
          <p>{siteConfig.description}</p>
          <p>Write to think. Read to refine.</p>
        </div>
      </footer>
    </div>
  );
}
