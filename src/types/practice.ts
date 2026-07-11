export type PracticeSource = "learning" | "saved";

export type PracticeSessionSize = 5 | 10 | "all";

export type PracticeConfidence = "again" | "hard" | "got-it";

export interface PracticeAnswer {
  shortcutId: string;
  confidence: PracticeConfidence;
}

export type PracticeView = "setup" | "session" | "results";
