import { Keycap } from "./components/Keycap";

const actionButtonClasses =
  "min-h-11 border border-border bg-transparent px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-border-strong hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
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
            <span className="size-1.5 rounded-full bg-success" />
            <span>discovery mode</span>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <section
          className="flex w-full flex-col justify-center"
          aria-labelledby="shortcut-title"
        >
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-text-muted">
              shortcut 0001
            </p>

            <p className="text-xs uppercase tracking-[0.18em] text-text-muted">
              001 / 001
            </p>
          </div>

          <article className="border border-border bg-surface">
            <div className="border-b border-border px-5 py-4 sm:px-7">
              <p className="text-xs font-medium uppercase leading-6 tracking-[0.16em] text-text-secondary">
                VS Code
                <span className="mx-2 text-text-muted" aria-hidden="true">
                  /
                </span>
                Editing
                <span className="mx-2 text-text-muted" aria-hidden="true">
                  /
                </span>
                Windows
              </p>
            </div>

            <div className="px-5 py-8 sm:px-7 sm:py-10 lg:px-10 lg:py-12">
              <div
                className="flex flex-wrap items-center gap-2 sm:gap-3"
                aria-label="Keyboard shortcut Control plus D"
              >
                <Keycap>CTRL</Keycap>

                <span
                  className="text-sm font-medium text-text-muted"
                  aria-hidden="true"
                >
                  +
                </span>

                <Keycap>D</Keycap>
              </div>

              <div className="mt-8 max-w-3xl">
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-accent">
                  select next occurrence
                </p>

                <h1
                  id="shortcut-title"
                  className="text-2xl font-semibold leading-tight tracking-tight text-text-primary sm:text-3xl lg:text-4xl"
                >
                  Select the next occurrence of the current selection
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-text-secondary sm:text-base">
                  Add the next matching instance of your selected text to the
                  active selection. Repeat the shortcut to edit matching values
                  together.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 border-t border-border sm:flex sm:flex-wrap">
              <button
                type="button"
                className={`${actionButtonClasses} border-l-0 border-t-0 sm:border-b-0`}
              >
                know it
              </button>

              <button
                type="button"
                className={`${actionButtonClasses} border-r-0 border-t-0 sm:border-b-0 sm:border-r`}
              >
                save
              </button>

              <button
                type="button"
                className={`${actionButtonClasses} border-b-0 border-l-0 sm:border-r`}
              >
                practice
              </button>

              <button
                type="button"
                className="min-h-11 border-0 bg-accent px-4 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-accent-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:ml-auto sm:min-w-32"
              >
                next
                <span className="ml-2" aria-hidden="true">
                  →
                </span>
              </button>
            </div>
          </article>

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
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 text-xs text-text-muted sm:px-6 lg:px-8">
          <p>discover → practice → remember</p>
          <p className="hidden sm:block">local session</p>
        </div>
      </footer>
    </div>
  );
}
