import type {
  OperatingSystem,
  ShortcutApplication,
  ShortcutDifficulty,
} from "./shortcut";

export type ApplicationFilter = "all" | ShortcutApplication;

export type DifficultyFilter = "all" | ShortcutDifficulty;

export type OperatingSystemFilter = "all" | OperatingSystem;

export interface DiscoveryPreferences {
  application: ApplicationFilter;
  difficulty: DifficultyFilter;
  operatingSystem: OperatingSystemFilter;
}
