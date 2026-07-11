import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <section
      className="flex w-full items-center justify-center"
      aria-labelledby="not-found-title"
    >
      <div className="w-full max-w-2xl border border-border bg-surface px-5 py-10 sm:px-8 sm:py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-danger">
          error 404
        </p>

        <h1
          id="not-found-title"
          className="mt-3 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl"
        >
          Command not found.
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-7 text-text-secondary">
          The requested route does not exist in shortcut . Return to discovery
          and continue exploring the current shortcut collection.
        </p>

        <Link
          to="/"
          className={[
            "mt-6 inline-flex min-h-11 items-center",
            "border border-accent px-4 py-2.5",
            "text-sm font-semibold text-accent",
            "transition-colors",
            "hover:bg-accent hover:text-background",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-accent focus-visible:ring-offset-2",
            "focus-visible:ring-offset-background",
          ].join(" ")}
        >
          return home
        </Link>
      </div>
    </section>
  );
}
