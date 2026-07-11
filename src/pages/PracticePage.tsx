import { Link } from "react-router";

import { shortcuts } from "../data/shortcuts";
import {
  getShortcutUserState,
  loadShortcutUserState,
} from "../storage/shortcutUserState";

export function PracticePage() {
  const stateMap = loadShortcutUserState();

  const learningShortcuts = shortcuts.filter((shortcut) => {
    const state = getShortcutUserState(stateMap, shortcut.id);

    return state.learningStatus === "learning" && !state.hidden;
  });

  const savedShortcuts = shortcuts.filter((shortcut) => {
    const state = getShortcutUserState(stateMap, shortcut.id);

    return state.saved && !state.hidden;
  });

  return (
    <section className="w-full">
      <header className="mb-8 border-b border-border pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          training mode
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          practice
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-text-secondary">
          Build a focused review session from shortcuts you are currently
          learning or have saved for later practice.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="border border-border bg-surface p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-warning">
            learning queue
          </p>

          <p className="mt-4 text-4xl font-semibold text-text-primary">
            {learningShortcuts.length}
          </p>

          <p className="mt-3 text-sm leading-7 text-text-secondary">
            Shortcuts currently marked as learning and available for focused
            review.
          </p>

          <button
            type="button"
            className={[
              "mt-6 min-h-11 w-full border border-border px-4 py-2.5",
              "text-sm font-semibold text-text-muted",
              "disabled:cursor-not-allowed disabled:opacity-60",
            ].join(" ")}
            disabled
          >
            practice learning queue
          </button>
        </article>

        <article className="border border-border bg-surface p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            saved queue
          </p>

          <p className="mt-4 text-4xl font-semibold text-text-primary">
            {savedShortcuts.length}
          </p>

          <p className="mt-3 text-sm leading-7 text-text-secondary">
            Visible saved shortcuts that can later be assembled into a custom
            review session.
          </p>

          <button
            type="button"
            className={[
              "mt-6 min-h-11 w-full border border-border px-4 py-2.5",
              "text-sm font-semibold text-text-muted",
              "disabled:cursor-not-allowed disabled:opacity-60",
            ].join(" ")}
            disabled
          >
            practice saved queue
          </button>
        </article>
      </div>

      <div className="mt-6 border border-border bg-surface px-5 py-8 sm:px-7">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
          coming next
        </p>

        <h2 className="mt-3 text-xl font-semibold text-text-primary">
          Recognition-based practice sessions
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-text-secondary">
          The first practice system will present an action, let you recall the
          key combination, reveal the answer, and record your confidence.
          Keyboard capture will come later.
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
          return to discovery
        </Link>
      </div>
    </section>
  );
}
