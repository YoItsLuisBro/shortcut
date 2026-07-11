import { Keycap } from "./Keycap";

import type { LibraryEntry } from "../utils/library";
import type { LearningStatus } from "../types/shortcutState";

interface LibraryShortcutRowProps {
  entry: LibraryEntry;
  onToggleSaved: (shortcutId: string) => void;
  onSetLearningStatus: (shortcutId: string, status: LearningStatus) => void;
  onToggleHidden: (shortcutId: string) => void;
}

const secondaryButtonClasses = [
  "min-h-10 border border-border px-3 py-2",
  "text-xs font-medium text-text-secondary",
  "transition-colors",
  "hover:border-border-strong hover:bg-surface-hover",
  "hover:text-text-primary",
  "focus-visible:outline-none focus-visible:ring-2",
  "focus-visible:ring-accent focus-visible:ring-offset-2",
  "focus-visible:ring-offset-background",
].join(" ");

function getToggleClasses(isActive: boolean) {
  return [
    secondaryButtonClasses,
    isActive
      ? "border-accent bg-accent text-background hover:bg-accent-muted hover:text-background"
      : "bg-transparent",
  ].join(" ");
}

export function LibraryShortcutRow({
  entry,
  onToggleSaved,
  onSetLearningStatus,
  onToggleHidden,
}: LibraryShortcutRowProps) {
  const { shortcut, userState } = entry;

  const keySet =
    shortcut.keys.find(
      (candidateKeySet) => candidateKeySet.operatingSystem === "windows",
    ) ?? shortcut.keys[0];

  const isKnown = userState.learningStatus === "known";

  const isLearning = userState.learningStatus === "learning";

  return (
    <article className="border border-border bg-surface">
      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-text-muted">
            {shortcut.applicationLabel}

            <span className="mx-2" aria-hidden="true">
              /
            </span>

            {shortcut.category}

            <span className="mx-2" aria-hidden="true">
              /
            </span>

            {shortcut.difficulty}
          </p>

          <h2 className="mt-2 text-lg font-semibold leading-snug text-text-primary">
            {shortcut.title}
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-text-secondary">
            {shortcut.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {userState.saved && (
              <span className="border border-accent px-2 py-1 text-xs font-medium text-accent">
                saved
              </span>
            )}

            {userState.learningStatus && (
              <span className="border border-border-strong px-2 py-1 text-xs font-medium text-text-secondary">
                {userState.learningStatus}
              </span>
            )}

            {userState.hidden && (
              <span className="border border-danger px-2 py-1 text-xs font-medium text-danger">
                hidden
              </span>
            )}
          </div>
        </div>

        {keySet && (
          <div
            className="flex flex-wrap items-center gap-2 lg:justify-end"
            aria-label={`Keyboard shortcut ${keySet.keys.join(" plus ")}`}
          >
            {keySet.keys.map((key, index) => (
              <div key={`${shortcut.id}-${key}-${index}`} className="contents">
                {index > 0 && (
                  <span className="text-xs text-text-muted" aria-hidden="true">
                    +
                  </span>
                )}

                <Keycap>{key}</Keycap>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 border-t border-border sm:grid-cols-4">
        <button
          type="button"
          className={[
            getToggleClasses(userState.saved),
            "border-b-0 border-l-0 border-t-0",
          ].join(" ")}
          onClick={() => onToggleSaved(shortcut.id)}
          aria-pressed={userState.saved}
        >
          {userState.saved ? "saved" : "save"}
        </button>

        <button
          type="button"
          className={[
            getToggleClasses(isKnown),
            "border-b-0 border-r-0 border-t-0 sm:border-r",
          ].join(" ")}
          onClick={() =>
            onSetLearningStatus(shortcut.id, isKnown ? null : "known")
          }
          aria-pressed={isKnown}
        >
          {isKnown ? "known" : "mark known"}
        </button>

        <button
          type="button"
          className={[
            getToggleClasses(isLearning),
            "border-b-0 border-l-0",
          ].join(" ")}
          onClick={() =>
            onSetLearningStatus(shortcut.id, isLearning ? null : "learning")
          }
          aria-pressed={isLearning}
        >
          {isLearning ? "learning" : "mark learning"}
        </button>

        <button
          type="button"
          className={[
            secondaryButtonClasses,
            "border-b-0 border-r-0",
            userState.hidden
              ? "text-success hover:border-success hover:text-success"
              : "text-danger hover:border-danger hover:text-danger",
          ].join(" ")}
          onClick={() => onToggleHidden(shortcut.id)}
        >
          {userState.hidden ? "restore" : "hide"}
        </button>
      </div>
    </article>
  );
}
