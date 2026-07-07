import {
  ErrorComponent,
  Link,
  useLocation,
  useRouter,
} from "@tanstack/react-router";
import type { ErrorComponentProps } from "@tanstack/react-router";

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter();
  const isRoot = useLocation({
    select: (location) => location.pathname === "/",
  });

  console.error("DefaultCatchBoundary Error:", error);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <ErrorComponent error={error} />
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => {
            router.invalidate();
          }}
          className="rounded-full border border-black/10 bg-[var(--paper)] px-4 py-2 text-sm text-[var(--ink)] transition hover:border-black/20 hover:bg-white"
        >
          Try again
        </button>
        {isRoot ? (
          <Link
            to="/"
            className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm text-[var(--paper)] transition hover:opacity-85"
          >
            Home
          </Link>
        ) : (
          <button
            onClick={() => window.history.back()}
            className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm text-[var(--paper)] transition hover:opacity-85"
          >
            Go back
          </button>
        )}
      </div>
    </div>
  );
}
