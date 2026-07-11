import { NavLink, Outlet } from "react-router";

const navigationItems = [
  {
    label: "discover",
    to: "/",
    end: true,
  },
  {
    label: "library",
    to: "/library",
    end: false,
  },
  {
    label: "practice",
    to: "/practice",
    end: false,
  },
];

function getNavigationClasses({ isActive }: { isActive: boolean }) {
  return [
    "relative flex min-h-11 items-center px-3",
    "text-xs font-medium uppercase tracking-[0.14em]",
    "transition-colors",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-accent focus-visible:ring-inset",
    isActive ? "text-accent" : "text-text-muted hover:text-text-primary",
  ].join(" ");
}

export function AppShell() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-text-primary">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-16 items-center justify-between gap-4">
            <NavLink
              to="/"
              className="text-base font-semibold tracking-tight text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              aria-label="shortcut home"
            >
              shortcut <span className="text-accent">.</span>
            </NavLink>

            <div
              className="hidden items-center gap-2 text-xs text-text-muted sm:flex"
              aria-label="Application Status"
            >
              <span
                className="size-1.5 rounded-full bg-success"
                aria-hidden="true"
              />

              <span>local mode</span>
            </div>
          </div>

          <nav
            className="-mx-4 flex overflow-x-auto border-t border-border px-4 sm:mx-0 sm:px-0"
            aria-label="Primary navigation"
          >
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={getNavigationClasses}
              >
                {({ isActive }) => (
                  <>
                    {item.label}

                    {isActive && (
                      <span
                        className="absolute inset-x-3 bottom-0 h-px bg-accent"
                        aria-hidden="true"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <Outlet />
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 text-xs text-text-muted sm:px-6 lg:px-8">
          <p>discover → practice → remember</p>

          <p className="hidden sm:block">shortcut . / local-first</p>
        </div>
      </footer>
    </div>
  );
}
