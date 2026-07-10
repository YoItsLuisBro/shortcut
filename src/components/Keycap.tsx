interface KeycapProps {
    children: string;
}

export function Keycap({ children }: KeycapProps) {
    return (
        <kbd className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-sm border border-border-strong bg-surface-hover px-3 py-2 text-center text-sm font-semibold tracking-wide text-text-primary shadow-[inset_0_-2px_0_var(--color-border)] sm:min-h-11 sm:min-w-11 sm:px-4 sm:text-base">
            {children}
        </kbd>
    )
}