import { useCallback, useEffect, useState } from "react";

import { ShortcutCard } from "./components/ShortcutCard";
import { shortcuts } from "./data/shortcuts";
import { getRandomIndex } from "./utils/shortcutSelection";

function createInitialShortcutIndex() {
  if (shortcuts.length === 0) {
    return 0;
  }

  return getRandomIndex(shortcuts.length);
}

export default function App() {
  const [currentShortcutIndex, setCurrentShortcutIndex] = useState(
    createInitialShortcutIndex,
  );

  const [shortcutHistory, setShortcutHistory] = useState<number[]>([]);

  const currentShortcut = shortcuts[currentShortcutIndex];

  const handleNextShortcut = useCallback(() => {
    if (shortcuts.length <= 1) {
      return;
    }

    const nextShortcutIndex = getRandomIndex(
      shortcuts.length,
      currentShortcutIndex,
    );

    setShortcutHistory((currentHistory) => [
      ...currentHistory,
      currentShortcutIndex,
    ]);

    setCurrentShortcutIndex(nextShortcutIndex);
  }, [currentShortcutIndex]);

  const handlePreviousShortcut = useCallback(() => {
    setShortcutHistory((currentHistory) => {
      const previousShortcutIndex = currentHistory[currentHistory.length - 1];

      if (previousShortcutIndex === undefined) {
        return currentHistory;
      }

      setCurrentShortcutIndex(previousShortcutIndex);

      return currentHistory.slice(0, -1);
    });
  }, []);

  useEffect(() => {
    function handleKeyboardNavigation(event: KeyboardEvent) {
      const target = event.target;

      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      ) {
        return;
      }

      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      const pressedKey = event.key.toLowerCase();

      if (pressedKey === "n") {
        event.preventDefault();
        handleNextShortcut();
      }

      if (pressedKey === "p") {
        event.preventDefault();
        handlePreviousShortcut();
      }
    }

    window.addEventListener("keydown", handleKeyboardNavigation);

    return () => {
      window.removeEventListener("keydown", handleKeyboardNavigation);
    };
  }, [handleNextShortcut, handlePreviousShortcut]);

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
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            Showing {currentShortcut.title} for{" "}
            {currentShortcut.applicationLabel}
          </div>

          <ShortcutCard
            shortcut={currentShortcut}
            shortcutNumber={currentShortcutIndex + 1}
            totalShortcuts={shortcuts.length}
            operatingSystem="windows"
            canGoPrevious={shortcutHistory.length > 0}
            onPrevious={handlePreviousShortcut}
            onNext={handleNextShortcut}
          />

          <div className="mt-5 flex flex-col gap-3 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>
              <span className="text-text-secondary">tip:</span> build speed one
              command at a time
            </p>

            <div className="hidden items-center gap-4 md:flex">
              <p>
                press{" "}
                <kbd className="border border-border-strong bg-surface px-1.5 py-0.5 text-text-secondary">
                  P
                </kbd>{" "}
                for previous
              </p>

              <p>
                press{" "}
                <kbd className="border border-border-strong bg-surface px-1.5 py-0.5 text-text-secondary">
                  N
                </kbd>{" "}
                for next
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 text-xs text-text-muted sm:px-6 lg:px-8">
          <p>discover → practice → remember</p>

          <p className="hidden sm:block">history {shortcutHistory.length}</p>
        </div>
      </footer>
    </div>
  );
}
