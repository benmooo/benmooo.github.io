import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <p className="mb-4 text-sm uppercase tracking-[0.32em] text-[var(--muted)]">
        About
      </p>
      <h1 className="max-w-2xl font-serif text-4xl leading-tight text-[var(--ink)]">
        I write to clarify technical systems and to keep a record of what daily
        life still feels like before it blurs.
      </h1>

      <div className="mt-12 grid gap-12 md:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6 text-lg leading-8 text-[var(--muted)]">
          <p>
            The site lives somewhere between technical notebook and personal
            field log. Some posts are precise and structural. Some are essays
            that need slower pacing, texture, and images that feel kept rather
            than uploaded.
          </p>
          <p>
            Recurring themes: functional programming, frontend architecture,
            rendering, games, and the small observations that keep ordinary days
            from flattening out.
          </p>
        </div>

        <div className="rounded-[2rem] border border-black/8 bg-white px-6 py-7 shadow-[16px_16px_0_rgba(31,20,15,0.08)]">
          <p className="text-sm uppercase tracking-[0.32em] text-[var(--muted)]">
            Interests
          </p>
          <ul className="mt-6 space-y-3 font-serif text-2xl text-[var(--ink)]">
            <li>Functional systems</li>
            <li>Rendering and UI</li>
            <li>Games and worlds</li>
            <li>Fragments of daily life</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
