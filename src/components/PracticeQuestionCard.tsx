import { Keycap } from "./Keycap";

import type { PracticeConfidence } from "../types/practice";
import type { Shortcut, ShortcutKeySet } from "../types/shortcut";

interface PracticeQuestionCardProps {
  shortcut: Shortcut;
  keySet: ShortcutKeySet | undefined;
  currentQuestion: number;
  totalQuestions: number;
  isAnswerRevealed: boolean;
  onRevealAnswer: () => void;
  onScoreAnswer: (confidence: PracticeConfidence) => void;
}

const scoreButtonClasses = [
  "min-h-12 border px-4 py-3",
  "text-sm font-semibold",
  "transition-colors",
  "focus-visible:outline-none focus-visible:ring-2",
  "focus-visible:ring-accent focus-visible:ring-offset-2",
  "focus-visible:ring-offset-background",
].join(" ");

function formatQuestionNumber(value: number) {
  return value.toString().padStart(2, "0");
}

export function PracticeQuestionCard({
  shortcut,
  keySet,
  currentQuestion,
  totalQuestions,
  isAnswerRevealed,
  onRevealAnswer,
  onScoreAnswer,
}: PracticeQuestionCardProps) {
  const formattedCurrent = formatQuestionNumber(currentQuestion);

  const formattedTotal = formatQuestionNumber(totalQuestions);

  return (
    <section aria-labelledby="practice-question-title">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
          practice {formattedCurrent}
        </p>

        <p className="text-xs uppercase tracking-[0.16em] text-text-muted">
          {formattedCurrent} / {formattedTotal}
        </p>
      </div>

      <article className="border border-border bg-surface">
        <div className="border-b border-border px-5 py-4 sm:px-7">
          <p className="text-xs font-medium uppercase leading-6 tracking-[0.16em] text-text-secondary">
            {shortcut.applicationLabel}

            <span className="mx-2 text-text-muted" aria-hidden="true">
              /
            </span>

            {shortcut.category}

            <span className="mx-2 text-text-muted" aria-hidden="true">
              /
            </span>

            {shortcut.difficulty}
          </p>
        </div>

        <div className="px-5 py-8 sm:px-7 sm:py-10 lg:px-10 lg:py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            recall the shortcut
          </p>

          <h1
            id="practice-question-title"
            className="mt-4 max-w-3xl text-2xl font-semibold leading-tight tracking-tight text-text-primary sm:text-3xl lg:text-4xl"
          >
            {shortcut.title}
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-text-secondary sm:text-base">
            {shortcut.description}
          </p>

          <div className="mt-8 border-t border-border pt-8">
            {!isAnswerRevealed ? (
              <div>
                <p className="text-sm leading-7 text-text-secondary">
                  Try to recall the key combination before revealing the answer.
                </p>

                <button
                  type="button"
                  className={[
                    "mt-5 min-h-12 w-full border border-accent",
                    "bg-accent px-4 py-3",
                    "text-sm font-semibold text-background",
                    "transition-colors",
                    "hover:bg-accent-muted",
                    "focus-visible:outline-none focus-visible:ring-2",
                    "focus-visible:ring-accent focus-visible:ring-offset-2",
                    "focus-visible:ring-offset-background",
                    "sm:w-auto sm:min-w-48",
                  ].join(" ")}
                  onClick={onRevealAnswer}
                >
                  reveal answer
                </button>

                <p className="mt-3 text-xs text-text-muted">
                  keyboard: press Space
                </p>
              </div>
            ) : (
              <div aria-live="polite" aria-atomic="true">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
                  correct shortcut
                </p>

                {keySet ? (
                  <div
                    className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3"
                    aria-label={`Keyboard shortcut ${keySet.keys.join(
                      " plus ",
                    )}`}
                  >
                    {keySet.keys.map((key, index) => (
                      <div
                        key={`${shortcut.id}-${key}-${index}`}
                        className="contents"
                      >
                        {index > 0 && (
                          <span
                            className="text-sm font-medium text-text-muted"
                            aria-hidden="true"
                          >
                            +
                          </span>
                        )}

                        <Keycap>{key}</Keycap>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-warning">
                    No compatible key combination is available.
                  </p>
                )}

                {shortcut.example && (
                  <div className="mt-6 border-l-2 border-border-strong pl-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                      example
                    </p>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
                      {shortcut.example}
                    </p>
                  </div>
                )}

                <div className="mt-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">
                    how well did you recall it?
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <button
                      type="button"
                      className={[
                        scoreButtonClasses,
                        "border-danger text-danger",
                        "hover:bg-danger hover:text-background",
                      ].join(" ")}
                      onClick={() => onScoreAnswer("again")}
                    >
                      again
                      <span className="ml-2 text-xs" aria-hidden="true">
                        [1]
                      </span>
                    </button>

                    <button
                      type="button"
                      className={[
                        scoreButtonClasses,
                        "border-warning text-warning",
                        "hover:bg-warning hover:text-background",
                      ].join(" ")}
                      onClick={() => onScoreAnswer("hard")}
                    >
                      hard
                      <span className="ml-2 text-xs" aria-hidden="true">
                        [2]
                      </span>
                    </button>

                    <button
                      type="button"
                      className={[
                        scoreButtonClasses,
                        "border-success text-success",
                        "hover:bg-success hover:text-background",
                      ].join(" ")}
                      onClick={() => onScoreAnswer("got-it")}
                    >
                      got it
                      <span className="ml-2 text-xs" aria-hidden="true">
                        [3]
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </section>
  );
}
