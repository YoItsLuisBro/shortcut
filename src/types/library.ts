import type { ShortcutApplication, ShortcutDifficulty } from "./shortcut";

export type LibraryStatusFilter =
  | "all"
  | "saved"
  | "known"
  | "learning"
  | "hidden";

export type LibraryApplicationFilter = "all" | ShortcutApplication;

export type LibraryDifficultyFilter = "all" | ShortcutDifficulty;

export type LibrarySortOption =
  | "application"
  | "title"
  | "difficulty"
  | "status";
