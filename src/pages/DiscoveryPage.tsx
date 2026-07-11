import { useCallback, useEffect, useMemo, useState } from "react";

import { FilterBar } from "../components/FilterBar";
import { ShortcutCard } from "../components/ShortcutCard";
import { shortcuts } from "../data/shortcuts";
import {
  defaultDiscoveryPreferences,
  loadDiscoveryPreferences,
  saveDiscoveryPreferences,
} from "../storage/discoveryPreferences";
import {
  getShortcutUserState,
  loadShortcutUserState,
  saveShortcutUserState,
} from "../storage/shortcutUserState";
import type {
  ApplicationFilter,
  DifficultyFilter,
  DiscoveryPreferences,
  OperatingSystemFilter,
} from "../types/preferences";
import type { OperatingSystem, Shortcut } from "../types/shortcut";
import type {
  LearningStatus,
  ShortcutUserState,
  ShortcutUserStateMap,
} from "../types/shortcutState";
import { getRandomItem } from "../utils/shortcutSelection";

interface InitialDiscoveryState {
  preferences: DiscoveryPreferences;
  userStateMap: ShortcutUserStateMap;
  shortcutId: string | null;
}

function getMatchingShortcuts(
  preferences: DiscoveryPreferences,
  userStateMap: ShortcutUserStateMap,
) {
  return shortcuts.filter((shortcut) => {
    const userState = getShortcutUserState(userStateMap, shortcut.id);

    if (userState.hidden) {
      return false;
    }

    const matchesApplication =
      preferences.application === "all" ||
      shortcut.application === preferences.application;

    const matchesDifficulty =
      preferences.difficulty === "all" ||
      shortcut.difficulty === preferences.difficulty;

    const matchesOperatingSystem =
      preferences.operatingSystem === "all" ||
      shortcut.operatingSystems.includes(preferences.operatingSystem) ||
      shortcut.operatingSystems.includes("universal");

    return matchesApplication && matchesDifficulty && matchesOperatingSystem;
  });
}

function createInitialDiscoveryState(): InitialDiscoveryState {
  const preferences = loadDiscoveryPreferences();

  const userStateMap = loadShortcutUserState();

  const matchingShortcuts = getMatchingShortcuts(preferences, userStateMap);

  return {
    preferences,
    userStateMap,
    shortcutId: getRandomItem(matchingShortcuts)?.id ?? null,
  };
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

function getDisplayOperatingSystem(
  shortcut: Shortcut,
  filter: OperatingSystemFilter,
): OperatingSystem {
  if (
    filter !== "all" &&
    shortcut.keys.some((keyset) => keyset.operatingSystem === filter)
  ) {
    return filter;
  }

  const universalKeySet = shortcut.keys.find(
    (keySet) => keySet.operatingSystem === "universal",
  );

  if (universalKeySet) {
    return "universal";
  }

  return shortcut.keys[0]?.operatingSystem ?? "universal";
}

export function DiscoveryPage() {
  const [initialState] = useState<InitialDiscoveryState>(
    createInitialDiscoveryState,
  );

  const [preferences, setPreferences] = useState<DiscoveryPreferences>(
    initialState.preferences,
  );

  const [userStateMap, setUserStateMap] = useState<ShortcutUserStateMap>(
    initialState.userStateMap,
  );

  const [currentShortcutId, setCurrentShortcutId] = useState<string | null>(
    initialState.shortcutId,
  );

  const [shortcutHistory, setShortcutHistory] = useState<string[]>([]);

  const filteredShortcuts = useMemo(
    () => getMatchingShortcuts(preferences, userStateMap),
    [preferences, userStateMap],
  );

  const currentShortcut =
    findShortcutById(filteredShortcuts, currentShortcutId) ??
    filteredShortcuts[0];

  const currentShortcutIndex = currentShortcut
    ? filteredShortcuts.findIndex(
        (shortcut) => shortcut.id === currentShortcut.id,
      )
    : -1;

  const currentUserState = currentShortcut
    ? getShortcutUserState(userStateMap, currentShortcut.id)
    : null;

  const displayOperatingSystem = currentShortcut
    ? getDisplayOperatingSystem(currentShortcut, preferences.operatingSystem)
    : "universal";

  const visibleShortcutCount = shortcuts.filter((shortcut) => {
    return !getShortcutUserState(userStateMap, shortcut.id).hidden;
  }).length;

  useEffect(() => {
    saveDiscoveryPreferences(preferences);
  }, [preferences]);

  useEffect(() => {
    saveShortcutUserState(userStateMap);
  }, [userStateMap]);

  const applyPreferences = useCallback(
    (nextPreferences: DiscoveryPreferences) => {
      const matchingShortcuts = getMatchingShortcuts(
        nextPreferences,
        userStateMap,
      );

      const nextShortcut = getRandomItem(matchingShortcuts);

      setPreferences(nextPreferences);
      setCurrentShortcutId(nextShortcut?.id ?? null);
      setShortcutHistory([]);
    },
    [userStateMap],
  );

  const handleApplicationChange = useCallback(
    (application: ApplicationFilter) => {
      applyPreferences({
        ...preferences,
        application,
      });
    },
    [applyPreferences, preferences],
  );

  const handleDifficultyChange = useCallback(
    (difficulty: DifficultyFilter) => {
      applyPreferences({
        ...preferences,
        difficulty,
      });
    },
    [applyPreferences, preferences],
  );

  const handleOperatingSystemChange = useCallback(
    (operatingSystem: OperatingSystemFilter) => {
      applyPreferences({
        ...preferences,
        operatingSystem,
      });
    },
    [applyPreferences, preferences],
  );

  const handleResetFilters = useCallback(() => {
    applyPreferences(defaultDiscoveryPreferences);
  }, [applyPreferences]);

  const updateCurrentShortcutState = useCallback(
    (updater: (currentState: ShortcutUserState) => ShortcutUserState) => {
      if (!currentShortcut) {
        return;
      }

      setUserStateMap((currentStateMap) => {
        const existingState = getShortcutUserState(
          currentStateMap,
          currentShortcut.id,
        );

        return {
          ...currentStateMap,
          [currentShortcut.id]: updater(existingState),
        };
      });
    },
    [currentShortcut],
  );

  const handleToggleSaved = useCallback(() => {
    updateCurrentShortcutState((currentState) => ({
      ...currentState,
      saved: !currentState.saved,
    }));
  }, [updateCurrentShortcutState]);

  const handleSetLearningStatus = useCallback(
    (status: LearningStatus) => {
      updateCurrentShortcutState((currentState) => ({
        ...currentState,
        learningStatus: status,
      }));
    },
    [updateCurrentShortcutState],
  );

  const handleHideShortcut = useCallback(() => {
    if (!currentShortcut) {
      return;
    }

    const remainingShortcuts = filteredShortcuts.filter(
      (shortcut) => shortcut.id !== currentShortcut.id,
    );

    const nextShortcut = getRandomItem(remainingShortcuts);

    setUserStateMap((currentStateMap) => ({
      ...currentStateMap,
      [currentShortcut.id]: {
        ...getShortcutUserState(currentStateMap, currentShortcut.id),
        hidden: true,
      },
    }));

    setShortcutHistory((currentHistory) =>
      currentHistory.filter((shortcutId) => shortcutId !== currentShortcut.id),
    );

    setCurrentShortcutId(nextShortcut?.id ?? null);
  }, [currentShortcut, filteredShortcuts]);

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

      const previousShortcut = findShortcutById(
        filteredShortcuts,
        previousShortcutId,
      );

      if (!previousShortcut) {
        return currentHistory.slice(0, -1);
      }

      setCurrentShortcutId(previousShortcut.id);

      return currentHistory.slice(0, -1);
    });
  }, [filteredShortcuts]);

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

      if (pressedKey === "s") {
        event.preventDefault();
        handleToggleSaved();
      }

      if (pressedKey === "k") {
        event.preventDefault();

        handleSetLearningStatus(
          currentUserState?.learningStatus === "known" ? null : "known",
        );
      }

      if (pressedKey === "l") {
        event.preventDefault();

        handleSetLearningStatus(
          currentUserState?.learningStatus === "learning" ? null : "learning",
        );
      }
    }

    window.addEventListener("keydown", handleKeyboardNavigation);

    return () => {
      window.removeEventListener("keydown", handleKeyboardNavigation);
    };
  }, [
    currentUserState,
    handleNextShortcut,
    handlePreviousShortcut,
    handleSetLearningStatus,
    handleToggleSaved,
  ]);

  return (
    <div className="flex w-full flex-col justify-center">
      <FilterBar
        application={preferences.application}
        difficulty={preferences.difficulty}
        operatingSystem={preferences.operatingSystem}
        resultCount={filteredShortcuts.length}
        totalCount={visibleShortcutCount}
        onApplicationChange={handleApplicationChange}
        onDifficultyChange={handleDifficultyChange}
        onOperatingSystemChange={handleOperatingSystemChange}
        onReset={handleResetFilters}
      />

      {currentShortcut && currentUserState ? (
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
            operatingSystem={displayOperatingSystem}
            userState={currentUserState}
            canGoPrevious={shortcutHistory.length > 0}
            canGoNext={filteredShortcuts.length > 1}
            onToggleSaved={handleToggleSaved}
            onSetLearningStatus={handleSetLearningStatus}
            onHide={handleHideShortcut}
            onPrevious={handlePreviousShortcut}
            onNext={handleNextShortcut}
          />

          <div className="mt-5 flex flex-col gap-3 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>
              <span className="text-text-secondary">keys:</span> S save · K
              known · L learning
            </p>

            <div className="hidden items-center gap-4 sm:flex">
              <p>
                <kbd className="border border-border-strong bg-surface px-1.5 py-0.5 text-text-secondary">
                  P
                </kbd>{" "}
                previous
              </p>

              <p>
                <kbd className="border border-border-strong bg-surface px-1.5 py-0.5 text-text-secondary">
                  N
                </kbd>{" "}
                next
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
            No visible shortcuts match these filters.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-text-secondary">
            Try another application, difficulty, or operating system. Hidden
            shortcuts remain excluded from discovery.
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

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-xs text-text-muted">
        <p>visible {visibleShortcutCount}</p>

        <p>history {shortcutHistory.length}</p>
      </div>
    </div>
  );
}
