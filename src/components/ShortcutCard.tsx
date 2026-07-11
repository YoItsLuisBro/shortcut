import type { OperatingSystem, Shortcut } from "../types/shortcut";
import type { LearningStatus, ShortcutUserState } from "../types/shortcutState";

import { Keycap } from "./Keycap";

interface ShortcutCardProps {
  shortcut: Shortcut;
  shortcutNumber: number;
  totalShortcuts: number;
  operatingSystem: OperatingSystem;
  userState: ShortcutUserState;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onToggleSaved: () => void;
  onSetLearningStatus: (status: LearningStatus) => void;
  onHide: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

const actionButtonClasses = [
  "min-h-11 border border-border px-4 py-2.5",
  "text-sm font-medium transition-colors",
  "focus-visible:outline-none focus-visible:ring-2",
  "focus-visible:ring-accent focus-visible:ring-offset-2",
  "focus-visible:ring-offset-background",
  "disabled:cursor-not-allowed disabled:text-text-muted",
  "disabled:opacity-50 disabled:hover:border-border",
  "disabled:hover:bg-transparent",
].join(" ");

const inactiveActionClasses = [
  "bg-transparent text-text-secondary",
  "hover:border-border-strong hover:bg-surface-hover",
  "hover:text-text-primary",
].join(" ");

const activeActionClasses = [
  "border-accent bg-accent text-background",
  "hover:bg-accent-muted hover:text-background",
].join(" ");

function formatShortcutNumber(value: number) {
  return value.toString().padStart(4, "0");
}

function formatOperatingSystem(operatingSystem: OperatingSystem) {
  const labels: Record<OperatingSystem, string> = {
    windows: "Windows",
    macos: "macOS",
    linux: "Linux",
    universal: "Universal",
  };

  return labels[operatingSystem];
}

function getActionClasses(isActive: boolean) {
  return [
    actionButtonClasses,
    isActive ? activeActionClasses : inactiveActionClasses,
  ].join(" ");
}

export function ShortcutCard({
  shortcut,
  shortcutNumber,
  totalShortcuts,
  operatingSystem,
  userState,
  canGoPrevious,
  canGoNext,
  onToggleSaved,
  onSetLearningStatus,
  onHide,
  onPrevious,
  onNext,
}: ShortcutCardProps) {
  const activeKeySet =
    shortcut.keys.find(
      (keySet) => keySet.operatingSystem === operatingSystem,
    ) ?? shortcut.keys.find((keySet) => keySet.operatingSystem === "universal");

  if (!activeKeySet) {
    return (
      <section
        className="border border-border bg-surface px-5 py-8 sm:px-7"
        aria-labelledby="unavailable-shortcut-title"
      >
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-warning">
          unavailable
        </p>

        <h1
          id="unavailable-shortcut-title"
          className="mt-3 text-xl font-semibold text-text-primary"
        >
          This shortcut does not support the selected operating system.
        </h1>
      </section>
    );
  }

  const formattedShortcutNumber = formatShortcutNumber(shortcutNumber);

  const formattedTotal = formatShortcutNumber(totalShortcuts);

  const keyCombinationLabel = activeKeySet.keys.join(" plus ");

  const isKnown = userState.learningStatus === "known";

  const isLearning = userState.learningStatus === "learning";

  return (
    <section aria-labelledby="shortcut-title">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-text-muted">
          shortcut {formattedShortcutNumber}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          {userState.saved && (
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
              saved
            </span>
          )}

          {userState.learningStatus && (
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-text-secondary">
              {userState.learningStatus}
            </span>
          )}

          <p className="text-xs uppercase tracking-[0.18em] text-text-muted">
            {formattedShortcutNumber} / {formattedTotal}
          </p>
        </div>
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

            {formatOperatingSystem(activeKeySet.operatingSystem)}
          </p>
        </div>

        <div className="px-5 py-8 sm:px-7 sm:py-10 lg:px-10 lg:py-12">
          <div
            className="flex flex-wrap items-center gap-2 sm:gap-3"
            aria-label={`Keyboard shortcut ${keyCombinationLabel}`}
          >
            {activeKeySet.keys.map((key, index) => (
              <div key={`${shortcut.id}-${key}-${index}`} className="contents">
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

          <div className="mt-8 max-w-3xl">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-accent">
              {shortcut.title}
            </p>

            <h1
              id="shortcut-title"
              className="text-2xl font-semibold leading-tight tracking-tight text-text-primary sm:text-3xl lg:text-4xl"
            >
              {shortcut.title}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-text-secondary sm:text-base">
              {shortcut.description}
            </p>

            {shortcut.example && (
              <div className="mt-7 border-l-2 border-border-strong pl-4">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-text-muted">
                  example
                </p>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
                  {shortcut.example}
                </p>
              </div>
            )}
          </div>

          <dl className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-5 text-xs">
            <div className="flex items-center gap-2">
              <dt className="text-text-muted">difficulty</dt>
              <dd className="text-text-secondary">{shortcut.difficulty}</dd>
            </div>

            <div className="flex items-center gap-2">
              <dt className="text-text-muted">usefulness</dt>
              <dd className="text-text-secondary">{shortcut.usefulness}</dd>
            </div>

            <div className="flex items-center gap-2">
              <dt className="text-text-muted">tags</dt>
              <dd className="text-text-secondary">{shortcut.tags.length}</dd>
            </div>
          </dl>
        </div>

        <div className="grid grid-cols-2 border-t border-border sm:grid-cols-4 lg:flex lg:flex-wrap">
          <button
            type="button"
            className={[
              getActionClasses(isKnown),
              "border-l-0 border-t-0",
              "sm:border-b-0",
            ].join(" ")}
            onClick={() => onSetLearningStatus(isKnown ? null : "known")}
            aria-pressed={isKnown}
          >
            {isKnown ? "known" : "know it"}
          </button>

          <button
            type="button"
            className={[
              getActionClasses(userState.saved),
              "border-r-0 border-t-0",
              "sm:border-b-0 sm:border-r",
            ].join(" ")}
            onClick={onToggleSaved}
            aria-pressed={userState.saved}
          >
            {userState.saved ? "saved" : "save"}
          </button>

          <button
            type="button"
            className={[
              getActionClasses(isLearning),
              "border-b-0 border-l-0",
              "sm:border-r",
            ].join(" ")}
            onClick={() => onSetLearningStatus(isLearning ? null : "learning")}
            aria-pressed={isLearning}
          >
            {isLearning ? "learning" : "learn"}
          </button>

          <button
            type="button"
            className={[
              actionButtonClasses,
              inactiveActionClasses,
              "border-b-0 border-r-0",
              "text-danger",
              "hover:border-danger hover:text-danger",
              "sm:border-r",
            ].join(" ")}
            onClick={onHide}
          >
            hide
          </button>

          <div className="col-span-2 grid grid-cols-2 border-t border-border sm:col-span-4 lg:ml-auto lg:border-t-0">
            <button
              type="button"
              className={[
                actionButtonClasses,
                inactiveActionClasses,
                "border-b-0 border-l-0 border-r",
                "lg:min-w-28",
              ].join(" ")}
              onClick={onPrevious}
              disabled={!canGoPrevious}
              aria-label="Show previous shortcut"
            >
              <span className="mr-2" aria-hidden="true">
                ←
              </span>
              previous
            </button>

            <button
              type="button"
              className={[
                "min-h-11 border-0 bg-accent px-4 py-2.5",
                "text-sm font-semibold text-background",
                "transition-colors hover:bg-accent-muted",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-accent focus-visible:ring-offset-2",
                "focus-visible:ring-offset-background",
                "disabled:cursor-not-allowed",
                "disabled:bg-border-strong",
                "disabled:text-text-muted",
                "disabled:opacity-60",
                "lg:min-w-28",
              ].join(" ")}
              onClick={onNext}
              disabled={!canGoNext}
              aria-label="Show next random shortcut"
            >
              next
              <span className="ml-2" aria-hidden="true">
                →
              </span>
            </button>
          </div>
        </div>
      </article>
    </section>
  );
}
