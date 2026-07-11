import { Link } from "react-router";

import { Keycap } from "../components/Keycap";
import { shortcuts } from "../data/shortcuts";
import {
  getShortcutUserState,
  loadShortcutUserState,
} from "../storage/shortcutUserState";
import type { Shortcut, ShortcutKeySet } from "../types/shortcut";
import type {
  ShortcutUserState,
  ShortcutUserStateMap,
} from "../types/shortcutState";

interface LibraryEntry {
  shortcut: Shortcut;
  keySet: ShortcutKeySet | undefined;
  userState: ShortcutUserState;
}

function createLibraryEntries(stateMap: ShortcutUserStateMap): LibraryEntry[] {
  return shortcuts
    .map((shortcut) => {
      return {
        shortcut,
        keySet:
          shortcut.keys.find(
            (keySet) => keySet.operatingSystem === "windows",
          ) ?? shortcut.keys[0],
        userState: getShortcutUserState(stateMap, shortcut.id),
      };
    })
    .filter(({ userState }) => {
      return (
        userState.saved || userState.learningStatus !== null || userState.hidden
      );
    });
}

function LibraryShortcutRow({ entry }: { entry: LibraryEntry }) {
  const { shortcut, keySet, userState } = entry;

  return (
    <article className="border border-border bg-surface">
      <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-text-muted">
            {shortcut.applicationLabel}
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            {shortcut.category}
          </p>

          <h2 className="mt-2 text-lg font-semibold leading-snug text-text-primary">
            {shortcut.title}
          </h2>

          <div className="mt-3 flex flex-wrap gap-2">
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
            className="flex flex-wrap items-center gap-2"
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
    </article>
  );
}

export function LibraryPage() {
  const stateMap = loadShortcutUserState();

  const entries = createLibraryEntries(stateMap);

  const savedCount = shortcuts.filter(
    (shortcut) => getShortcutUserState(stateMap, shortcut.id).saved,
  ).length;

  const knownCount = shortcuts.filter(
    (shortcut) =>
      getShortcutUserState(stateMap, shortcut.id).learningStatus === "known",
  ).length;

  const learningCount = shortcuts.filter(
    (shortcut) =>
      getShortcutUserState(stateMap, shortcut.id).learningStatus === "learning",
  ).length;

  const hiddenCount = shortcuts.filter(
    (shortcut) => getShortcutUserState(stateMap, shortcut.id).hidden,
  ).length;

  return (
    <section className="w-full">
      <header className="mb-8 border-b border-border pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          personal collection
        </p>

        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
              library
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-text-secondary">
              Review the shortcuts you have saved, classified, or hidden during
              discovery.
            </p>
          </div>

          <Link
            to="/"
            className={[
              "inline-flex min-h-11 items-center justify-center",
              "border border-accent px-4 py-2.5",
              "text-sm font-semibold text-accent",
              "transition-colors",
              "hover:bg-accent hover:text-background",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-accent focus-visible:ring-offset-2",
              "focus-visible:ring-offset-background",
            ].join(" ")}
          >
            discover shortcuts
          </Link>
        </div>
      </header>

      <dl className="grid grid-cols-2 border border-border bg-surface sm:grid-cols-4">
        <div className="border-b border-r border-border p-4 sm:border-b-0">
          <dt className="text-xs uppercase tracking-[0.14em] text-text-muted">
            saved
          </dt>
          <dd className="mt-2 text-2xl font-semibold text-accent">
            {savedCount}
          </dd>
        </div>

        <div className="border-b border-border p-4 sm:border-b-0 sm:border-r">
          <dt className="text-xs uppercase tracking-[0.14em] text-text-muted">
            known
          </dt>
          <dd className="mt-2 text-2xl font-semibold text-accent">
            {knownCount}
          </dd>
        </div>

        <div className="border-r border-border p-4">
          <dt className="text-xs uppercase tracking-[0.14em] text-text-muted">
            learning
          </dt>
          <dd className="mt-2 text-2xl font-semibold text-warning">
            {learningCount}
          </dd>
        </div>

        <div className="p-4">
          <dt className="text-xs uppercase tracking-[0.14em] text-text-muted">
            hidden
          </dt>
          <dd className="mt-2 text-2xl font-semibold text-danger">
            {hiddenCount}
          </dd>
        </div>
      </dl>

      <div className="mt-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">
            classified shortcuts
          </h2>

          <p className="text-xs text-text-muted">{entries.length} entries</p>
        </div>

        {entries.length > 0 ? (
          <div className="grid gap-3">
            {entries.map((entry) => (
              <LibraryShortcutRow key={entry.shortcut.id} entry={entry} />
            ))}
          </div>
        ) : (
          <div className="border border-border bg-surface px-5 py-10 sm:px-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
              empty library
            </p>

            <h2 className="mt-3 text-2xl font-semibold text-text-primary">
              You have not classified any shortcuts yet.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-text-secondary">
              Save a shortcut or mark it as known or learning from the discovery
              screen. Your selections will appear here.
            </p>

            <Link
              to="/"
              className={[
                "mt-6 inline-flex min-h-11 items-center",
                "border border-accent px-4 py-2.5",
                "text-sm font-semibold text-accent",
                "transition-colors",
                "hover:bg-accent hover:text-background",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-accent focus-visible:ring-offset-2",
                "focus-visible:ring-offset-background",
              ].join(" ")}
            >
              start discovering
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
