interface KeycapProps {
  children: string;
}

export function Keycap({ children }: KeycapProps) {
  const isLongKey = children.length >= 5;

  return (
    <kbd
      className={[
        "inline-flex min-h-10 items-center justify-center rounded-sm",
        "border border-border-strong bg-surface-hover px-3 py-2",
        "text-center text-sm font-semibold tracking-wide text-text-primary",
        "shadow-[inset_0_-2px_0_var(--color-border)]",
        "sm:min-h-11 sm:px-4 sm:text-base",
        isLongKey ? "min-w-16 sm:min-w-20" : "min-w-10 sm:min-w-11",
      ].join(" ")}
    >
      {children}
    </kbd>
  );
}
