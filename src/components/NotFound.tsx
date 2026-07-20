import { Link } from "@tanstack/react-router";

export function NotFound({ children }: { children?: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <p className="text-sm uppercase tracking-[0.32em] text-[var(--muted)]">
        Not Found
      </p>
      <div className="text-balance font-serif text-3xl leading-tight text-[var(--ink)]">
        {children || "The page you are looking for does not exist."}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => window.history.back()}
          className="rounded-full border border-[var(--border)] bg-[var(--paper)] px-4 py-2 text-sm text-[var(--ink)] transition hover:border-[var(--border-strong)]"
        >
          Go back
        </button>
        <Link
          to="/"
          className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm text-[var(--paper)] transition hover:opacity-85"
        >
          Start over
        </Link>
      </div>
    </div>
  );
}
