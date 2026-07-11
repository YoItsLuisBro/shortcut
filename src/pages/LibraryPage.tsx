import { useMemo, useState } from "react";
import { Link } from "react-router";

import { LibraryShortcutRow } from "../components/LibraryShortcutRow";
import { LibraryToolbar } from "../components/LibraryToolbar";
import { shortcuts } from "../data/shortcuts";
import {
  getShortcutUserState,
  loadShortcutUserState,
  saveShortcutUserState,
} from "../storage/shortcutUserState";
import type {
  LibraryApplicationFilter,
  LibraryDifficultyFilter,
  LibrarySortOption,
  LibraryStatusFilter,
} from "../types/library";
import type {
  LearningStatus,
  ShortcutUserStateMap,
} from "../types/shortcutState";
import { createLibraryEntries, filterLibraryEntries } from "../utils/library";

export function LibraryPage() {
  const [userStateMap, setUserStateMap] = useState<ShortcutUserStateMap>(
    loadShortcutUserState,
  );

  const [searchQuery, setSearchQuery] = useState("");

  const [statusFilter, setStatusFilter] = useState<LibraryStatusFilter>("all");

  const [applicationFilter, setApplicationFilter] =
    useState<LibraryApplicationFilter>("all");

  const [difficultyFilter, setDifficultyFilter] =
    useState<LibraryDifficultyFilter>("all");

  const [sortOption, setSortOption] =
    useState<LibrarySortOption>("application");

  const libraryEntries = useMemo(
    () => createLibraryEntries(shortcuts, userStateMap),
    [userStateMap],
  );

  const filteredEntries = useMemo(
    () =>
      filterLibraryEntries(libraryEntries, {
        searchQuery,
        status: statusFilter,
        application: applicationFilter,
        difficulty: difficultyFilter,
        sort: sortOption,
      }),
    [
      applicationFilter,
      difficultyFilter,
      libraryEntries,
      searchQuery,
      sortOption,
      statusFilter,
    ],
  );

  const savedCount = shortcuts.filter(
    (shortcut) => getShortcutUserState(userStateMap, shortcut.id).saved,
  ).length;

  const knownCount = shortcuts.filter(
    (shortcut) =>
      getShortcutUserState(userStateMap, shortcut.id).learningStatus ===
      "known",
  ).length;

  const learningCount = shortcuts.filter(
    (shortcut) =>
      getShortcutUserState(userStateMap, shortcut.id).learningStatus ===
      "learning",
  ).length;

  const hiddenCount = shortcuts.filter(
    (shortcut) => getShortcutUserState(userStateMap, shortcut.id).hidden,
  ).length;

  function updateShortcutState(
    shortcutId: string,
    updater: (
      currentState: ReturnType<typeof getShortcutUserState>,
    ) => ReturnType<typeof getShortcutUserState>,
  ) {
    setUserStateMap((currentStateMap) => {
      const updatedStateMap = {
        ...currentStateMap,
        [shortcutId]: updater(
          getShortcutUserState(currentStateMap, shortcutId),
        ),
      };

      saveShortcutUserState(updatedStateMap);

      return updatedStateMap;
    });
  }

  function handleToggleSaved(shortcutId: string) {
    updateShortcutState(shortcutId, (currentState) => ({
      ...currentState,
      saved: !currentState.saved,
    }));
  }

  function handleSetLearningStatus(
    shortcutId: string,
    learningStatus: LearningStatus,
  ) {
    updateShortcutState(shortcutId, (currentState) => ({
      ...currentState,
      learningStatus,
    }));
  }

  function handleToggleHidden(shortcutId: string) {
    updateShortcutState(shortcutId, (currentState) => ({
      ...currentState,
      hidden: !currentState.hidden,
    }));
  }

  function handleResetControls() {
    setSearchQuery("");
    setStatusFilter("all");
    setApplicationFilter("all");
    setDifficultyFilter("all");
    setSortOption("application");
  }

  return (
    <section className="w-full">
      <header className="mb-8 border-b border-border pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          personal collection
        </p>

        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
              library
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-text-secondary">
              Search, filter, classify, and restore shortcuts from your personal
              collection.
            </p>
          </div>

          <Link
            to="/"
            className={[
              "inline-flex min-h-11 items-center justify-center",
              "border border-accent px-4 py-2.5",
              "text-sm font-semibold text-accent",
              "transition-colors",
              "hover:bg-accent hover:text-background",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-accent focus-visible:ring-offset-2",
              "focus-visible:ring-offset-background",
            ].join(" ")}
          >
            discover shortcuts
          </Link>
        </div>
      </header>

      <dl className="grid grid-cols-2 border border-border bg-surface sm:grid-cols-4">
        <div className="border-b border-r border-border p-4 sm:border-b-0">
          <dt className="text-xs uppercase tracking-[0.14em] text-text-muted">
            saved
          </dt>

          <dd className="mt-2 text-2xl font-semibold text-accent">
            {savedCount}
          </dd>
        </div>

        <div className="border-b border-border p-4 sm:border-b-0 sm:border-r">
          <dt className="text-xs uppercase tracking-[0.14em] text-text-muted">
            known
          </dt>

          <dd className="mt-2 text-2xl font-semibold text-text-primary">
            {knownCount}
          </dd>
        </div>

        <div className="border-r border-border p-4">
          <dt className="text-xs uppercase tracking-[0.14em] text-text-muted">
            learning
          </dt>

          <dd className="mt-2 text-2xl font-semibold text-warning">
            {learningCount}
          </dd>
        </div>

        <div className="p-4">
          <dt className="text-xs uppercase tracking-[0.14em] text-text-muted">
            hidden
          </dt>

          <dd className="mt-2 text-2xl font-semibold text-danger">
            {hiddenCount}
          </dd>
        </div>
      </dl>

      <div className="mt-8">
        <LibraryToolbar
          searchQuery={searchQuery}
          status={statusFilter}
          application={applicationFilter}
          difficulty={difficultyFilter}
          sort={sortOption}
          resultCount={filteredEntries.length}
          onSearchQueryChange={setSearchQuery}
          onStatusChange={setStatusFilter}
          onApplicationChange={setApplicationFilter}
          onDifficultyChange={setDifficultyFilter}
          onSortChange={setSortOption}
          onReset={handleResetControls}
        />
      </div>

      <div className="mt-6">
        {filteredEntries.length > 0 ? (
          <div className="grid gap-3">
            {filteredEntries.map((entry) => (
              <LibraryShortcutRow
                key={entry.shortcut.id}
                entry={entry}
                onToggleSaved={handleToggleSaved}
                onSetLearningStatus={handleSetLearningStatus}
                onToggleHidden={handleToggleHidden}
              />
            ))}
          </div>
        ) : libraryEntries.length > 0 ? (
          <div className="border border-border bg-surface px-5 py-10 sm:px-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-warning">
              no matches
            </p>

            <h2 className="mt-3 text-2xl font-semibold text-text-primary">
              No library entries match these controls.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-text-secondary">
              Change the search term, status, application, or difficulty filter,
              or reset the controls.
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
              onClick={handleResetControls}
            >
              reset controls
            </button>
          </div>
        ) : (
          <div className="border border-border bg-surface px-5 py-10 sm:px-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
              empty library
            </p>

            <h2 className="mt-3 text-2xl font-semibold text-text-primary">
              You have not classified any shortcuts yet.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-text-secondary">
              Save a shortcut or mark it as known or learning from discovery.
              Your personal entries will appear here.
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
              start discovering
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
