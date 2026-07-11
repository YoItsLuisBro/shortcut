import type {
  LibraryApplicationFilter,
  LibraryDifficultyFilter,
  LibrarySortOption,
  LibraryStatusFilter,
} from "../types/library";
import type { Shortcut } from "../types/shortcut";
import type {
  ShortcutUserState,
  ShortcutUserStateMap,
} from "../types/shortcutState";
import { getShortcutUserState } from "../storage/shortcutUserState";

export interface LibraryEntry {
  shortcut: Shortcut;
  userState: ShortcutUserState;
}

interface FilterLibraryEntriesOptions {
  searchQuery: string;
  status: LibraryStatusFilter;
  application: LibraryApplicationFilter;
  difficulty: LibraryDifficultyFilter;
  sort: LibrarySortOption;
}

function hasPersonalState(userState: ShortcutUserState) {
  return (
    userState.saved || userState.learningStatus !== null || userState.hidden
  );
}

function matchesStatus(
  userState: ShortcutUserState,
  status: LibraryStatusFilter,
) {
  if (status === "all") {
    return true;
  }

  if (status === "saved") {
    return userState.saved;
  }

  if (status === "known") {
    return userState.learningStatus === "known";
  }

  if (status === "learning") {
    return userState.learningStatus === "learning";
  }

  return userState.hidden;
}

function getStatusSortValue(userState: ShortcutUserState) {
  if (userState.learningStatus === "learning") {
    return 0;
  }

  if (userState.learningStatus === "known") {
    return 1;
  }

  if (userState.saved) {
    return 2;
  }

  if (userState.hidden) {
    return 3;
  }

  return 4;
}

function matchesSearch(shortcut: Shortcut, searchQuery: string) {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  const searchableText = [
    shortcut.title,
    shortcut.description,
    shortcut.application,
    shortcut.applicationLabel,
    shortcut.category,
    shortcut.difficulty,
    shortcut.usefulness,
    ...shortcut.tags,
    ...shortcut.keys.flatMap((keySet) => keySet.keys),
  ]
    .join(" ")
    .toLowerCase();

  return searchableText.includes(normalizedQuery);
}

function sortEntries(entries: LibraryEntry[], sort: LibrarySortOption) {
  return [...entries].sort((firstEntry, secondEntry) => {
    const firstShortcut = firstEntry.shortcut;

    const secondShortcut = secondEntry.shortcut;

    if (sort === "title") {
      return firstShortcut.title.localeCompare(secondShortcut.title);
    }

    if (sort === "difficulty") {
      const difficultyOrder = {
        beginner: 0,
        intermediate: 1,
        advanced: 2,
      };

      return (
        difficultyOrder[firstShortcut.difficulty] -
        difficultyOrder[secondShortcut.difficulty]
      );
    }

    if (sort === "status") {
      return (
        getStatusSortValue(firstEntry.userState) -
        getStatusSortValue(secondEntry.userState)
      );
    }

    return firstShortcut.applicationLabel.localeCompare(
      secondShortcut.applicationLabel,
    );
  });
}

export function createLibraryEntries(
  shortcuts: readonly Shortcut[],
  stateMap: ShortcutUserStateMap,
) {
  return shortcuts
    .map((shortcut) => ({
      shortcut,
      userState: getShortcutUserState(stateMap, shortcut.id),
    }))
    .filter(({ userState }) => hasPersonalState(userState));
}

export function filterLibraryEntries(
  entries: readonly LibraryEntry[],
  options: FilterLibraryEntriesOptions,
) {
  const filteredEntries = entries.filter(({ shortcut, userState }) => {
    const matchesApplication =
      options.application === "all" ||
      shortcut.application === options.application;

    const matchesDifficulty =
      options.difficulty === "all" ||
      shortcut.difficulty === options.difficulty;

    return (
      matchesApplication &&
      matchesDifficulty &&
      matchesStatus(userState, options.status) &&
      matchesSearch(shortcut, options.searchQuery)
    );
  });

  return sortEntries(filteredEntries, options.sort);
}
