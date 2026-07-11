import type {
  LearningStatus,
  ShortcutUserState,
  ShortcutUserStateMap,
} from "../types/shortcutState";

const STORAGE_KEY = "shortcut.user-state";

export const defaultShortcutUserState: ShortcutUserState = {
  saved: false,
  learningStatus: null,
  hidden: false,
};

function isLearningStatus(value: unknown): value is LearningStatus {
  return value === null || value === "known" || value === "learning";
}

function isShortcutUserState(value: unknown): value is ShortcutUserState {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const state = value as Record<string, unknown>;

  return (
    typeof state.saved === "boolean" &&
    isLearningStatus(state.learningStatus) &&
    typeof state.hidden === "boolean"
  );
}

function isShortcutUserStateMap(value: unknown): value is ShortcutUserStateMap {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every(isShortcutUserState);
}

export function loadShortcutUserState(): ShortcutUserStateMap {
  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);

    if (!storedValue) {
      return {};
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    if (!isShortcutUserStateMap(parsedValue)) {
      return {};
    }

    return parsedValue;
  } catch {
    return {};
  }
}

export function saveShortcutUserState(stateMap: ShortcutUserStateMap) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stateMap));
  } catch {
    // The app remains usable if local storage is unavailable.
  }
}

export function getShortcutUserState(
  stateMap: ShortcutUserStateMap,
  shortcutId: string,
): ShortcutUserState {
  return stateMap[shortcutId] ?? defaultShortcutUserState;
}
