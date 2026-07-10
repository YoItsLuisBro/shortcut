export type OperatingSystem = "windows" | "macos" | "linux" | "universal";

export type ShortcutDifficulty = "beginner" | "intermediate" | "advanced";

export type ShortcutUsefulness = "low" | "medium" | "high" | "essential";

export type ShortcutApplication =
  | "windows"
  | "google-chrome"
  | "visual-studio-code"
  | "microsoft-excel";

export interface ShortcutKeySet {
  operatingSystem: OperatingSystem;
  keys: string[];
}

export interface Shortcut {
  id: string;
  keys: ShortcutKeySet[];
  title: string;
  description: string;
  application: ShortcutApplication;
  applicationLabel: string;
  category: string;
  operatingSystems: OperatingSystem[];
  difficulty: ShortcutDifficulty;
  usefulness: ShortcutUsefulness;
  tags: string[];
  example?: string;
  relatedShortcutIds?: string[];
}
