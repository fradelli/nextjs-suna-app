import { cn } from "@fradelli/ui/cn";

const publicHomeScreenStyles = {
  root: "min-h-[calc(100vh-4.5rem)]",
  container: cn(
    "mx-auto grid min-h-[calc(100vh-4.5rem)] w-full max-w-7xl content-center",
    "gap-10 px-5 py-12 sm:px-8",
    "lg:grid-cols-[minmax(0,1fr)_26rem]",
  ),
  hero: "flex max-w-3xl flex-col justify-center",
  badge: "mb-4 w-fit gap-2 px-3 py-2 text-sm text-muted-foreground",
  badgeIcon: "text-primary",
  title: "fd-text-display max-w-3xl text-balance",
  description: "fd-text-body mt-6 max-w-2xl text-muted-foreground",
  actionsGrid: "mt-8 grid gap-3 sm:grid-cols-3",
  actionCard: {
    root: "group h-full",
    iconContainer:
      "flex size-10 items-center justify-center rounded-lg bg-surface-interactive text-status-success",
    icon: "size-5",
    headingRow: "flex items-center justify-between gap-3",
    heading: "fd-text-card",
    arrow: "size-4 text-muted-foreground transition group-hover:text-primary",
    detail: "mt-2 text-sm leading-6 text-muted-foreground",
  },
  statusCardAside: "self-center",
  statusCard: {
    header:
      "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border pb-4",
    eyebrow: "text-sm text-muted-foreground",
    title: "fd-text-card mt-1",
    icon: "size-7 text-status-success",
    content: "space-y-4",
  },
  signalRow: {
    root: "flex flex-col gap-2 rounded-lg border border-border bg-surface p-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4",
    label: "shrink-0 text-sm text-muted-foreground",
    value: "max-w-52 text-sm leading-6 font-medium sm:text-right",
  },
} as const;

export { publicHomeScreenStyles };
