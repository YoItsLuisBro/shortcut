import { useCallback, useEffect, useMemo, useState } from "react";

import {
  FilterBar,
  type ApplicationFilter,
  type DifficultyFilter,
} from "./components/FilterBar";
import { ShortcutCard } from "./components/ShortcutCard";
import { shortcuts } from "./data/shortcuts";
import type { Shortcut } from "./types/shortcut";
import { getRandomItem } from "./utils/shortcutSelection";

function getInitialShortcutId() {
  return getRandomItem(shortcuts)?.id ?? null;
}

function findShortcutById(
  shortcutCollection: readonly Shortcut[],
  shortcutId: string | null,
) {
  if (!shortcutId) {
    return undefined;
  }

  return shortcutCollection.find((shortcut) => shortcut.id === shortcutId);
}

export default function App() {
  const [applicationFilter, setApplicationFilter] =
    useState<ApplicationFilter>("all");

  const [difficultyFilter, setDifficultyFilter] =
    useState<DifficultyFilter>("all");

  const [currentShortcutId, setCurrentShortcutId] = useState<string | null>(
    getInitialShortcutId,
  );

  const [shortcutHistory, setShortcutHistory] = useState<string[]>([]);

  const filteredShortcuts = useMemo(() => {
    return shortcuts.filter((shortcut) => {
      const matchesApplication =
        applicationFilter === "all" ||
        shortcut.application === applicationFilter;

      const matchesDifficulty =
        difficultyFilter === "all" || shortcut.difficulty === difficultyFilter;

      return matchesApplication && matchesDifficulty;
    });
  }, [applicationFilter, difficultyFilter]);

  const currentShortcut =
    findShortcutById(filteredShortcuts, currentShortcutId) ??
    filteredShortcuts[0];

  const currentShortcutIndex = currentShortcut
    ? filteredShortcuts.findIndex(
        (shortcut) => shortcut.id === currentShortcut.id,
      )
    : -1;

  const selectShortcutForFilters = useCallback(
    (nextApplication: ApplicationFilter, nextDifficulty: DifficultyFilter) => {
      const matchingShortcuts = shortcuts.filter((shortcut) => {
        const matchesApplication =
          nextApplication === "all" || shortcut.application === nextApplication;

        const matchesDifficulty =
          nextDifficulty === "all" || shortcut.difficulty === nextDifficulty;

        return matchesApplication && matchesDifficulty;
      });

      const nextShortcut = getRandomItem(matchingShortcuts);

      setCurrentShortcutId(nextShortcut?.id ?? null);
      setShortcutHistory([]);
    },
    [],
  );

  const handleApplicationChange = useCallback(
    (nextApplication: ApplicationFilter) => {
      setApplicationFilter(nextApplication);

      selectShortcutForFilters(nextApplication, difficultyFilter);
    },
    [difficultyFilter, selectShortcutForFilters],
  );

  const handleDifficultyChange = useCallback(
    (nextDifficulty: DifficultyFilter) => {
      setDifficultyFilter(nextDifficulty);

      selectShortcutForFilters(applicationFilter, nextDifficulty);
    },
    [applicationFilter, selectShortcutForFilters],
  );

  const handleResetFilters = useCallback(() => {
    setApplicationFilter("all");
    setDifficultyFilter("all");
    selectShortcutForFilters("all", "all");
  }, [selectShortcutForFilters]);

  const handleNextShortcut = useCallback(() => {
    if (!currentShortcut || filteredShortcuts.length <= 1) {
      return;
    }

    const nextShortcut = getRandomItem(filteredShortcuts, currentShortcut);

    if (!nextShortcut) {
      return;
    }

    setShortcutHistory((currentHistory) => [
      ...currentHistory,
      currentShortcut.id,
    ]);

    setCurrentShortcutId(nextShortcut.id);
  }, [currentShortcut, filteredShortcuts]);

  const handlePreviousShortcut = useCallback(() => {
    setShortcutHistory((currentHistory) => {
      const previousShortcutId = currentHistory[currentHistory.length - 1];

      if (!previousShortcutId) {
        return currentHistory;
      }

      setCurrentShortcutId(previousShortcutId);

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

            <span>{filteredShortcuts.length} shortcuts available</span>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="flex w-full flex-col justify-center">
          <FilterBar
            application={applicationFilter}
            difficulty={difficultyFilter}
            resultCount={filteredShortcuts.length}
            totalCount={shortcuts.length}
            onApplicationChange={handleApplicationChange}
            onDifficultyChange={handleDifficultyChange}
            onReset={handleResetFilters}
          />

          {currentShortcut ? (
            <>
              <div className="sr-only" aria-live="polite" aria-atomic="true">
                Showing {currentShortcut.title} for{" "}
                {currentShortcut.applicationLabel}. {filteredShortcuts.length}{" "}
                shortcuts match the selected filters.
              </div>

              <ShortcutCard
                shortcut={currentShortcut}
                shortcutNumber={currentShortcutIndex + 1}
                totalShortcuts={filteredShortcuts.length}
                operatingSystem="windows"
                canGoPrevious={shortcutHistory.length > 0}
                onPrevious={handlePreviousShortcut}
                onNext={handleNextShortcut}
              />

              <div className="mt-5 flex flex-col gap-3 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between">
                <p>
                  <span className="text-text-secondary">tip:</span> filters keep
                  discovery focused
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
            </>
          ) : (
            <section
              className="border border-border bg-surface px-5 py-10 sm:px-7 lg:px-10"
              aria-labelledby="empty-filter-title"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-warning">
                no matches
              </p>

              <h1
                id="empty-filter-title"
                className="mt-3 max-w-2xl text-2xl font-semibold leading-tight text-text-primary sm:text-3xl"
              >
                No shortcuts match these filters.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-text-secondary">
                Try another application or difficulty level, or reset the
                filters to return to the complete shortcut collection.
              </p>

              <button
                type="button"
                className={[
                  "mt-6 min-h-11 border border-accent px-4 py-2.5",
                  "text-sm font-semibold text-accent",
                  "transition-colors",
                  "hover:bg-accent hover:text-background",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-accent focus-visible:ring-offset-2",
                  "focus-visible:ring-offset-background",
                ].join(" ")}
                onClick={handleResetFilters}
              >
                reset filters
              </button>
            </section>
          )}
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
