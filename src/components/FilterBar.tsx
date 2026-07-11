import type { ChangeEvent } from "react";

import type {
  ApplicationFilter,
  DifficultyFilter,
  OperatingSystemFilter,
} from "../types/preferences";

interface FilterBarProps {
  application: ApplicationFilter;
  difficulty: DifficultyFilter;
  operatingSystem: OperatingSystemFilter;
  resultCount: number;
  totalCount: number;
  onApplicationChange: (application: ApplicationFilter) => void;
  onDifficultyChange: (difficulty: DifficultyFilter) => void;
  onOperatingSystemChange: (operatingSystem: OperatingSystemFilter) => void;
  onReset: () => void;
}

interface FilterOption<TValue extends string> {
  value: TValue;
  label: string;
}

const applicationOptions: FilterOption<ApplicationFilter>[] = [
  {
    value: "all",
    label: "All applications",
  },
  {
    value: "windows",
    label: "Windows",
  },
  {
    value: "google-chrome",
    label: "Google Chrome",
  },
  {
    value: "visual-studio-code",
    label: "VS Code",
  },
  {
    value: "microsoft-excel",
    label: "Microsoft Excel",
  },
];

const difficultyOptions: FilterOption<DifficultyFilter>[] = [
  {
    value: "all",
    label: "All difficulties",
  },
  {
    value: "beginner",
    label: "Beginner",
  },
  {
    value: "intermediate",
    label: "Intermediate",
  },
  {
    value: "advanced",
    label: "Advanced",
  },
];

const operatingSystemOptions: FilterOption<OperatingSystemFilter>[] = [
  {
    value: "all",
    label: "All operating systems",
  },
  {
    value: "windows",
    label: "Windows",
  },
  {
    value: "macos",
    label: "macOS",
  },
  {
    value: "linux",
    label: "Linux",
  },
  {
    value: "universal",
    label: "Universal",
  },
];

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

export function FilterBar({
  application,
  difficulty,
  operatingSystem,
  resultCount,
  totalCount,
  onApplicationChange,
  onDifficultyChange,
  onOperatingSystemChange,
  onReset,
}: FilterBarProps) {
  const hasActiveFilters =
    application !== "all" ||
    difficulty !== "all" ||
    operatingSystem !== "windows";

  function handleApplicationChange(event: ChangeEvent<HTMLSelectElement>) {
    onApplicationChange(event.target.value as ApplicationFilter);
  }

  function handleDifficultyChange(event: ChangeEvent<HTMLSelectElement>) {
    onDifficultyChange(event.target.value as DifficultyFilter);
  }

  function handleOperatingSystemChange(event: ChangeEvent<HTMLSelectElement>) {
    onOperatingSystemChange(event.target.value as OperatingSystemFilter);
  }

  return (
    <section
      className="mb-6 border border-border bg-surface"
      aria-labelledby="filter-heading"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
        <div>
          <h2
            id="filter-heading"
            className="text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary"
          >
            discovery filters
          </h2>

          <p className="mt-1 text-xs text-text-muted" aria-live="polite">
            {resultCount} of {totalCount} shortcuts available
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
            "disabled:hover:border-border",
            "disabled:hover:bg-transparent",
            "disabled:hover:text-text-secondary",
          ].join(" ")}
          onClick={onReset}
          disabled={!hasActiveFilters}
        >
          reset filters
        </button>
      </div>

      <div className="grid gap-4 px-4 py-4 sm:grid-cols-2 sm:px-5 lg:grid-cols-3">
        <label className="block">
          <span className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-text-muted">
            application
          </span>

          <div className="relative">
            <select
              className={selectClasses}
              value={application}
              onChange={handleApplicationChange}
            >
              {applicationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <span
              className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-text-muted"
              aria-hidden="true"
            >
              ▾
            </span>
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-text-muted">
            difficulty
          </span>

          <div className="relative">
            <select
              className={selectClasses}
              value={difficulty}
              onChange={handleDifficultyChange}
            >
              {difficultyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <span
              className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-text-muted"
              aria-hidden="true"
            >
              ▾
            </span>
          </div>
        </label>

        <label className="block sm:col-span-2 lg:col-span-1">
          <span className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-text-muted">
            operating system
          </span>

          <div className="relative">
            <select
              className={selectClasses}
              value={operatingSystem}
              onChange={handleOperatingSystemChange}
            >
              {operatingSystemOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <span
              className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-text-muted"
              aria-hidden="true"
            >
              ▾
            </span>
          </div>
        </label>
      </div>
    </section>
  );
}
