import { getShortcutUserState } from "../storage/shortcutUserState";
import type {
  PracticeAnswer,
  PracticeConfidence,
  PracticeSessionSize,
  PracticeSource,
} from "../types/practice";
import type { Shortcut, ShortcutKeySet } from "../types/shortcut";
import type { ShortcutUserStateMap } from "../types/shortcutState";

export interface PracticeResultSummary {
  total: number;
  again: number;
  hard: number;
  gotIt: number;
  confidentPercentage: number;
}

function shuffleItems<T>(items: readonly T[]): T[] {
  const shuffledItems = [...items];

  for (
    let currentIndex = shuffledItems.length - 1;
    currentIndex > 0;
    currentIndex -= 1
  ) {
    const randomIndex = Math.floor(Math.random() * (currentIndex + 1));

    const currentItem = shuffledItems[currentIndex];

    const randomItem = shuffledItems[randomIndex];

    if (currentItem === undefined || randomItem === undefined) {
      continue;
    }

    shuffledItems[currentIndex] = randomItem;

    shuffledItems[randomIndex] = currentItem;
  }

  return shuffledItems;
}

function matchesPracticeSource(
  shortcut: Shortcut,
  stateMap: ShortcutUserStateMap,
  source: PracticeSource,
) {
  const userState = getShortcutUserState(stateMap, shortcut.id);

  if (userState.hidden) {
    return false;
  }

  if (source === "learning") {
    return userState.learningStatus === "learning";
  }

  return userState.saved;
}

export function getPracticeCandidates(
  shortcuts: readonly Shortcut[],
  stateMap: ShortcutUserStateMap,
  source: PracticeSource,
) {
  return shortcuts.filter((shortcut) =>
    matchesPracticeSource(shortcut, stateMap, source),
  );
}

export function createPracticeQueue(
  shortcuts: readonly Shortcut[],
  stateMap: ShortcutUserStateMap,
  source: PracticeSource,
  sessionSize: PracticeSessionSize,
) {
  const candidates = getPracticeCandidates(shortcuts, stateMap, source);

  const shuffledCandidates = shuffleItems(candidates);

  if (sessionSize === "all") {
    return shuffledCandidates;
  }

  return shuffledCandidates.slice(0, sessionSize);
}

export function getPracticeKeySet(
  shortcut: Shortcut,
): ShortcutKeySet | undefined {
  return (
    shortcut.keys.find((keySet) => keySet.operatingSystem === "windows") ??
    shortcut.keys.find((keySet) => keySet.operatingSystem === "universal") ??
    shortcut.keys[0]
  );
}

function countConfidence(
  answers: readonly PracticeAnswer[],
  confidence: PracticeConfidence,
) {
  return answers.filter((answer) => answer.confidence === confidence).length;
}

export function summarizePracticeAnswers(
  answers: readonly PracticeAnswer[],
): PracticeResultSummary {
  const again = countConfidence(answers, "again");

  const hard = countConfidence(answers, "hard");

  const gotIt = countConfidence(answers, "got-it");

  const total = answers.length;

  const confidentPercentage =
    total === 0 ? 0 : Math.round((gotIt / total) * 100);

  return {
    total,
    again,
    hard,
    gotIt,
    confidentPercentage,
  };
}
