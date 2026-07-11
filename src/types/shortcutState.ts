export type LearningStatus = "known" | "learning" | null;

export interface ShortcutUserState {
  saved: boolean;
  learningStatus: LearningStatus;
  hidden: boolean;
}

export type ShortcutUserStateMap = Record<string, ShortcutUserState>;
