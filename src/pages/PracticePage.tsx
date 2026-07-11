import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

import { PracticeQuestionCard } from "../components/PracticeQuestionCard";
import { shortcuts } from "../data/shortcuts";
import { loadShortcutUserState } from "../storage/shortcutUserState";
import type {
  PracticeAnswer,
  PracticeConfidence,
  PracticeSessionSize,
  PracticeSource,
  PracticeView,
} from "../types/practice";
import type { Shortcut } from "../types/shortcut";
import {
  createPracticeQueue,
  getPracticeCandidates,
  getPracticeKeySet,
  summarizePracticeAnswers,
} from "../utils/practice";

const selectClasses = [
  "min-h-11 w-full appearance-none rounded-none",
  "border border-border bg-surface px-3 py-2 pr-10",
  "text-sm text-text-primary",
  "transition-colors",
  "hover:border-border-strong",
  "focus-visible:outline-none focus-visible:ring-2",
  "focus-visible:ring-accent focus-visible:ring-offset-2",
  "focus-visible:ring-offset-background",
].join(" ");

function SelectArrow() {
  return (
    <span
      className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-text-muted"
      aria-hidden="true"
    >
      ▾
    </span>
  );
}

export function PracticePage() {
  const [userStateMap] = useState(loadShortcutUserState);

  const [view, setView] = useState<PracticeView>("setup");

  const [source, setSource] = useState<PracticeSource>("learning");

  const [sessionSize, setSessionSize] = useState<PracticeSessionSize>(5);

  const [practiceQueue, setPracticeQueue] = useState<Shortcut[]>([]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  const [answers, setAnswers] = useState<PracticeAnswer[]>([]);

  const learningCandidates = useMemo(
    () => getPracticeCandidates(shortcuts, userStateMap, "learning"),
    [userStateMap],
  );

  const savedCandidates = useMemo(
    () => getPracticeCandidates(shortcuts, userStateMap, "saved"),
    [userStateMap],
  );

  const selectedCandidates =
    source === "learning" ? learningCandidates : savedCandidates;

  const currentShortcut = practiceQueue[currentQuestionIndex];

  const currentKeySet = currentShortcut
    ? getPracticeKeySet(currentShortcut)
    : undefined;

  const resultSummary = useMemo(
    () => summarizePracticeAnswers(answers),
    [answers],
  );

  const handleStartSession = useCallback(() => {
    const nextQueue = createPracticeQueue(
      shortcuts,
      userStateMap,
      source,
      sessionSize,
    );

    if (nextQueue.length === 0) {
      return;
    }

    setPracticeQueue(nextQueue);
    setCurrentQuestionIndex(0);
    setIsAnswerRevealed(false);
    setAnswers([]);
    setView("session");
  }, [sessionSize, source, userStateMap]);

  const handleRevealAnswer = useCallback(() => {
    if (!currentShortcut) {
      return;
    }

    setIsAnswerRevealed(true);
  }, [currentShortcut]);

  const handleScoreAnswer = useCallback(
    (confidence: PracticeConfidence) => {
      if (!currentShortcut || !isAnswerRevealed) {
        return;
      }

      const nextAnswer: PracticeAnswer = {
        shortcutId: currentShortcut.id,
        confidence,
      };

      const nextAnswers = [...answers, nextAnswer];

      setAnswers(nextAnswers);

      const isFinalQuestion = currentQuestionIndex >= practiceQueue.length - 1;

      if (isFinalQuestion) {
        setView("results");
        return;
      }

      setCurrentQuestionIndex((currentIndex) => currentIndex + 1);

      setIsAnswerRevealed(false);
    },
    [
      answers,
      currentQuestionIndex,
      currentShortcut,
      isAnswerRevealed,
      practiceQueue.length,
    ],
  );

  const handleReturnToSetup = useCallback(() => {
    setView("setup");
    setPracticeQueue([]);
    setCurrentQuestionIndex(0);
    setIsAnswerRevealed(false);
    setAnswers([]);
  }, []);

  useEffect(() => {
    function handlePracticeKeyboard(event: KeyboardEvent) {
      if (view !== "session") {
        return;
      }

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

      if (event.code === "Space" && !isAnswerRevealed) {
        event.preventDefault();
        handleRevealAnswer();
        return;
      }

      if (!isAnswerRevealed) {
        return;
      }

      if (event.key === "1") {
        event.preventDefault();
        handleScoreAnswer("again");
      }

      if (event.key === "2") {
        event.preventDefault();
        handleScoreAnswer("hard");
      }

      if (event.key === "3") {
        event.preventDefault();
        handleScoreAnswer("got-it");
      }
    }

    window.addEventListener("keydown", handlePracticeKeyboard);

    return () => {
      window.removeEventListener("keydown", handlePracticeKeyboard);
    };
  }, [handleRevealAnswer, handleScoreAnswer, isAnswerRevealed, view]);

  if (view === "session" && currentShortcut) {
    return (
      <div className="w-full">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              active session
            </p>

            <p className="mt-1 text-xs text-text-muted">
              {source} queue · {practiceQueue.length} questions
            </p>
          </div>

          <button
            type="button"
            className={[
              "min-h-10 border border-border px-3 py-2",
              "text-xs font-medium text-text-secondary",
              "transition-colors",
              "hover:border-danger hover:text-danger",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-accent focus-visible:ring-offset-2",
              "focus-visible:ring-offset-background",
            ].join(" ")}
            onClick={handleReturnToSetup}
          >
            end session
          </button>
        </div>

        <PracticeQuestionCard
          shortcut={currentShortcut}
          keySet={currentKeySet}
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={practiceQueue.length}
          isAnswerRevealed={isAnswerRevealed}
          onRevealAnswer={handleRevealAnswer}
          onScoreAnswer={handleScoreAnswer}
        />

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-xs text-text-muted">
          <p>answered {answers.length}</p>

          <p className="hidden sm:block">
            Space reveal · 1 again · 2 hard · 3 got it
          </p>
        </div>
      </div>
    );
  }

  if (view === "results") {
    return (
      <section className="w-full" aria-labelledby="practice-results-title">
        <header className="mb-8 border-b border-border pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-success">
            session complete
          </p>

          <h1
            id="practice-results-title"
            className="mt-3 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl"
          >
            practice results
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-text-secondary">
            Review how confidently you recalled the shortcuts in this session.
          </p>
        </header>

        <dl className="grid grid-cols-2 border border-border bg-surface sm:grid-cols-4">
          <div className="border-b border-r border-border p-4 sm:border-b-0">
            <dt className="text-xs uppercase tracking-[0.14em] text-text-muted">
              total
            </dt>

            <dd className="mt-2 text-3xl font-semibold text-text-primary">
              {resultSummary.total}
            </dd>
          </div>

          <div className="border-b border-border p-4 sm:border-b-0 sm:border-r">
            <dt className="text-xs uppercase tracking-[0.14em] text-text-muted">
              again
            </dt>

            <dd className="mt-2 text-3xl font-semibold text-danger">
              {resultSummary.again}
            </dd>
          </div>

          <div className="border-r border-border p-4">
            <dt className="text-xs uppercase tracking-[0.14em] text-text-muted">
              hard
            </dt>

            <dd className="mt-2 text-3xl font-semibold text-warning">
              {resultSummary.hard}
            </dd>
          </div>

          <div className="p-4">
            <dt className="text-xs uppercase tracking-[0.14em] text-text-muted">
              got it
            </dt>

            <dd className="mt-2 text-3xl font-semibold text-success">
              {resultSummary.gotIt}
            </dd>
          </div>
        </dl>

        <div className="mt-6 border border-border bg-surface p-5 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
            confident recall
          </p>

          <p className="mt-3 text-5xl font-semibold tracking-tight text-accent">
            {resultSummary.confidentPercentage}%
          </p>

          <div className="mt-5 h-2 overflow-hidden bg-background">
            <div
              className="h-full bg-accent transition-[width]"
              style={{
                width: `${resultSummary.confidentPercentage}%`,
              }}
            />
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-text-secondary">
            This score represents the percentage of answers marked “got it.”
            Practice history is not persisted yet.
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            className={[
              "min-h-12 border border-accent bg-accent px-4 py-3",
              "text-sm font-semibold text-background",
              "transition-colors hover:bg-accent-muted",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-accent focus-visible:ring-offset-2",
              "focus-visible:ring-offset-background",
            ].join(" ")}
            onClick={handleStartSession}
          >
            practice again
          </button>

          <button
            type="button"
            className={[
              "min-h-12 border border-border px-4 py-3",
              "text-sm font-semibold text-text-secondary",
              "transition-colors",
              "hover:border-border-strong hover:bg-surface-hover",
              "hover:text-text-primary",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-accent focus-visible:ring-offset-2",
              "focus-visible:ring-offset-background",
            ].join(" ")}
            onClick={handleReturnToSetup}
          >
            change session setup
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      <header className="mb-8 border-b border-border pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          training mode
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          practice
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-text-secondary">
          Build a recognition session from shortcuts you are learning or have
          saved for review.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <article
          className={[
            "border bg-surface p-5 sm:p-6",
            source === "learning" ? "border-warning" : "border-border",
          ].join(" ")}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-warning">
            learning queue
          </p>

          <p className="mt-4 text-4xl font-semibold text-text-primary">
            {learningCandidates.length}
          </p>

          <p className="mt-3 text-sm leading-7 text-text-secondary">
            Visible shortcuts currently marked as learning.
          </p>

          <button
            type="button"
            className={[
              "mt-6 min-h-11 w-full border px-4 py-2.5",
              "text-sm font-semibold transition-colors",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-accent focus-visible:ring-offset-2",
              "focus-visible:ring-offset-background",
              source === "learning"
                ? "border-warning bg-warning text-background"
                : "border-border text-text-secondary hover:border-warning hover:text-warning",
            ].join(" ")}
            onClick={() => setSource("learning")}
            aria-pressed={source === "learning"}
          >
            use learning queue
          </button>
        </article>

        <article
          className={[
            "border bg-surface p-5 sm:p-6",
            source === "saved" ? "border-accent" : "border-border",
          ].join(" ")}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            saved queue
          </p>

          <p className="mt-4 text-4xl font-semibold text-text-primary">
            {savedCandidates.length}
          </p>

          <p className="mt-3 text-sm leading-7 text-text-secondary">
            Visible shortcuts saved for reference or future review.
          </p>

          <button
            type="button"
            className={[
              "mt-6 min-h-11 w-full border px-4 py-2.5",
              "text-sm font-semibold transition-colors",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-accent focus-visible:ring-offset-2",
              "focus-visible:ring-offset-background",
              source === "saved"
                ? "border-accent bg-accent text-background"
                : "border-border text-text-secondary hover:border-accent hover:text-accent",
            ].join(" ")}
            onClick={() => setSource("saved")}
            aria-pressed={source === "saved"}
          >
            use saved queue
          </button>
        </article>
      </div>

      <div className="mt-6 border border-border bg-surface">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">
            session setup
          </h2>
        </div>

        <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-text-muted">
              selected queue
            </p>

            <p className="mt-2 text-lg font-semibold text-text-primary">
              {source === "learning" ? "Learning shortcuts" : "Saved shortcuts"}
            </p>

            <p className="mt-2 text-sm leading-6 text-text-secondary">
              {selectedCandidates.length} visible shortcuts are available in
              this queue.
            </p>
          </div>

          <label className="block">
            <span className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-text-muted">
              session size
            </span>

            <div className="relative">
              <select
                className={selectClasses}
                value={sessionSize}
                onChange={(event) => {
                  const value = event.target.value;

                  if (value === "all") {
                    setSessionSize("all");
                    return;
                  }

                  setSessionSize(Number(value) === 10 ? 10 : 5);
                }}
              >
                <option value={5}>Up to 5 shortcuts</option>

                <option value={10}>Up to 10 shortcuts</option>

                <option value="all">Entire queue</option>
              </select>

              <SelectArrow />
            </div>
          </label>
        </div>

        <div className="border-t border-border p-5 sm:p-6">
          <button
            type="button"
            className={[
              "min-h-12 w-full border px-4 py-3",
              "text-sm font-semibold transition-colors",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-accent focus-visible:ring-offset-2",
              "focus-visible:ring-offset-background",
              "disabled:cursor-not-allowed disabled:border-border",
              "disabled:bg-border disabled:text-text-muted",
              "disabled:opacity-60",
              selectedCandidates.length > 0
                ? "border-accent bg-accent text-background hover:bg-accent-muted"
                : "border-border bg-border text-text-muted",
            ].join(" ")}
            onClick={handleStartSession}
            disabled={selectedCandidates.length === 0}
          >
            start practice session
          </button>

          {selectedCandidates.length === 0 && (
            <p className="mt-3 text-center text-xs leading-5 text-warning">
              Add shortcuts to this queue through discovery or the library
              before starting.
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 border border-border bg-surface px-5 py-6 sm:px-7">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
          how this session works
        </p>

        <ol className="mt-4 grid gap-4 text-sm leading-6 text-text-secondary sm:grid-cols-3">
          <li>
            <span className="mr-2 text-accent">01</span>
            Read the action and recall the key combination.
          </li>

          <li>
            <span className="mr-2 text-accent">02</span>
            Reveal the answer when you are ready.
          </li>

          <li>
            <span className="mr-2 text-accent">03</span>
            Score your recall as again, hard, or got it.
          </li>
        </ol>

        <Link
          to="/library"
          className={[
            "mt-6 inline-flex min-h-11 items-center",
            "border border-border px-4 py-2.5",
            "text-sm font-semibold text-text-secondary",
            "transition-colors",
            "hover:border-border-strong hover:bg-surface-hover",
            "hover:text-text-primary",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-accent focus-visible:ring-offset-2",
            "focus-visible:ring-offset-background",
          ].join(" ")}
        >
          manage practice queues
        </Link>
      </div>
    </section>
  );
}
