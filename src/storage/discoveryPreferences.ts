import type {
  ApplicationFilter,
  DifficultyFilter,
  DiscoveryPreferences,
  OperatingSystemFilter,
} from "../types/preferences";

const STORAGE_KEY = "shortcut.discovery-preferences";

export const defaultDiscoveryPreferences: DiscoveryPreferences = {
  application: "all",
  difficulty: "all",
  operatingSystem: "windows",
};

const validApplications: ApplicationFilter[] = [
  "all",
  "windows",
  "google-chrome",
  "visual-studio-code",
  "microsoft-excel",
];

const validDifficulties: DifficultyFilter[] = [
  "all",
  "beginner",
  "intermediate",
  "advanced",
];

const validOperatingSystems: OperatingSystemFilter[] = [
  "all",
  "windows",
  "macos",
  "linux",
  "universal",
];

function isApplicationFilter(value: unknown): value is ApplicationFilter {
  return (
    typeof value === "string" &&
    validApplications.includes(value as ApplicationFilter)
  );
}

function isDifficultyFilter(value: unknown): value is DifficultyFilter {
  return (
    typeof value === "string" &&
    validDifficulties.includes(value as DifficultyFilter)
  );
}

function isOperatingSystemFilter(
  value: unknown,
): value is OperatingSystemFilter {
  return (
    typeof value === "string" &&
    validOperatingSystems.includes(value as OperatingSystemFilter)
  );
}

function isDiscoveryPreferences(value: unknown): value is DiscoveryPreferences {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const preferences = value as Record<string, unknown>;

  return (
    isApplicationFilter(preferences.application) &&
    isDifficultyFilter(preferences.difficulty) &&
    isOperatingSystemFilter(preferences.operatingSystem)
  );
}

export function loadDiscoveryPreferences(): DiscoveryPreferences {
  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);

    if (!storedValue) {
      return defaultDiscoveryPreferences;
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    if (!isDiscoveryPreferences(parsedValue)) {
      return defaultDiscoveryPreferences;
    }

    return parsedValue;
  } catch {
    return defaultDiscoveryPreferences;
  }
}

export function saveDiscoveryPreferences(preferences: DiscoveryPreferences) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    // The interface should remain usable when storage is unavailable
  }
}
