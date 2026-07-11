import type { ChangeEvent } from "react";

import type {
  LibraryApplicationFilter,
  LibraryDifficultyFilter,
  LibrarySortOption,
  LibraryStatusFilter,
} from "../types/library";

interface LibraryToolbarProps {
  searchQuery: string;
  status: LibraryStatusFilter;
  application: LibraryApplicationFilter;
  difficulty: LibraryDifficultyFilter;
  sort: LibrarySortOption;
  resultCount: number;
  onSearchQueryChange: (searchQuery: string) => void;
  onStatusChange: (status: LibraryStatusFilter) => void;
  onApplicationChange: (application: LibraryApplicationFilter) => void;
  onDifficultyChange: (difficulty: LibraryDifficultyFilter) => void;
  onSortChange: (sort: LibrarySortOption) => void;
  onReset: () => void;
}

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

export function LibraryToolbar({
  searchQuery,
  status,
  application,
  difficulty,
  sort,
  resultCount,
  onSearchQueryChange,
  onStatusChange,
  onApplicationChange,
  onDifficultyChange,
  onSortChange,
  onReset,
}: LibraryToolbarProps) {
  const hasActiveControls =
    searchQuery.trim().length > 0 ||
    status !== "all" ||
    application !== "all" ||
    difficulty !== "all" ||
    sort !== "application";

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    onSearchQueryChange(event.target.value);
  }

  function handleStatusChange(event: ChangeEvent<HTMLSelectElement>) {
    onStatusChange(event.target.value as LibraryStatusFilter);
  }

  function handleApplicationChange(event: ChangeEvent<HTMLSelectElement>) {
    onApplicationChange(event.target.value as LibraryApplicationFilter);
  }

  function handleDifficultyChange(event: ChangeEvent<HTMLSelectElement>) {
    onDifficultyChange(event.target.value as LibraryDifficultyFilter);
  }

  function handleSortChange(event: ChangeEvent<HTMLSelectElement>) {
    onSortChange(event.target.value as LibrarySortOption);
  }

  return (
    <section
      className="border border-border bg-surface"
      aria-labelledby="library-controls-title"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
        <div>
          <h2
            id="library-controls-title"
            className="text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary"
          >
            library controls
          </h2>

          <p className="mt-1 text-xs text-text-muted" aria-live="polite">
            {resultCount} matching entries
          </p>
        </div>

        <button
          type="button"
          className={[
            "min-h-10 border border-border px-3 py-2",
            "text-xs font-medium text-text-secondary",
            "transition-colors",
            "hover:border-border-strong hover:bg-surface-hover",
            "hover:text-text-primary",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-accent focus-visible:ring-offset-2",
            "focus-visible:ring-offset-background",
            "disabled:cursor-not-allowed disabled:opacity-40",
          ].join(" ")}
          onClick={onReset}
          disabled={!hasActiveControls}
        >
          reset controls
        </button>
      </div>

      <div className="grid gap-4 px-4 py-4 sm:px-5 lg:grid-cols-12">
        <label className="block lg:col-span-4">
          <span className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-text-muted">
            search
          </span>

          <input
            type="search"
            className={[
              "min-h-11 w-full rounded-none",
              "border border-border bg-background px-3 py-2",
              "text-sm text-text-primary",
              "placeholder:text-text-muted",
              "transition-colors",
              "hover:border-border-strong",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-accent focus-visible:ring-offset-2",
              "focus-visible:ring-offset-background",
            ].join(" ")}
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="search title, app, tag, or keys"
          />
        </label>

        <label className="block sm:col-span-1 lg:col-span-2">
          <span className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-text-muted">
            status
          </span>

          <div className="relative">
            <select
              className={selectClasses}
              value={status}
              onChange={handleStatusChange}
            >
              <option value="all">All statuses</option>
              <option value="saved">Saved</option>
              <option value="known">Known</option>
              <option value="learning">Learning</option>
              <option value="hidden">Hidden</option>
            </select>

            <SelectArrow />
          </div>
        </label>

        <label className="block sm:col-span-1 lg:col-span-2">
          <span className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-text-muted">
            application
          </span>

          <div className="relative">
            <select
              className={selectClasses}
              value={application}
              onChange={handleApplicationChange}
            >
              <option value="all">All applications</option>
              <option value="windows">Windows</option>
              <option value="google-chrome">Google Chrome</option>
              <option value="visual-studio-code">VS Code</option>
              <option value="microsoft-excel">Microsoft Excel</option>
            </select>

            <SelectArrow />
          </div>
        </label>

        <label className="block sm:col-span-1 lg:col-span-2">
          <span className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-text-muted">
            difficulty
          </span>

          <div className="relative">
            <select
              className={selectClasses}
              value={difficulty}
              onChange={handleDifficultyChange}
            >
              <option value="all">All difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <SelectArrow />
          </div>
        </label>

        <label className="block sm:col-span-1 lg:col-span-2">
          <span className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-text-muted">
            sort
          </span>

          <div className="relative">
            <select
              className={selectClasses}
              value={sort}
              onChange={handleSortChange}
            >
              <option value="application">Application</option>
              <option value="title">Title</option>
              <option value="difficulty">Difficulty</option>
              <option value="status">Status</option>
            </select>

            <SelectArrow />
          </div>
        </label>
      </div>
    </section>
  );
}
