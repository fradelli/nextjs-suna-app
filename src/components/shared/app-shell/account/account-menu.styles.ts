import { cn } from "@fradelli/ui/cn";

const accountMenuStyles = {
  trigger: "max-w-44 gap-2 px-2 sm:px-3",
  triggerIcon: "size-5",
  triggerLabel: "hidden max-w-28 truncate sm:inline",
  content: cn(
    "z-50 w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-border",
    "p-3 text-foreground",
  ),
  accountHeader: "min-w-0 px-2 py-1",
  accountEyebrow:
    "text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase",
  accountName: "mt-1 block truncate text-sm font-semibold",
  accountEmail: "block truncate text-xs text-muted-foreground",
  separator: "my-3 h-px bg-border",
  error: cn(
    "mb-3 rounded-lg border border-status-destructive/30 bg-status-destructive/10 px-3 py-2",
    "text-sm text-status-destructive",
  ),
  signOut: "w-full justify-start",
  pendingIcon: "animate-spin",
} as const;

export { accountMenuStyles };
