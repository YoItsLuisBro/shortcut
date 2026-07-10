import { ShortcutCard } from "./components/ShortcutCard";
import { shortcuts } from "./data/shortcuts";

export default function App() {
  const currentShortcut = shortcuts[0];

  if (!currentShortcut) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 text-text-primary">
        <section className="w-full max-w-xl border border-border bg-surface p-6">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-warning">
            no shortcuts found
          </p>

          <h1 className="mt-3 text-xl font-semibold">
            The shortcut collection is empty.
          </h1>

          <p className="mt-3 text-sm leading-6 text-text-secondary">
            Add at least one shortcut to the local shortcut data file.
          </p>
        </section>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-text-primary">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a
            href="/"
            className="text-base font-semibold tracking-tight text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            aria-label="shortcut dot home"
          >
            shortcut <span className="text-accent">.</span>
          </a>

          <div
            className="hidden items-center gap-2 text-xs text-text-muted sm:flex"
            aria-label="Application status"
          >
            <span
              className="size-1.5 rounded-full bg-success"
              aria-hidden="true"
            />
            <span>{shortcuts.length} shortcuts loaded</span>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="flex w-full flex-col justify-center">
          <ShortcutCard
            shortcut={currentShortcut}
            shortcutNumber={1}
            totalShortcuts={shortcuts.length}
            operatingSystem="windows"
          />

          <div className="mt-5 flex flex-col gap-2 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>
              <span className="text-text-secondary">tip:</span> build speed one
              command at a time
            </p>

            <p className="hidden md:block">
              press{" "}
              <kbd className="border border-border-strong bg-surface px-1.5 py-0.5 text-text-secondary">
                N
              </kbd>{" "}
              for next
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 text-xs text-text-muted sm:px-6 lg:px-8">
          <p>discover → practice → remember</p>
          <p className="hidden sm:block">local data</p>
        </div>
      </footer>
    </div>
  );
}
